import User from '../models/userModel.js';

const CREDITS_PER_REFERRAL = 10;
const CREDITS_TO_UNLOCK_TEMPLATE = 10;

// Get or create user profile
export async function getOrCreateUser(req, res) {
  try {
    const { uid, email, displayName } = req.user;
    const { referralCode } = req.query; // Referral code from query params

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // Create new user
      user = new User({
        firebaseUid: uid,
        email: email || '',
        displayName: displayName || '',
        credits: 0,
      });

      // If they were referred by someone
      if (referralCode) {
        const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
        if (referrer && referrer.firebaseUid !== uid) {
          user.referredBy = referralCode.toUpperCase();

          // Credit the referrer with credits for successful referral
          referrer.referralCount += 1;
          referrer.credits += CREDITS_PER_REFERRAL;

          await referrer.save();
        }
      }

      await user.save();
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        referralCount: user.referralCount,
        credits: user.credits,
        unlockedTemplates: user.unlockedTemplates,
        hasClaimedWelcomeBonus: user.hasClaimedWelcomeBonus,
      },
    });
  } catch (error) {
    console.error('Error getting/creating user:', error);
    res.status(500).json({ success: false, message: 'Failed to get user profile' });
  }
}

// Get user profile
export async function getUserProfile(req, res) {
  try {
    const { uid } = req.user;

    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        referralCount: user.referralCount,
        credits: user.credits,
        unlockedTemplates: user.unlockedTemplates,
        hasClaimedWelcomeBonus: user.hasClaimedWelcomeBonus,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
  }
}

// Validate referral code
export async function validateReferralCode(req, res) {
  try {
    const { code } = req.params;

    const user = await User.findOne({ referralCode: code.toUpperCase() });

    if (!user) {
      return res.json({ success: true, valid: false });
    }

    res.json({
      success: true,
      valid: true,
      referrerName: user.displayName || 'A friend',
    });
  } catch (error) {
    console.error('Error validating referral code:', error);
    res.status(500).json({ success: false, message: 'Failed to validate referral code' });
  }
}

// Unlock a premium template
export async function unlockTemplate(req, res) {
  try {
    const { uid } = req.user;
    const { templateId } = req.body;

    const premiumTemplates = ['executive', 'technical'];

    if (!premiumTemplates.includes(templateId)) {
      return res.status(400).json({ success: false, message: 'Invalid template' });
    }

    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if user has enough credits
    if (user.credits < CREDITS_TO_UNLOCK_TEMPLATE) {
      return res.status(400).json({
        success: false,
        message: `Not enough credits. You need ${CREDITS_TO_UNLOCK_TEMPLATE} credits to unlock a template.`
      });
    }

    if (user.unlockedTemplates.includes(templateId)) {
      return res.status(400).json({ success: false, message: 'Template already unlocked' });
    }

    // Deduct credits and unlock template
    user.credits -= CREDITS_TO_UNLOCK_TEMPLATE;
    user.unlockedTemplates.push(templateId);
    await user.save();

    res.json({
      success: true,
      message: 'Template unlocked successfully!',
      credits: user.credits,
      unlockedTemplates: user.unlockedTemplates,
    });
  } catch (error) {
    console.error('Error unlocking template:', error);
    res.status(500).json({ success: false, message: 'Failed to unlock template' });
  }
}

// Get referral stats
export async function getReferralStats(req, res) {
  try {
    const { uid } = req.user;

    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      stats: {
        referralCode: user.referralCode,
        referralCount: user.referralCount,
        credits: user.credits,
        unlockedTemplates: user.unlockedTemplates,
        creditsPerReferral: CREDITS_PER_REFERRAL,
        creditsToUnlock: CREDITS_TO_UNLOCK_TEMPLATE,
      },
    });
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch referral stats' });
  }
}

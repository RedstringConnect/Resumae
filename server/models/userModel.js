import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      default: '',
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredBy: {
      type: String, // referral code of the person who referred them
      default: null,
    },
    referralCount: {
      type: Number,
      default: 0,
    },
    credits: {
      type: Number,
      default: 0,
    },
    unlockedTemplates: {
      type: [String],
      default: [],
    },
    hasClaimedWelcomeBonus: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Generate a unique referral code before saving
userSchema.pre('save', async function (next) {
  if (!this.referralCode) {
    // Generate a short, readable referral code
    const generateCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let code = generateCode();
    let attempts = 0;
    const maxAttempts = 10;

    // Ensure uniqueness
    while (attempts < maxAttempts) {
      const existingUser = await mongoose.model('User').findOne({ referralCode: code });
      if (!existingUser) break;
      code = generateCode();
      attempts++;
    }

    this.referralCode = code;
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;

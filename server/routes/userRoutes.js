import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  getOrCreateUser,
  getUserProfile,
  validateReferralCode,
  unlockTemplate,
  getReferralStats,
} from '../controllers/userController.js';

const router = express.Router();

// Public route - validate referral code
router.get('/validate-referral/:code', validateReferralCode);

// Protected routes
router.get('/profile', verifyToken, getUserProfile);
router.get('/init', verifyToken, getOrCreateUser);
router.get('/referral-stats', verifyToken, getReferralStats);
router.post('/unlock-template', verifyToken, unlockTemplate);

export default router;

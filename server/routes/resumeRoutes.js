import { Router } from 'express';
import {
  getUserResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
} from '../controllers/resumeController.js';
import { verifyToken, verifyOwnership } from '../middleware/authMiddleware.js';

const router = Router();

// All routes require authentication
router.get('/resumes/:userId', verifyToken, verifyOwnership, getUserResumes);
router.get('/resume/:id', verifyToken, getResumeById);
router.post('/resumes', verifyToken, createResume);
router.put('/resume/:id', verifyToken, updateResume);
router.delete('/resume/:id', verifyToken, deleteResume);

export default router;


import { Router } from 'express';
import {
  getUserResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
} from '../controllers/resumeController.js';

const router = Router();

router.get('/resumes/:userId', getUserResumes);
router.get('/resume/:id', getResumeById);
router.post('/resumes', createResume);
router.put('/resume/:id', updateResume);
router.delete('/resume/:id', deleteResume);

export default router;


import express from 'express';
import { 
  reviewResume, 
  explainCode, 
  summarizeText, 
  generateEmail, 
  interviewPractice 
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/resume', protect, reviewResume);
router.post('/explain-code', protect, explainCode);
router.post('/summarize', protect, summarizeText);
router.post('/email', protect, generateEmail);
router.post('/interview', protect, interviewPractice);

export default router;

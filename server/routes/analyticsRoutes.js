import express from 'express';
import { getDashboardData, getAnalyticsCharts } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboardData);
router.get('/charts', protect, getAnalyticsCharts);

export default router;

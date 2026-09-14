const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// GET /api/reports/today — Redis-cached today's summary & remaining budget
router.get('/today', reportController.getTodaySummary);

// GET /api/reports/weekly — Redis-cached 7-day nutrition report
router.get('/weekly', reportController.getWeeklyReport);

// GET /api/reports/analytics — Redis-cached multi-period analytics (7d, 15d, custom, mealType)
router.get('/analytics', reportController.getAnalyticsReport);

// Fallback route
router.get('/', reportController.getReports);

module.exports = router;

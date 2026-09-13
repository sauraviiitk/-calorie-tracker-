const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/reports/weekly — Redis-cached weekly nutrition report
router.get('/weekly', protect, reportController.getWeeklyReport);

// Original placeholder route (kept for backwards compat)
router.get('/', reportController.getReports);

module.exports = router;

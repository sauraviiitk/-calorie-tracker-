const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

// Existing: streaming AI chat (unchanged)
router.post('/chat', aiController.chat);

// New: async food image analysis via BullMQ
// POST /api/ai/analyze-food — upload image, enqueue job, return jobId
router.post('/analyze-food', upload.single('image'), aiController.analyzeFood);

// GET /api/ai/analyze-food/:jobId/status — poll job status (user-scoped)
router.get('/analyze-food/:jobId/status', aiController.getAnalysisStatus);

module.exports = router;

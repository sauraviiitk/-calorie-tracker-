const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

// Protect all goal routes
router.use(protect);

router.route('/')
  .get(goalController.getGoals)
  .post(goalController.createOrUpdateGoal)
  .put(goalController.createOrUpdateGoal);

router.get('/range', goalController.getGoalsRange);

module.exports = router;

const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/')
  .get(mealController.getMeals)
  .post(upload.single('image'), mealController.createMeal);

router.route('/:id')
  .put(mealController.updateMeal)
  .delete(mealController.deleteMeal);

module.exports = router;

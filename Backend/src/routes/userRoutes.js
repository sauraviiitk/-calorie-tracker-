const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// PUT /api/users/profile
// Protected route, accepts multipart form data for 'avatar' field
router.put('/profile', protect, upload.single('avatar'), userController.updateProfile);

module.exports = router;

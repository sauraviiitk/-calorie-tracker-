const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.updateProfile = asyncHandler(async (req, res, next) => {
    const userId = req.user.id; // from auth middleware
    const { name } = req.body;
    let updateData = {};

    if (name) {
      updateData.name = name;
    }

    if (req.file) {
      // Cloudinary returns the URL in req.file.path
      updateData.avatarUrl = req.file.path;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      }
    });

    res.status(200).json({
      success: true,
      data: updatedUser
    });
});

const authService = require('../services/authService');
const { generateToken } = require('../utils/token');
const { registerSchema, loginSchema } = require('../utils/schemas');

const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  
  // Validate request
  registerSchema.parse({ body: req.body });

  const user = await authService.registerUser({ name, email, password });
  
  res.status(201).json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || null,
      token: generateToken(user.id),
    },
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  
  // Validate request
  loginSchema.parse({ body: req.body });

  const user = await authService.loginUser({ email, password });

  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || null,
      token: generateToken(user.id),
    },
  });
});

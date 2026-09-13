const mealService = require('../services/mealService');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.createMeal = asyncHandler(async (req, res, next) => {
    const { name, mealType, quantity, unit, calories, protein, carbs, fat, date, imageUrl } = req.body;

    if (protein === undefined || protein === null || protein === '') return next(new AppError('Protein is required', 400));
    if (carbs === undefined || carbs === null || carbs === '') return next(new AppError('Carbs are required', 400));
    if (fat === undefined || fat === null || fat === '') return next(new AppError('Fat is required', 400));
    const mealData = {
      name,
      mealType: mealType || 'Uncategorized',
      quantity: quantity ? parseFloat(quantity) : null,
      unit: unit || null,
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fat: parseFloat(fat),
      date: date ? new Date(date) : undefined,
    };
    
    if (req.file) {
      mealData.imageUrl = `/uploads/${req.file.filename}`;
    } else if (imageUrl) {
      mealData.imageUrl = imageUrl;
    }

    const meal = await mealService.addMeal(req.user.id, mealData);
    res.status(201).json({ success: true, data: meal });
});

exports.getMeals = asyncHandler(async (req, res, next) => {
    const { date, startDate, endDate, page, limit, mealType } = req.query;
    const options = {};
    if (startDate && endDate) {
      options.startDate = startDate;
      options.endDate = endDate;
    } else if (date) {
      options.dateStr = date;
    }
    if (page) options.page = page;
    if (limit) options.limit = limit;
    if (mealType) options.mealType = mealType;

    const result = await mealService.getUserMeals(req.user.id, options);
    
    const responsePayload = { 
      success: true, 
      count: result.meals.length, 
      data: result.meals 
    };

    if (page && limit) {
      responsePayload.pagination = {
        total: result.total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(result.total / parseInt(limit, 10))
      };
    } else {
      responsePayload.total = result.total;
    }

    res.status(200).json(responsePayload);
});

exports.updateMeal = asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return next(new AppError('Invalid meal ID', 400));
    const { name, mealType, quantity, unit, calories, protein, carbs, fat } = req.body;
    
    if (protein === undefined || protein === null || protein === '') return next(new AppError('Protein is required', 400));
    if (carbs === undefined || carbs === null || carbs === '') return next(new AppError('Carbs are required', 400));
    if (fat === undefined || fat === null || fat === '') return next(new AppError('Fat is required', 400));

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (mealType !== undefined) updateData.mealType = mealType;
    if (quantity !== undefined) updateData.quantity = parseFloat(quantity);
    if (unit !== undefined) updateData.unit = unit;
    if (calories !== undefined) updateData.calories = parseFloat(calories);
    updateData.protein = parseFloat(protein);
    updateData.carbs = parseFloat(carbs);
    updateData.fat = parseFloat(fat);

    const meal = await mealService.updateMeal(req.user.id, id, updateData);
    res.status(200).json({ success: true, data: meal });
});

exports.deleteMeal = asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return next(new AppError('Invalid meal ID', 400));
    await mealService.deleteMeal(req.user.id, id);
    res.status(200).json({ success: true, message: 'Meal deleted' });
});

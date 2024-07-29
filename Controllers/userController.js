const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

// Utility function to filter allowed fields from an object
const filteredObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Controller to get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});

// Middleware to set the user's ID in the request parameters
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Controller to update the current user's details
exports.updateMe = catchAsync(async (req, res, next) => {
    console.log("req.file=", req.file);
    console.log("req.body=", req.body);
  // 1) Create an error if the user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Update user document
  const filteredBody = filteredObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: { user: updatedUser },
  });
});

// Controller to deactivate the current user's account
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Factory function calls for CRUD operations
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);

// Do not update users with this factory function
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

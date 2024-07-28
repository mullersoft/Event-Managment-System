const AppError = require("./../utils/appError");

/**
 * Handles Mongoose validation errors.
 * @param {Object} err - The error object.
 * @returns {AppError} - The formatted AppError object.
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

/**
 * Handles JWT authentication errors.
 * @param {Object} err - The error object.
 * @returns {AppError} - The formatted AppError object.
 */
const handleJWTError = (err) => {
  return new AppError("Invalid token. Please log in again.", 401);
};

/**
 * Handles JWT token expiration errors.
 * @param {Object} err - The error object.
 * @returns {AppError} - The formatted AppError object.
 */
const handleJWTExpiredError = (err) => {
  return new AppError("Your token has expired! Please log in again.", 401);
};

/**
 * Handles Mongoose cast errors.
 * @param {Object} err - The error object.
 * @returns {AppError} - The formatted AppError object.
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

/**
 * Handles Mongoose duplicate field errors.
 * @param {Object} err - The error object.
 * @returns {AppError} - The formatted AppError object.
 */
const handleDuplicateFieldsDB = (err) => {
  const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

/**
 * Sends error response in development mode.
 * @param {Object} err - The error object.
 * @param {Object} res - The response object.
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

/**
 * Sends error response in production mode.
 * @param {Object} err - The error object.
 * @param {Object} res - The response object.
 */
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Operational, trusted error: send message to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: do not leak error details
    // 1) Log error
    console.error("ERROR", err);
    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

/**
 * Global error handler middleware.
 * @param {Object} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, message: err.message };

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError(error);
    if (error.name === "TokenExpiredError")
      error = handleJWTExpiredError(error);

    sendErrorProd(error, res);
  }
};

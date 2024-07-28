class AppError extends Error {
  /**
   * Custom error class for handling application errors.
   * @param {string} message - The error message to be sent.
   * @param {number} statusCode - The HTTP status code associated with the error.
   */
  constructor(message, statusCode) {
    super(message); // Call the parent constructor with the error message
    this.statusCode = statusCode; // Store the status code
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"; // Determine if the error is operational or not
    this.isOperational = true; // Flag to identify if the error is operational
    Error.captureStackTrace(this, this.constructor); // Capture the stack trace
  }
}

module.exports = AppError;

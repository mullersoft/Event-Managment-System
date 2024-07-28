const express = require("express");
const eventRoute = require("./routes/eventRoute");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./Controllers/errorController");
const userRouter = require("./routes/userRoutes");
const rateLimiter = require("express-rate-limit");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const reviewRouter = require("./routes/reviewRoute");

const app = express();

// 1) Global Middleware

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from the same API
const limiter = rateLimiter({
  max: 100, // Maximum number of requests
  windowMs: 60 * 60 * 1000, // 1 hour window
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

// Body-parser: reading data from body into req.body
// Middleware to parse JSON bodies
app.use(express.json({ limit: "10kb" }));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS attacks
app.use(xss());

// Prevent parameter pollution
app.use(hpp({ whitelist: ["duration"] }));

// 2) Routes
app.use("/api/v1/event", eventRoute);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// Handling unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

// Export the app for use in other files
module.exports = app;

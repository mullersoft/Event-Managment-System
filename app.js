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
const { whitelist } = require("validator");
const hpp = require("hpp");
const reviewRouter = require("./routes/reviewRoute");

const app = express();
//1)Global midlwares
// set security http headers
app.use(helmet());
//development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//limit request from the same API
const limiter = rateLimiter({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: "to many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);
//body-parser, reading data from body into req.body
// Middleware to parse JSON bodies
app.use(express.json({ limit: "10kb" }));

//  Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));
//data sanitization for Nosql query language
app.use(mongoSanitize());
// data sanitization for against XSS attack
app.use(xss());
// prevent parametr pollution
app.use(hpp({ whitelist: ["duration"] }));
//2)Routes
app.use("/api/v1/event", eventRoute);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
//Handling Unhandled Routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
// Export the app for use in other files
module.exports = app;

const express = require("express");
const eventRoute = require("./routes/eventRoute");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./Controllers/errorController");
const app = express();
// Middleware to parse JSON bodies
app.use(express.json());
//  Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));
app.use("/api/v1/event", eventRoute);
//Handling Unhandled Routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
// Export the app for use in other files
module.exports = app;

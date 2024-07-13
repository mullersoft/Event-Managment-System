const express = require("express");
const eventRoute = require("./routes/eventRoute");
const app = express();
// Middleware to parse JSON bodies
app.use(express.json());
//  Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));
app.use("/api/v1/event", eventRoute);
//Handling Unhandled Routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "`Can't find ${req.originalUrl} on this server!`",
  });
  //   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Export the app for use in other files
module.exports = app;

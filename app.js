const express = require("express");
const eventRoute = require("./routes/eventRoute");
const app = express();
// Middleware to parse JSON bodies
app.use(express.json());
//  Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));
app.use("/api/v1/event", eventRoute);

// Export the app for use in other files
module.exports = app;

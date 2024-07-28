const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("Uncaught exception --> Shutting down");
  console.log(err.name, err.message);
  process.exit(1); // Exit process with failure
});

// Load environment variables from config.env file
dotenv.config({ path: "./config.env" });

const app = require("./app");

// Connect to the MongoDB database
mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(() => console.log("DB connection successful!"));

// Define the port to listen on
const port = process.env.PORT || 3000;

// Start the server
const server = app.listen(port, () => {
  console.log(`App running on port ${port} -> ${process.env.NODE_ENV}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection --> Shutting down");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1); // Exit process with failure
  });
});

const mongoose = require("mongoose");
const dotenv = require("dotenv");
// errors of none declared variables (uncaughtException)
process.on("uncaughtException", (err) => {
  console.log("uncaught exception -->shutting down");
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: "./config.env" });
const app = require("./app");
mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(() => console.log("DB connection successful!"));
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}->${process.env.NODE_ENV}`);
});
// errors outside express(unhandled rejection)
process.on("unhandledRejection", (err) => {
  console.log("unhandler rejection -->shutting down");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

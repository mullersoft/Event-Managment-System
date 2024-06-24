const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define schema for User
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "organizer", "participant"],
    default: "participant",
  },
  createdAt: { type: Date, default: Date.now },
});
// Create a model using schema
const User = mongoose.model("User", userSchema);
module.exports = User;

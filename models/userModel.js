const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
// Define schema for User
const userSchema = new Schema({
  name: { type: String, required: [true, "please provide your name"] },
  email: {
    type: String,
    required: [true, "please tell as your email"],
    unique: true,
    lowercase: true,
    validator: [validator.isEmail, "please provide a valid email"],
  },
  photo: { type: String },
  password: { type: String, required: [true, "please provide a password"] ,minLength:8},
  passwordConfirm: { type: String, required: [true,'please confirm your password '],
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

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
// Define schema for User
const userSchema = new Schema({
  name: { type: String, required: [true, "please provide your name"] },
  email: {
    type: String,
    required: [true, "please tell as your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  photo: { type: String },
  password: {
    type: String,
    required: [true, "please provide a password"],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password "],
    //custom validation
    validate: {
      //this only works on create and save.
      validator: function (el) {
        return el === this.password;
      },
      message: "password are not the same",
    },
  },
  role: {
    type: String,
    enum: ["admin", "organizer", "participant"],
    default: "participant",
  },
  createdAt: { type: Date, default: Date.now },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  //hashing the password
  this.password = await bcrypt.hash(this.password, 12);
  //delete password confirm field
  this.passwordConfirm = undefined;
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
// Create a model using schema
const User = mongoose.model("User", userSchema);
module.exports = User;

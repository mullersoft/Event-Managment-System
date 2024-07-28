const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

// Define schema for User
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
  }, // User's name, required
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  }, // User's email, required, must be unique and valid
  photo: {
    type: String,
  }, // User's photo URL
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  }, // User's password, required, must be at least 8 characters long
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    // Custom validation to ensure password and passwordConfirm match
    validate: {
      // This only works on CREATE and SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  }, // Field to confirm password, required
  role: {
    type: String,
    enum: ["admin", "organizer", "participant"],
    default: "participant",
  }, // User's role, default is "participant"
  createdAt: {
    type: Date,
    default: Date.now,
  }, // Date when the user was created
  passwordChangedAt: Date, // Date when the password was last changed
  passwordResetToken: String, // Token for password reset
  passwordResetExpires: Date, // Expiration time for the password reset token
  active: {
    type: Boolean,
    default: true,
    select: false,
  }, // Indicates if the user is active, default is true
});

// Pre-save middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Pre-save middleware to set the passwordChangedAt field when the password is changed
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Query middleware to exclude inactive users from results
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// Instance method to check if the entered password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if the user changed their password after the JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instance method to create a password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

  return resetToken;
};

// Create a model using the schema
const User = mongoose.model("User", userSchema);

module.exports = User; // Export the User model

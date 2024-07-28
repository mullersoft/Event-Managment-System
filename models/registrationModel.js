const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema for Registration
const registrationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the User model, required
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  }, // Reference to the Event model, required
  status: {
    type: String,
    enum: ["registered", "cancelled"], // Status of registration, can be 'registered' or 'cancelled'
    default: "registered", // Default status is 'registered'
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  }, // Registration date, default is current date and time
});

// Create a model using schema
const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration; // Export the Registration model

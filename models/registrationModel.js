const mongoose = require("mongoose"); // Import Mongoose for MongoDB interactions
const Schema = mongoose.Schema; // Alias for Mongoose Schema

// Define schema for Registration
const registrationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true, // Reference to the User model, required
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true, // Reference to the Event model, required
  },
  registrationStatus: {
    type: String,
    enum: ["registered", "cancelled", "confirmed"], // Status of registration, can be 'registered', 'cancelled', or 'confirmed'
    default: "registered", // Default status is 'registered'
  },
  registeredAt: {
    type: Date,
    default: Date.now, // Registration date, default is the current date and time
  },
});

// Query middleware to populate user and event information in registration documents
registrationSchema.pre(/^find/, function (next) {
  this.populate({
    path: "event",
    select: "-__v", // Populate the 'event' field excluding the '__v' field from the Event model
  }).populate({
    path: "user",
    select: "-__v", // Populate the 'user' field excluding the '__v' field from the User model
  });
  next(); // Proceed to the next middleware or query execution
});

// Create a model using the schema
const Registration = mongoose.model("Registration", registrationSchema);

// Export the Registration model
module.exports = Registration;

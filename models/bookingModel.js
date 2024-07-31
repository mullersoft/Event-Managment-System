const mongoose = require("mongoose");
const Event = require("./eventModel");
const Schema = mongoose.Schema;

// Define schema for Review
const bookingSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: [true, "Booking must belong to an event"],
  }, // Reference to the Event model, indicating which event the review is for
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a user"],
  }, // Reference to the User model, indicating which user created the review
  price: {
    type: Number,
    required: [true, "Booking must have "],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  }, // The date when the review was created, default is current date
  paid: {
    type: Boolean,
    default: true,
  },
});
// Query middleware to populate user information
bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  }).populate({ path: "event", select: "title" })
  next();
});

// Create a model using schema
const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking; // Export the Review model

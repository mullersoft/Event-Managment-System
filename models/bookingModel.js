const mongoose = require("mongoose"); // Import Mongoose for MongoDB interactions
const Event = require("./eventModel"); // Import Event model for reference
const Schema = mongoose.Schema; // Alias for Mongoose Schema

// Define schema for Booking
const bookingSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: [true, "Booking must belong to an event"], // Reference to the Event model, indicating which event the booking is for
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a user"], // Reference to the User model, indicating which user made the booking
  },
  price: {
    type: Number,
    required: [true, "Booking must have a price"], // The price for the booking
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "unpaid", "failed", "refunded"], // Possible values for payment status
    default: "unpaid", // Default status is 'unpaid'
  },
  // bookingStatus: {
  //   type: String,
  //   enum: ["confirmed", "cancelled", "attended"],
  //   required: true,
  // },
  createdAt: {
    type: Date,
    default: Date.now(), // The date when the booking was created, default is the current date
  },
});
// Query middleware to populate user and event information in booking documents
bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo", // Populate the 'user' field with 'name' and 'photo' fields from the User model
  }).populate({
    path: "event",
    select: "title", // Populate the 'event' field with 'title' field from the Event model
  });
  next(); // Proceed to the next middleware or query execution
});

// Create a model using the schema
const Booking = mongoose.model("Booking", bookingSchema);

// Export the Booking model
module.exports = Booking;

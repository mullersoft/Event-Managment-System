const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema for Event
const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true }, // Title of the event, required and trimmed
    description: { type: String, required: true }, // Description of the event, required
    startDate: { type: Date, required: true }, // Start date of the event, required
    endDate: { type: Date, required: true }, // End date of the event, required
    duration: { type: Number, required: true }, // Duration of the event in days, required
    location: {
      type: {
        type: String,
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: { type: [Number], required: true }, // Coordinates [longitude, latitude], required
      formattedAddress: { type: String, required: true }, // Formatted address, required
    },
    capacity: { type: Number, required: true }, // Capacity of the event, required
    organizers: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of user IDs referencing the User model
    registrations: [{ type: Schema.Types.ObjectId, ref: "Registration" }], // Array of registration IDs referencing the Registration model
    createdAt: { type: Date, default: Date.now, select: false }, // Creation date, default is now, not selected by default
    category: { type: String, required: true }, // Category of the event, required
    price: {
      type: Number,
      required: [true, "an event must have a price"], // Price of the event, required with a custom error message
      default: 0, // Default price is 0
    },
    status: {
      type: String,
      enum: ["Scheduled", "Cancelled", "Completed"], // Status of the event, must be one of these values
      default: "Scheduled", // Default status is 'Scheduled'
    },
    tags: [String], // Array of tags for the event
    imageUrl: { type: String }, // URL of the event's image
    agenda: { type: String }, // Agenda of the event
    speakers: [{ type: String }], // Array of speakers for the event
    sponsors: [{ type: String }], // Array of sponsors for the event
    ratingsAverage: {
      type: Number,
      default: 4.5, // Default average rating is 4.5
      min: [1, "rating must be above 1.0"], // Minimum rating is 1.0 with a custom error message
      max: [5, "rating must be below 5.0"], // Maximum rating is 5.0 with a custom error message
      set: (val) => Math.round(val * 10) / 10, // Round value to one decimal place
    },
    ratingsQuantity: {
      type: Number,
      default: 0, // Default quantity of ratings is 0
    },
  },
  {
    toJSON: { virtuals: true }, // Include virtuals when toJSON is called
    toObject: { virtuals: true }, // Include virtuals when toObject is called
  }
);

// Indexes
eventSchema.index({ price: 1, ratingsAveragePrice: -1 }); // Index for sorting by price and average rating
eventSchema.index({ location: "2dsphere" }); // Geospatial index for location

// Virtual populate
eventSchema.virtual("reviews", {
  ref: "Review", // Reference the Review model
  foreignField: "event", // Use the event field in the Review model
  localField: "_id", // Match with the _id field in the Event model
});

// Query middleware
eventSchema.pre(/^find/, function (next) {
  this.populate({
    path: "organizers",
    select: "-__v -passwordChangedAt",
  }) // Populate organizers field, excluding __v and passwordChangedAt fields
  next(); // Call the next middleware
});

// Create a model using schema
const Event = mongoose.model("Event", eventSchema);

module.exports = Event; // Export the Event model

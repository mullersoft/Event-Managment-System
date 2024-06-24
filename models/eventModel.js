const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define schema for Event
const eventSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  // date: { type: Date, required: true },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    formattedAddress: {
      type: String,
      required: true,
    },
  },
  capacity: { type: Number, required: true },
  organizer: { type: Schema.Types.ObjectId, ref: "User" },
  registrations: [{ type: Schema.Types.ObjectId, ref: "Registration" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for geospatial queries
eventSchema.index({ location: "2dsphere" });
// Create a model using schema
const Event = mongoose.model("Event", eventSchema);
module.exports = Event;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define schema for Event
const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number, required: true }, // duration in days
    location: {
      type: {
        type: String,
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: { type: [Number], required: true },
      formattedAddress: { type: String, required: true },
    },
    capacity: { type: Number, required: true },
    organizers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    registrations: [{ type: Schema.Types.ObjectId, ref: "Registration" }],
    createdAt: { type: Date, default: Date.now, select: false },
    category: { type: String, required: true },
    price: {
      type: Number,
      required: [true, "an event must have a price"],
      default: 0,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Cancelled", "Completed"],
      default: "Scheduled",
    },
    tags: [String],
    imageUrl: { type: String },
    agenda: { type: String },
    speakers: [{ type: String }],
    sponsors: [{ type: String }],
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "rating must be above 1.0"],
      max: [5, "rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
eventSchema.index({ price: 1 });
// virtual populate
eventSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "event",
  localField: "_id",
});
//query middleware
eventSchema.pre(/^find/, function (next) {
  this.populate(
    { path: "organizers", select: "-__v -passwordChangedAt" }
    // "organizers"
    // "name email"
  );
  next();
});
// Index for geospatial queries
eventSchema.index({ location: "2dsphere" });
// Create a model using schema
const Event = mongoose.model("Event", eventSchema);
module.exports = Event;

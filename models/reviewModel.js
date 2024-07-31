const mongoose = require("mongoose");
const Event = require("./eventModel");
const Schema = mongoose.Schema;

// Define schema for Review
const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty"],
    }, // The review text, required
    rating: {
      type: Number,
      min: 1,
      max: 5,
    }, // The rating given by the user, must be between 1 and 5
    createdAt: {
      type: Date,
      default: Date.now(),
    }, // The date when the review was created, default is current date
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    }, // Reference to the User model, indicating which user created the review
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Review must belong to an event"],
    }, // Reference to the Event model, indicating which event the review is for
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Ensure each user can only leave one review per event
reviewSchema.index({ event: 1, user: 1 }, { unique: true });

// Query middleware to populate user information
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  // .populate({ path: "event", select: "title" })

  next();
});

// Static method to calculate average ratings for an event
reviewSchema.statics.calcAverageRatings = async function (eventId) {
  const stats = await this.aggregate([
    { $match: { event: eventId } },
    {
      $group: {
        _id: "$event",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  // Update the event with the new average rating and rating quantity
  if (stats.length > 0) {
    await Event.findByIdAndUpdate(eventId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Event.findByIdAndUpdate(eventId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// Middleware to recalculate ratings after a review is saved
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.event);
});

// Middleware to get the document before it is updated
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.model.findOne(this.getFilter());
  next();
});

// Middleware to recalculate ratings after a review is updated or deleted
reviewSchema.post(/^findOneAnd/, async function () {
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.event);
  }
});

// Create a model using schema
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review; // Export the Review model

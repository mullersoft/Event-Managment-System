const mongoose = require("mongoose");
const Event = require("./eventModel");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    review: { type: String, required: [true, "Review cannot be empty"] },
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Review must belong to an event"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewSchema.index({ event: 1, user: 1 }, { unique: true });
// Query middleware
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name photo" });
  next();
});
reviewSchema.statics.calcAverageRatings = async function (eventId) {
  const stats = await this.aggregate([
    {
      $match: { event: eventId },
    },
    {
      $group: {
        _id: "$event",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  // console.log("stats=", stats);
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
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.event);
});
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.model.findOne(this.getFilter());
  next();
  // console.log('this.r=',this.r)
});
reviewSchema.post(/^findOneAnd/, async function () {
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.event);
  }
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;

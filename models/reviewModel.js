const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviewSchema = new Schema(
  {
    review: { type: String, required: [true, "review can not be empty"] },
    ratting: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "review  must belong to a user"],
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "review  must belong to an event"],
    },
  },
  {
    toJSON: { virtual: true },
    toObject: { virtual: true },
  }
);
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;

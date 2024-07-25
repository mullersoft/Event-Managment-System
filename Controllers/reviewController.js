const Review = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.eventId) filter = { event: req.params.eventId };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews },
  });
});
exports.setEventUserIds =  (req, res, next) => {
  //allow nested routes
  if (!req.body.event) req.body.event = req.params.eventId;
  if (!req.body.user) req.body.user = req.user.id;
next()}
exports.createReviews = factory.createOne(Review)
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

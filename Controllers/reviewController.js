const Review = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");
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
exports.createReviews = catchAsync(async (req, res, next) => {
  //allow nested routes
  if (!req.body.event) req.body.event = req.params.eventId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: "success",
    results: newReview.length,
    data: { newReview },
  });
});

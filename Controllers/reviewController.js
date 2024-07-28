const Review = require("./../models/reviewModel");
const factory = require("./handlerFactory");

// Middleware to set the event and user IDs for reviews
exports.setEventUserIds = (req, res, next) => {
  // Allow nested routes by setting the event and user IDs if they are not provided
  if (!req.body.event) req.body.event = req.params.eventId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// Factory function calls for CRUD operations on reviews
exports.createReviews = factory.createOne(Review); // Create a new review
exports.getAllReviews = factory.getAll(Review); // Retrieve all reviews
exports.getReview = factory.getOne(Review); // Retrieve a single review by ID
exports.updateReview = factory.updateOne(Review); // Update a review by ID
exports.deleteReview = factory.deleteOne(Review); // Delete a review by ID

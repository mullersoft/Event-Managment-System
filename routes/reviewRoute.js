const express = require("express");
const authController = require("../controllers/authController");
const reviewController = require("./../controllers/reviewController");
const router = express.Router({ mergeParams: true });

// Protect all routes after this middleware
router.use(authController.protect);

// Routes for reviews
router.route("/").get(reviewController.getAllReviews).post(
  authController.restrictedTo("participant"),
  reviewController.setEventUserIds, // Ensure this middleware is correct for setting event and user IDs
  reviewController.createReviews
);

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrictedTo("participant", "admin"),
    reviewController.updateReview
  )
  .delete(
    authController.restrictedTo("participant", "admin"),
    reviewController.deleteReview
  );

module.exports = router;

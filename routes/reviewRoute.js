const express = require("express");
const authController = require("../controllers/authController");
const reviewController = require("./../controllers/reviewController");
const router = express.Router({ mergeParams: true });
// protect all routes after this middleware
router.use(authController.protect);
router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictedTo("participant"),
    reviewController.setEventUserIds,
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

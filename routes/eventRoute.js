const express = require("express");
const router = express.Router();
const eventController = require("../Controllers/eventController");
const authController = require("../controllers/authController");
const reviewRouter = require("../routes/reviewRoute");
// const authMiddleware = require("../middleware/authMiddleware");
router.use("/:eventId/reviews",reviewRouter)
// Route to get all events
router
  .route("/")
  .get(authController.protect, eventController.getAllEvents)
  .post(eventController.createEvent);
router
  .route("/:id")
  .get(eventController.getEventById)
  .patch(eventController.updateEvent)
  .delete(
    authController.protect,
    authController.restrictedTo("admin"),
    eventController.deleteEvent
);
//   //nested route
// router
//   .route("/:eventId/reviews")
//   .post(
//     authController.protect,
//     authController.restrictedTo("participant"),
//     reviewController.createReviews
//   );
module.exports = router;

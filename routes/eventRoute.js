const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoute");

// Nested route for reviews
router.use("/:eventId/reviews", reviewRouter);

router
  .route("/")
  .get(eventController.getAllEvents)
  .post(
    authController.protect,
    authController.restrictedTo("admin", "organizer"),
    eventController.createEvent
  );

router
  .route("/:id")
  .get(eventController.getEventById)
  .patch(
    authController.protect,
    authController.restrictedTo("admin", "organizer"),
    eventController.updateEvent
  )
  .delete(
    authController.protect,
    authController.restrictedTo("admin", "organizer"),
    eventController.deleteEvent // Correctly use deleteEvent here
  );
module.exports = router;

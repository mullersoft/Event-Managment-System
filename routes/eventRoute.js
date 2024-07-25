const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoute");

// Nested route for reviews
router.use("/:eventId/reviews", reviewRouter);

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
    eventController.deleteEvent // Correctly use deleteEvent here
  );
module.exports = router;

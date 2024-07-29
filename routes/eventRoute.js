const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoute");

// Nested route for reviews under each event
router.use("/:eventId/reviews", reviewRouter);
// Route to get events within a specified distance from a given location
router
  .route("/events-within/:distance/center/:latlng/unit/:unit")
  .get(eventController.getEventsWithin);
// Route to get distances to events from a given location
router.route("/distances/:latlng/unit/:unit").get(eventController.getDistances);
// Route to get all events and create a new event
router
  .route("/")
  .get(eventController.getAllEvents)
  .post(
    authController.protect,
    authController.restrictedTo("admin", "organizer"),
    eventController.createEvent
  );
// Routes for specific event by ID: get, update, delete
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
    eventController.deleteEvent
  );

module.exports = router;

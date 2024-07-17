const express = require("express");
const router = express.Router();
const eventController = require("./../Controllers/eventController");
const authController = require("../controllers/authController");
// const authMiddleware = require("../middleware/authMiddleware");
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
    authController.restrictedTo('admin'),
    eventController.deleteEvent
  );
module.exports = router;

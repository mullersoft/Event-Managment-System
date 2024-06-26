const express = require("express");
const router = express.Router();
const eventController = require("./../Controllers/eventController");
// const authMiddleware = require("../middleware/authMiddleware");
// Route to get all events
router.get("/", eventController.getAllEvents);
// Route to get a single event by ID
router.get("/:id", eventController.getEventById);
// Route to create a new event (restricted to organizers/admins)
router.post("/",
  //   authMiddleware.verifyToken,
  //   authMiddleware.verifyRole(["organizer", "admin"]),
  eventController.createEvent
);
// Route to update an event by ID (restricted to organizers/admins)
// router.put(
//   "/:id",
//   authMiddleware.verifyToken,
//   authMiddleware.verifyRole(["organizer", "admin"]),
//   eventController.updateEvent
// );
// Route to delete an event by ID (restricted to organizers/admins)
// router.delete(
//   "/:id",
//   authMiddleware.verifyToken,
//   authMiddleware.verifyRole(["organizer", "admin"]),
//   eventController.deleteEvent
// );
module.exports = router;

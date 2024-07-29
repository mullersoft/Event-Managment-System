const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");
const authController = require("../controllers/authController");

// Protect all routes after this middleware
router.use(authController.protect);
router.get(
  "/all",
  authController.restrictedTo("admin"),
  registrationController.getAllRegistrations
);
// Register for an event
router.post("/register/:eventId", registrationController.registerForEvent);

// Cancel registration
router.patch("/cancel/:eventId", registrationController.cancelRegistration);
router.get('/:id', registrationController.getRegistration); // Add this line


module.exports = router;

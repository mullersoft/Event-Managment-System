const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");
const authController = require("../controllers/authController");

// Protect all routes after this middleware
router.use(authController.protect);

// Register for an event
router.post("/register/:eventId", registrationController.registerForEvent);

// Cancel registration
router.patch("/cancel/:eventId", registrationController.cancelRegistration);

module.exports = router;

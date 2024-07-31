const express = require("express");
const authController = require("../controllers/authController");
const bookingController = require("./../controllers/bookingController");
const router = express.Router();
router.get(
  "/checkout-session/:eventId",
  authController.protect,
  bookingController.getCheckoutSession
);
module.exports = router;

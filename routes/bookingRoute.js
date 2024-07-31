const express = require("express");
const authController = require("../controllers/authController");
const bookingController = require("./../controllers/bookingController");

const router = express.Router();
router.use(authController.protect);
router.get("/checkout-session/:eventId", bookingController.getCheckoutSession);

// Webhook endpoint to handle Stripe events
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  bookingController.webhookCheckout
);
router.use(authController.restrictedTo("admin", "organizer"));
router
  .route("/")
  .get(bookingController.getAllBooking)
  .post(bookingController.createBooking);
router
  .route("/:id")
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);
module.exports = router;

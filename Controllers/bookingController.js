const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Event = require("../models/eventModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");


exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get currently booked event
  const event = await Event.findById(req.params.eventId);
  if (!event) {
    return next(new AppError("No event found with that ID", 404));
  }

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/?event=${
      req.params.eventId
    }&user=${req.user.id}&price=${event.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/event/${event._id}`,
    customer_email: req.user.email,
    client_reference_id: req.params.eventId,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${event.name} Event`,
            description: event.summary,
          },
          unit_amount: event.price * 100, // Stripe expects the amount in cents, not dollars
        },
        quantity: 1,
      },
    ],
  });

  // 3) Send session as a response
  res.status(200).json({
    status: "success",
    session,
  });
});

// Webhook handler to create a booking after successful payment
exports.webhookCheckout = (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    createBooking(event.data.object);
  }

  res.status(200).json({ received: true });
};

const createBooking = async (session) => {
  const { client_reference_id, customer_email, amount_total } = session;
  const user = await User.findOne({ email: customer_email });
  const event = client_reference_id;
  const price = amount_total / 100;

  await Booking.create({ user: user._id, event, price });
};
// Factory function calls for CRUD operations on booking
exports.createBooking = factory.createOne(Booking); // Create a new Booking
exports.getAllBooking = factory.getAll(Booking); // Retrieve all Booking
exports.getBooking = factory.getOne(Booking); // Retrieve a single Booking by ID
exports.updateBooking = factory.updateOne(Booking); // Update a Booking by ID
exports.deleteBooking = factory.deleteOne(Booking); // Delete a Booking by ID
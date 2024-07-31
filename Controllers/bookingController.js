const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Event = require("../models/eventModel");
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
    success_url: `${req.protocol}://${req.get("host")}/`,
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
            // images: [`https://www.natours.dev/img/tours/S{event.imageUrl}`], // Add image URL if necessary
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

const catchAsync = require('../utils/catchAsync');
const Registration = require('../models/registrationModel');
const Event = require('../models/eventModel');
const AppError = require('../utils/appError');


exports.registerForEvent = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  // Check if the user is already registered
  const existingRegistration = await Registration.findOne({
    user: userId,
    event: eventId,
  });
  if (existingRegistration) {
    return next(
      new AppError("You are already registered for this event.", 400)
    );
  }

  // Create a new registration
  const registration = await Registration.create({
    user: userId,
    event: eventId,
  });

  // Update the Event model to include this registration
  await Event.findByIdAndUpdate(eventId, {
    $push: { registrations: registration._id },
  });

  res.status(201).json({
    status: "success",
    data: {
      registration,
    },
  });
});


// Cancel registration
exports.cancelRegistration = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  // Find and remove the registration
  const registration = await Registration.findOneAndDelete({ user: userId, event: eventId });
  if (!registration) {
    return next(new AppError('No registration found to cancel.', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

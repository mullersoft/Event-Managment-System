const catchAsync = require('../utils/catchAsync');
const Registration = require('../models/registrationModel');
const Event = require('../models/eventModel');
const AppError = require('../utils/appError');
const factory = require("./handlerFactory");

exports.getAllRegistrations = factory.getAll(Registration); 
exports.getRegistration = factory.getOne(Registration);
exports.updateRegistration = factory.updateOne(Registration);
exports.deleteRegistration = factory.deleteOne(Registration);



exports.registerForEvent = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.user.id;
  // Check if the user is already registered
  const existingRegistration = await Registration.findOne({
    user: userId,
    event: eventId,
  });
  // Check if the event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError("Event not found.", 404));
  }
  if (existingRegistration && existingRegistration.status === "registered") {
    return next(
      new AppError("You are already registered for this event.", 400)
    );
  }

  if (existingRegistration && existingRegistration.status === "cancelled") {
    // Update the status back to "registered"
    existingRegistration.status = "registered";
    await existingRegistration.save();

    // Optionally, add the registration back to the Event model
    await Event.findByIdAndUpdate(eventId, {
      $addToSet: { registrations: existingRegistration._id },
    });

    return res.status(200).json({
      status: "success",
      data: {
        registration: existingRegistration,
      },
    });
  }
  // Create a new registration
  const registration = await Registration.create({
    user: userId,
    event: eventId,
  });
  // Optionally, add the new registration to the Event model
  await Event.findByIdAndUpdate(eventId, {
    $addToSet: { registrations: registration._id },
  });
  res.status(201).json({
    status: "success",
    data: {
      registration,
    },
  });
});
exports.cancelRegistration = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.user.id;
  // Find the registration
  const registration = await Registration.findOne({
    user: userId,
    event: eventId,
  });
  if (!registration) {
    return next(new AppError("No registration found to cancel.", 404));
  }
  // Update the registration status to "cancelled"
  registration.status = "cancelled";
  await registration.save();
  // Optionally, remove the registration from the Event model
  await Event.findByIdAndUpdate(eventId, {
    $pull: { registrations: registration._id },
  });
  res.status(200).json({
    status: "success",
    data: {
      registration,
    },
  });
});


const Event = require("../models/eventModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const APIFeatures = require("./../utils/APIFeatures");
// const createEvent = factory.createOne(Event)
const createEvent = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    startDate,
    endDate,
    location,
    capacity,
    category,
    price,
    status,
    tags,
    imageUrl,
    agenda,
    speakers,
    sponsors,
    organizers, // expecting an array of user IDs
  } = req.body;
  // Calculate duration in days, rounded up
  const diffInMilliseconds = new Date(endDate) - new Date(startDate);
  const duration = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24)); // duration in days, rounded up
  // Create new Event instance
  const event = new Event({
    title,
    description,
    startDate,
    endDate,
    duration,
    capacity,
    organizers, // set the organizers field with the array of user IDs
    location: {
      type: "Point",
      coordinates: [location.longitude, location.latitude],
      formattedAddress: location.formattedAddress,
    },
    category,
    price,
    status,
    tags,
    imageUrl,
    agenda,
    speakers,
    sponsors,
  });
  // Save event to database
  const savedEvent = await event.save();
  res.status(201).json({ status: "success", data: { savedEvent } });
});
// const getAllEvents = catchAsync(async (req, res, next) => {
// // try{}
//   // Execute the query
//   const features = new APIFeatures(Event.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const events = await features.query;
//   // Send the response
//   res.status(200).json({
//     status: "success",
//     result: events.length,
//     data: { events },
//   });
// });
const getAllEvents = factory.getAll(Event)
const getEventById = factory.getOne(Event, { path: "reviews" });
const updateEvent = factory.updateOne(Event);
const deleteEvent = factory.deleteOne(Event);
module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};

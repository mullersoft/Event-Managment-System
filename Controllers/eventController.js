const Event = require("./../models/eventModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
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
  res
    .status(201)
    .json({ message: "Event created successfully!", event: savedEvent });
});
const getAllEvents = catchAsync(async (req, res, next) => {
  // Build query
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields"];
  excludeFields.forEach((el) => delete queryObj[el]);

  // Advanced filtering
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  let query = Event.find(JSON.parse(queryString));

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numEvents = await Event.countDocuments();
    if (skip >= numEvents) throw new Error("This page does not exist!");
  }

  // Execute the query
  const events = await query;

  // Send the response
  res.status(200).json({
    status: "success",
    result: events.length,
    data: { events },
  });
});
const getEventById = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate('reviews')
  // Error handling for not found
  if (!event) {
    return next(new AppError("Event not found!", 404));
  }
  res.status(200).json({
    status: "success",
    data: { event },
  });
});

const updateEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Error handling for not found
  if (!event) {
    return next(new AppError("Event not found!", 404));
  }

  res.status(200).json({ status: "success", data: event });
});

const deleteEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  // Error handling for not found
  if (!event) {
    return next(new AppError("Event not found!", 404));
  }

  res.status(204).json({ status: "success", data: null });
});
module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};

const Event = require("./../models/eventModel");
const catchAsync = require("../utils/catchAsync");
const createEvent = catchAsync(async (req, res,next) => {
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
    organizer: req.userId,
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
});
const getAllEvents = catchAsync(async (req, res,next) => {
  // build query
  //1a)filtering
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields"];
  excludeFields.forEach((el) => delete queryObj[el]);
  // const events = await Event.find();
  //2b)advanced filtering
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  // console.log(JSON.parse(queryString))
  let query = Event.find(JSON.parse(queryString));
  //2)sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    console.log(sortBy);
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  // field limiting.join
  if (req.query.fields) {
    const fields = req.query.fields.split(", ").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }
  //pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);
  if (req.query.page) {
    const numEvents = await Event.countDocuments();
    if (skip >= numEvents) throw new Error("This page does not exist!");
  }
  //execute the query
  const events = await query;
  //send the response
  res.status(200).json({
    status: "success",
    result: events.length,
    data: { events },
  });
});
const getEventById = catchAsync(async (req, res,next) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: "Event not found!" });
  }
  res.status(200).json({
    status: "success",
    data: { event },
  });
});
const updateEvent = catchAsync(async (req, res,next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ status: "success", data: event });
});
const deleteEvent = catchAsync(async (req, res,next) => {
  await Event.findByIdAndDelete(req.params.id);
  res.status(204).json({ status: "success", data: null });
});
module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};

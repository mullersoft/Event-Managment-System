const Event = require("../models/eventModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const fs = require("fs");
const path = require("path");
const multer = require("multer")
const sharp = require("sharp");
// Function to ensure directory exists
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
// Define the upload directory relative to the root directory
const uploadDir = path.join(__dirname, '../../public/img/users');
ensureDirExists(uploadDir);
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
const uploadEventImages = upload.fields([
  { name: "imageUrl", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);
const resizeEventImages = (req, res, next) => {
    console.log(req.files);
  // if (!req.file) return next();
  // req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  // sharp(req.file.buffer)
  //   .resize(500, 500)
  //   .toFormat("jpeg")
  //   .jpeg({ quality: 90 })
  //   .toFile(`public/img/users/${req.file.filename}`);
  next();
};


/**
 * Creates a new event.
 * @param {Object} req - The request object containing event data.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
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
    images,
    agenda,
    speakers,
    sponsors,
    organizers, // Expecting an array of user IDs
  } = req.body;

  // Calculate duration in days, rounded up
  const diffInMilliseconds = new Date(endDate) - new Date(startDate);
  const duration = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24)); // Duration in days, rounded up

  // Create new Event instance
  const event = new Event({
    title,
    description,
    startDate,
    endDate,
    duration,
    capacity,
    organizers, // Set the organizers field with the array of user IDs
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
    images,
    agenda,
    speakers,
    sponsors,
  });

  // Save event to database
  const savedEvent = await event.save();

  res.status(201).json({
    status: "success",
    data: { savedEvent },
  });
});


/**
 * Gets all events within a specified distance from a center point.
 * @param {Object} req - The request object containing distance, latitude, longitude, and unit.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getEventsWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    return next(
      new AppError(
        "Please provide latitude and longitude in the format lat,lng",
        400
      )
    );
  }

  const events = await Event.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: "success",
    result: events.length,
    data: { data: events },
  });
});

/**
 * Gets distances of all events from a specified point.
 * @param {Object} req - The request object containing latitude, longitude, and unit.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const multiplier = unit === "mi" ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    return next(
      new AppError(
        "Please provide latitude and longitude in the format lat,lng",
        400
      )
    );
  }

  const distances = await Event.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [lng * 1, lat * 1] },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    { $project: { distance: 1, title: 1 } },
  ]);

  res.status(200).json({
    status: "success",
    data: { data: distances },
  });
});

// Using factory functions for CRUD operations
const getAllEvents = factory.getAll(Event);
const getEventById = factory.getOne(Event, { path: "reviews" });
const updateEvent = factory.updateOne(Event);
const deleteEvent = factory.deleteOne(Event);

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsWithin,
  getDistances,
  uploadEventImages,
  resizeEventImages,
};

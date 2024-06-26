const Event = require("./../models/eventModel");

const createEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, location, capacity } =
      req.body;
    // Create new Event instance
    const event = new Event({
      title,
      description,
      startDate,
      endDate,
      capacity,
      organizer: req.userId,
      location: {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
        formattedAddress: location.formattedAddress,
      },
    });
    // Save event to database
    const savedEvent = await event.save();
    // Return success response
    res
      .status(201)
      .json({ message: "Event created successfully!", event: savedEvent });
  } catch (error) {
    // Handle errors
    console.error("Error creating event:", error);
    res.status(500).send({ message: "Error creating event.", error });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({
      status: "success",
      result: events.length,
      data: { events },
      // events,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "event not found!" });
    }
    res.status(200).json({
      status: "success",
      data: { event },
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching event.", err });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
};

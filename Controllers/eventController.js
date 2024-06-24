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
      location: {
        type: "Point",
        coordinates: [location.longitude, location.latitude], // Assuming coordinates are passed as { latitude, longitude }
        formattedAddress: location.formattedAddress,
      },
      capacity,
      organizer: req.userId, // Assuming req.userId contains the organizer's ObjectId
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

module.exports = {
  createEvent,
};

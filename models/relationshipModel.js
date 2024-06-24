const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define schema for Registration
const registrationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  status: {
    type: String,
    enum: ["registered", "cancelled"],
    default: "registered",
  },
  registeredAt: { type: Date, default: Date.now },
});
// Create a model using schema
const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;

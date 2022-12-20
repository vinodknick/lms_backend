const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  eventName: {
    type: String,
  },
  details: {
    type: String,
  },
  attendees: {
    type: String,
  },
  eventLocation: {
    type: String,
  },
  reminders: {
    type: String,
  },
  matter: {
    type: String,
  },

  startDate: {
    type: String,
  },
  endDate: {
    type: String,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);

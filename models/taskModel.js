const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  taskName: {
    type: String,
  },
  description: {
    type: String,
  },
  assignee: {
    type: String,
  },
  reminders: {
    type: String,
  },
  matter: {
    type: String,
  },
  dueDate: {
    type: String,
  },
  timeEstimate: {
    type: String,
  },
  taskStatus: {
    type: String,
    enum: ["Pending", "In progress", "In review","Complete"],
    // default: "Pending",
  },
  priorityLevel: {
    type: String,
    enum: ["High", "Normal", "Low"],
    // default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema);

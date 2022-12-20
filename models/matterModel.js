const mongoose = require("mongoose");

const matterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  contact: {
    type: mongoose.Schema.ObjectId,
    ref: "Contact",
    required: true,
  },
  clientId: {
    type: String,
  },
  client: {
    type: String,
  },
  matterDescription: {
    type: String,
  },
  responsibleAttorney: {
    type: String,
  },
  originatingAttorney: {
    type: String,
  },
  clientReferenceNumber: {
    type: String,
  },
  location: {
    type: String,
  },
  practiceArea: {
    type: String,
  },
  permissions: {
    type: String,
    enum: ["Me", "Everyone"],
  },
  matterStatus: {
    type: String,
    enum: ["Open", "Closed", "Pending"],
    default: "Pending",
  },
  billableStatus: {
    type: String,
    enum: ["Billable", "Non-billable"],
    default: "Non-billable",
  },
  openDate: {
    type: String,
  },
  closedDate: {
    type: String,
  },
  pendingDate: {
    type: String,
  },
  statuteOfLimitationsDate: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Matter", matterSchema);

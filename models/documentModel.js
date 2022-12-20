const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  docTitle: {
    type: String,
  },
  files: {
    type: Array,
  },
  matter: {
    type: String,
  },
  category: {
    type: String,
    default:"",
  },
  receiveDate: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Document", documentSchema);

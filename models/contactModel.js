const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  contactType:{
    type: String,
    enum: ['Person','Company'],
  },
  clientId:{
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  firstName: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    default: '',
  },
  reminders: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  birthDate: {
    type: String,
    default: '',
  },
  company: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  companyName:{
    type: String,
    default: '',
  },
  website:{
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Contact", contactSchema);

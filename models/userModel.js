const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({

  admin:{
    type: mongoose.Schema.ObjectId,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  phone:{
      type: String,
      unique: true,
  },
  password: {
    type: String,
    select: false, // password should not be selected while fetching all data of user
  },
  confirmPassword: {
    type: String,
    select: false, 
  },
 
  otp:{
    type: String,
    default: "0",
    select:false,
  },
  isOtpVerified:{
    type:String,
    enum:["false", "true"],
    default:false,
  },
  isVerified:{
    type:String,
    enum:["false", "true"],
    default:false,
  },
  token: {
    type: String,
  },
  full_name: {
    type: String,
  },
  social_id:{
    type: String
  },
  profile_pic:{
    type: String,
  },
  firebase_token:{
    type: String,
  },
  user_id:{
type: String,
  },
  role: {
    type: String,
    enum: ["user","admin","super_admin"],
    default: "user",
  },

}, { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

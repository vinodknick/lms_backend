const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");
const ErrorHandler = require("../utils/errorhandler");
const { upload } = require("../middleware/upload");
const Task = require("../models/taskModel");
const Document = require("../models/documentModel");
const Event = require("../models/eventModel");
const Contact = require("../models/contactModel");
const Matter = require("../models/matterModel");
const Note = require("../models/noteModel");

//_________________________*User Authentication*/_______________________//

/*********** Login ***********/
exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, firebase_token } = req.body;
  if (!email || email == "") {
    return next(
      new ErrorHandler("Email is required"),
      400
    );
  }
  if (!password || password == "") {
    return next(
      new ErrorHandler("Password is required"),
      400
    );
  }
  const user = await User.findOne({ email: email }).select("+password");
  console.log("user",user)
  if (!user) {
    return next(new ErrorHandler("User not found"), 401);
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Passsword"), 401);
  }

  if(user.isVerified=="true"){
   await User.updateOne(
    { email: email },
    {$set:{ firebase_token: firebase_token }}
  );
  const data = await User.findOne({ email: email});
console.log("data",data)
  const message = `login successful`;
  sendToken(message, data, 200, res);
  }
});

/*********forgot Password*********/
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const title = `Password Recovery`;
  const disc = `Please use the verification code below to reset password.`
  if (!email || email == "") {
    return next(new ErrorHandler("Email is required"), 400);
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new ErrorHandler("User not found"), 401);
  }

  // generate otp
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  await User.findOneAndUpdate({ email: email }, { $set: { otp: otp } });
  // OTP send on email
  try {
    await sendEmail(title,disc, email, otp ,"otpEmail.ejs");
    const message = `Email sent to ${user.email} successfully`;
    res.status(200).json({
      success: true,
      message: message,
      data: user,});
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

/****** Reset Password *********/
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { email, newPassword, confirmPassword } = req.body;
  const emailId =  await User.findOne({ email: email});
  if(emailId.isOtpVerified=="true"){
  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("New Password and confirm password does not match"),
      401
    );
  }

  // create hash of new_password
  let update_password = await bcrypt.hash(newPassword, 10);
   await User.findOneAndUpdate(
    { email:email},
    { $set: { password: update_password,isOtpVerified:"false" } }
  );

  const user = await User.findOne({ email: email}).select("-otp")
  res.status(200).json({
    success: true,
    message: "Password reset successfully",
    data: user,
  });
};
});

//********* Logout **********/
exports.logout = catchAsyncErrors(async (req, res, next) => {
  await User.findByIdAndUpdate(
    { _id: req.user._id },
    { $set: { token: null } }
  );
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});


//*************** get all users listing *********/
exports.getUsers = catchAsyncErrors(async (req, res, next) => {
  const adminId = req.user.admin;
  const users = await User.find({admin:adminId}).select("-token");
  res.status(200).json({
    success: true,
    message: "Users Listed",
    data: users,
  });
});

//________________________________/* user task*/ _____________________________//

//************ add task ******/
exports.addTask = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const {
    taskName,
    description,
    assignee,
    reminders,
    matter,
    dueDate,
    timeEstimate,
    taskStatus,
    priorityLevel,
  } = req.body;

  if (
    taskStatus !== "Pending" &&
    taskStatus !== "In progress" &&
    taskStatus !== "In review" &&
    taskStatus !== "Complete"
  ) {
    return next(
      new ErrorHandler(
        "Task Status must be of Pending or In progress or In review or Complete Type"
      ),
      401
    );
  }

  if (
    priorityLevel !== "High" &&
    priorityLevel !== "Normal" &&
    priorityLevel !== "Low"
  ) {
    return next(
      new ErrorHandler("Priority Level must be of High or Normal or Low Type"),
      401
    );
  }

  const task = await Task.create({
    userId,
    taskName,
    description,
    assignee,
    reminders,
    matter,
    dueDate,
    timeEstimate,
    taskStatus,
    priorityLevel,
  });
  return res.status(201).json({
    success: true,
    message: "Task added successfully",
    data: task,
  });
});

//*********** task listing filter ******/
exports.taskList = catchAsyncErrors(async (req, res, next) => {
  const { taskStatus } = req.body;
  if (
    taskStatus !== "Pending" &&
    taskStatus !== "In progress" &&
    taskStatus !== "In review" &&
    taskStatus !== "Complete"
  ) {
    return next(
      new ErrorHandler(
        "Task Status must be of Pending or In progress or In review or Complete Type"
      ),
      401
    );
  }

  const tasks = await Task.find({
    $and: [{ userId: req.user._id }, { taskStatus }],
  });
  return res.status(200).json({
    success: true,
    message: "Task list retrieved successfully",
    data: tasks,
  });
});

// ***************** all task listing ****************//
exports.allTaskList = catchAsyncErrors(async(req,res,next)=>{
  const tasks = await Task.find({userId: req.user._id});
  return res.status(200).json({
    success: true,
    message: "Task list retrieved successfully",
    data: tasks,
  });
})

//____________________________/* user Event */ ____________________________//

//**************** add event *****************/
exports.addEvent = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const {
    eventName,
    details,
    attendees,
    eventLocation,
    reminders,
    matter,
    startDate,
    endDate,
    startTime,
    endTime,
  } = req.body;


  const event = await Event.create({
    userId,
    eventName,
    details,
    attendees,
    eventLocation,
    reminders,
    matter,
    startDate,
    endDate,
    startTime,
    endTime,
  });

  return res.status(201).json({
    success: true,
    message: "Event added successfully",
    data: event,
  });
});

//********* event listing */
exports.eventList = catchAsyncErrors(async (req, res, next) => {
  const { startDate } = req.body;

  const events = await Event.find({
    $and: [{ userId: req.user._id }, { startDate }],
  });
  // console.log(events)
  return res.status(200).json({
    success: true,
    message: "Event list retrieved successfully",
    data: events,
  });
});

//________________________________/* user contact */____________________________//

//************ add contact with contact type person ******/
exports.addContactPerson = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const {
    contactType,
    title,
    firstName,
    lastName,
    phone,
    email,
    birthDate,
    companyName,
    address,
  } = req.body;
  const emailId = await Contact.findOne({ email });
  if (emailId) {
    return next(new ErrorHandler("Email already in use"), 400);
  }

  const PhoneNo = await Contact.findOne({ phone });
  if (PhoneNo) {
    return next(new ErrorHandler("Phone number already in use"), 400);
  }

  if (contactType !== "Person") {
    return next(new ErrorHandler("Contact Type must be Person"), 401);
  }

  const contact = await Contact.create({
    userId,
    contactType,
    title,
    firstName,
    lastName,
    phone,
    email,
    birthDate,
    companyName,
    address,
  });
  return res.status(201).json({
    success: true,
    message: "Contact added successfully",
    data: contact,
  });
});

//************ add contact with contact type company ******/
exports.addContactCompany = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const { contactType, companyName, email, phone, website, address } = req.body;

  const emailId = await Contact.findOne({ email });
  if (emailId) {
    return next(new ErrorHandler("Email already in use"), 400);
  }

  const PhoneNo = await Contact.findOne({ phone });

  if (PhoneNo) {
    return next(new ErrorHandler("Phone number already in use"), 400);
  }

  if (contactType !== "Company") {
    return next(new ErrorHandler("Contact Type must be Company"), 401);
  }

  const contact = await Contact.create({
    userId,
    contactType,
    companyName,
    email,
    phone,
    website,
    address,
  });
  return res.status(201).json({
    success: true,
    message: "Contact added successfully",
    data: contact,
  });
});

//*********  Filtered contact Listing  (user)*/
exports.contactList = catchAsyncErrors(async (req, res, next) => {
  const { contactType} = req.body;
  if (contactType !== "Person" && contactType !== "Company") {
    return next(
      new ErrorHandler("Contact Type must be of Person or Company "),
      401
    );
  }

  const contacts = await Contact.find({
    $and: [{ userId: req.user._id }, { contactType }],
  });
  return res.status(200).json({
    success: true,
    message: "Contact list retrieved successfully",
    data: contacts
  });
});


//********* all contacts of single login user ****************/
exports.getAllContact = catchAsyncErrors(async (req, res, next) => {
  const contacts = await Contact.find({ userId: req.user._id });
  return res.status(200).json({
    success: true,
    message: "Contact list retrieved successfully",
    data: contacts,
  });
});

//********** contact listing client**********/
exports.allContactListing = catchAsyncErrors(async (req, res, next) => {
  const adminId = req.user.admin;
  const contacts = await Matter.find({userId: adminId}).populate("contact");
  const client = contacts.map(val=>val.contact);
  return res.status(200).json({
    success: true,
    message: "client retrieved successfully",
    data: client,
  });
});

// //**************contact list (admin) ********/
// exports.contactListAdmin = catchAsyncErrors(async(req, res, next)=>{
// const userId = req.user.admin;
// const contacts = await Contact.find({userId: userId});
// if (!contacts) {
//   return next(new ErrorHandler("Contacts not found"), 401);
// }
// return res.status(200).json({
//   success: true,
//   message: "Contacts retrieved successfully",
//   data: contacts,
// });
// })


//************* get  all Matters **********/
exports.getAllMatters = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.admin;
  const allMatters = await Matter.find({userId:userId}).sort({createdAt: -1}).populate("contact");
  if (!allMatters) {
    return next(new ErrorHandler("Matters not found"), 401);
  }
  return res.status(200).json({
    success: true,
    message: "Matter list retrieved successfully",
    data: allMatters,
  });
});

//************* matter details according to matter id ******/
exports.getMatterDetails = catchAsyncErrors(async (req, res, next) => {
  const { matterId } = req.body;
  if (!matterId || matterId == "") {
    return next(new ErrorHandler("matterId is required"), 401);
  }
  const matter = await Matter.findOne({ _id: matterId }).populate("contact");
  if (!matter) {
    return next(new ErrorHandler("Matter not found"), 401);
  }
  return res.status(200).json({
    success: true,
    message: "Matter retrieved successfully",
    data: matter,
  });
});

//************** filter matter *****************/
exports.filterMatter = catchAsyncErrors(async (req, res, next) => {
  const {
    matterStatus,
    client,
    responsibleAttorney,
    originatingAttorney,
    billableStatus,
    practiceArea,
  } = req.body;

  const matter = await Matter.find({
    $and: [
      {matterStatus},
      {client},
      {responsibleAttorney },
      {originatingAttorney },
      {billableStatus},
      {practiceArea}
    ],
  })

  return res.status(200).json({
    success: true,
    message: "Matter retrieved successfully",
    data: matter,
  });
});


// *************** Add note *************//
exports.addNote = catchAsyncErrors(async(req,res,next)=>{

  const userId= req.user._id;
  const {subject,note,date,select} = req.body;
  
  const add_note = await Note.create({
    userId,
    subject,
    note,
    date,
    select
  })
  add_note.save();
  return res.status(201).json({
    success: true,
    message: "Note Created Successfully",
    data: add_note,
  });
})




// //********* image upload on local storage *************/
// exports.imageUpload = catchAsyncErrors(async (req, res) => {
//   upload.fields([
//     {
//       name: "profile_pic",
//       maxCount: 1,
//     },
//   ])(req, res, function (error) {
//     if (error) {
//       res.status(200).json({
//         status: false,
//         message: error.message,
//       });
//     } else {
//       const response = {
//         image_url: `${req.protocol}://${req.get("host")}/${
//           req.files.profile_pic[0].filename
//         }`,
//       };
//       return res.status(200).json({
//         status: true,
//         message: "file uploaded successfully",
//         image: response.image_url,
//       });
//     }
//   });
// });
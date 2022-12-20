const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const sendEmail = require("../utils/sendEmail");

const sendToken = require("../utils/jwtToken");
const bcrypt = require("bcryptjs");
const Task = require("../models/taskModel");
const Document = require("../models/documentModel");
const User = require("../models/userModel");
const Matter = require("../models/matterModel");

const moment = require("moment");
// const Event = require("../models/eventModel");
const Contact = require("../models/contactModel");

//*******************admin signup ****************/
exports.adminSignup = catchAsyncErrors(async(req, res, next)=>{
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
  } = req.body;

  const emailId = await User.findOne({ email });
  if (emailId) {
    return next(new ErrorHandler("Emaill already in use"), 400);
  }

  const PhoneNo = await User.findOne({ phone });

  if (PhoneNo) {
    return next(new ErrorHandler("Phone number already in use"), 400);
  }

  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password does not match"),
      400
    );
  }
  // generate otp
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    otp,
    role:"admin"
  });
  try {
    const title = `Verification code`;
    const disc = `Please use the verification code below to sign in.`
    await sendEmail(title,disc, email, otp,"otpEmail.ejs");
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
  const message = "Please enter the verification code sent to your registered email";
  res.status(200).json({
    success: true,
    message: message,
    data: user,
});
});

//************signup otp verify *******/
exports.signupVerifyOtp = catchAsyncErrors(async (req, res, next) => {
  const { email,otp } = req.body;
  const user = await User.findOne({email:email}).select("+otp");
  console.log(user)
  if (user.otp !== otp) {
    return next(
      new ErrorHandler("Wrong Otp"),
      401
    );
  }
  await User.updateOne({email:email},{$set:{isVerified:"true"}})
  const data = await User.findOne({email:email}).select("-otp");
  res.status(200).json({
    success: true,
    message: "Otp verfied successfully",
    data: data,
});
});


/*********** verify OTP ***********/
exports.verifyOtp = catchAsyncErrors(async (req, res, next) => {
  const { email,otp } = req.body;
  const user = await User.findOne({email:email}).select("+otp");
  console.log(user)
  if (user.otp !== otp) {
    return next(
      new ErrorHandler("Wrong Otp"),
      401
    );
  }
  await User.updateOne({email:email},{$set:{isOtpVerified:"true"}})
  const data = await User.findOne({email:email}).select("-otp");
  res.status(200).json({
    success: true,
    message: "Otp verfied successfully",
    data: data,
});
});

//****************** admin login *************/
exports.adminLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || email == "") {
    return next(
      new ErrorHandler("Password and confirm password does not match"),
      400
    );
  }
  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found"), 401);
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Passsword"), 401);
  }
  if(user.isVerified=="true"){
   const data = await User.findOne({ email: email})

  const message = `login successful`;
  sendToken(message, data, 200, res);
  };
});

/*********forgot Password*********/
exports.adminForgotPassword = catchAsyncErrors(async (req, res, next) => {
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
    await sendEmail(title, disc, email, otp ,"otpEmail.ejs");
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
exports.adminResetPassword = catchAsyncErrors(async (req, res, next) => {
  const { email,newPassword, confirmPassword } = req.body;
  const emailId =  await User.findOne({ email: email});
  if(emailId.isOtpVerified=="true") {
  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("New Password and confirm password does not match"),
      401
    );
  }

  let update_password = await bcrypt.hash(newPassword, 10);
  await User.updateOne(
    {email:email},
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


//************** admin update password **************/
exports.adminUpdatePassword = catchAsyncErrors(async(req,res,next)=>{
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();
  const message = "Password Update Successfully"
  sendToken(message,user, 200, res);
})


//********* admin Logout **********/
exports.adminLogout = catchAsyncErrors(async (req, res, next) => {
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

//_______________ create user credentials by admin ____________/
/************ User Signup By admin***********/
exports.signup = catchAsyncErrors(async (req, res, next) => {
  const admin = req.user._id
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
  } = req.body;

  const emailId = await User.findOne({ email });
  if (emailId) {
    return next(new ErrorHandler("Email already in use"), 400);
  }

  const PhoneNo = await User.findOne({ phone });

  if (PhoneNo) {
    return next(new ErrorHandler("Phone number already in use"), 400);
  }

  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password does not match"),
      400
    );
  }
  // generate otp
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const user = await User.create({
    admin,
    firstName,
    lastName,
    email,
    phone,
    password,
    otp,
  });
  try {
    const title = `verify OTP`;
    const disc = `Please use the verification code below to sign in.`
    await sendEmail(title,disc, email, otp,"otpEmail.ejs");
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
  const message = "Please enter the verification code sent to your registered email";
  res.status(200).json({
    success: true,
    message: message,
    data: user,
});
});


// ******** get documents admin **********
exports.adminGetDocuments = catchAsyncErrors(async (req, res, next) => {
  // const documents = await Document.find().populate("userId");
  const documents = await Document.find();

  return res.status(200).json({
    success: true,
    message: "Get documents successfully",
    data: documents,
  });
});

//*************add matter admin ***********
exports.adminAddMatter = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const {
    // client,
    contact,
    matterDescription,
    responsibleAttorney,
    originatingAttorney,
    clientReferenceNumber,
    location,
    practiceArea,
    permissions,
    matterStatus,
    billableStatus,
    openDate,
    closedDate,
    pendingDate,
    statuteOfLimitationsDate
  } = req.body;
  var open = new Date(openDate);
  const openDates = moment(open).format("DD/MM/YYYY")

  var close = new Date(closedDate);
  const closeDates = moment(close).format("DD/MM/YYYY")

  var pending = new Date(pendingDate);
  const pendingDates = moment(pending).format("DD/MM/YYYY")

  var statuteOf = new Date(statuteOfLimitationsDate);
  const statuteOfLimitationsDates = moment(statuteOf).format("DD/MM/YYYY")

  if (billableStatus !== "Billable" && billableStatus !== "Non-billable") {
    return next(new ErrorHandler("billableStatus must be Billable or Non-billable"), 401);
  }

  if (permissions !== "Me" && permissions !== "Everyone") {
    return next(new ErrorHandler("permissions must be Me or Everyone"), 401);
  }
  if (matterStatus !== "Open" && matterStatus !== "Closed" && matterStatus !=="Pending") {
    return next(new ErrorHandler("matterStatus must be Open or Closed or Pending"), 401);
  }

  const  contact_details = await Contact.find({$and:[{userId:req.user._id},{_id:contact}]})
  if(contact_details.map(contact => contact.contactType=="Person")){
  const  clientName =  contact_details.map(contact => contact.firstName + " " + contact.lastName)
  const randomNo = Math.floor(1000 + Math.random() * 9000).toString();
  let clientId = randomNo+"-"+clientName;
 
  await Contact.findOneAndUpdate({$and:[{userId:req.user._id},{_id:contact}]},{clientId:clientId})
  
  const matter = await Matter.create({
    userId,
    contact,
    // clientId:clientId,
    client:clientName.join(","),
    matterDescription,
    responsibleAttorney,
    originatingAttorney,
    clientReferenceNumber,
    location,
    practiceArea,
    permissions,
    matterStatus,
    billableStatus,
    openDate:openDates,
    closedDate:closeDates,
    pendingDate:pendingDates,
    statuteOfLimitationsDate:statuteOfLimitationsDates,
  });
  return res.status(201).json({
    success: true,
    message: "Matter added successfully",
    data: matter,
  });
};
});


//************* get  all Matters  admin **********/
exports.adminGetAllMatters = catchAsyncErrors(async (req, res, next) => {
    const allMatters = await Matter.find({userId:req.user._id}).sort({createdAt:-1});
    return res.status(200).json({
        success: true,
        message: "Matter list retrieved successfully",
        data: allMatters,
    });
});

//************* filter matters admin *************/
exports.adminFilterMatters = catchAsyncErrors(async (req, res, next) => {
  const matterStatus = req.body.matterStatus;
  if (matterStatus !== "Open" && matterStatus !== "Closed" && matterStatus !=="Pending") {
    return next(new ErrorHandler("matterStatus must be Open or Closed or Pending"), 401);
  }

  const filterMatters = await Matter.find({userId:req.user._id, matterStatus:matterStatus});
  return res.status(200).json({
    success: true,
    message: "Matter list retrieved successfully",
    data: filterMatters,
});
});


//************ delete matter admin *****************/
exports.adminDeleteMatter = catchAsyncErrors(async (req, res, next) => {
  const {matterId} = req.body
  if(!matterId||matterId ==""){
    return next(new ErrorHandler("matterId is required"), 401);
  }
  const matter = await Matter.findById({_id:matterId});
  if (!matter) {
    return next(new ErrorHandler("Matter not found"), 404);
  }
  await matter.remove();
  return res.status(200).json({
    success: true,
    message: "Matter deleted successfully",
  })
  });

//************ add contact with contact type person ******/
exports.adminAddContactPerson = catchAsyncErrors(async (req, res, next) => {
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
      address
    } = req.body;
  
    const phoneNo = await Contact.findOne({phone})
    if(phoneNo){
        return next(new ErrorHandler("phone already in use"), 401);
       }
  
    const emailId = await Contact.findOne({email})
    if(emailId){
        return next(new ErrorHandler("email already in use"), 401);
       }

   if(!birthDate ||birthDate==""){
    return next(new ErrorHandler("Birth Date is required"), 401);
}
  var birth = new Date(birthDate);
  const birthDates = moment(birth).format("DD/MM/YYYY")
  
    if(contactType !== "Person"){
   return next(new ErrorHandler("Contact Type must be Person"),401) 
    }
  
  const contact = await Contact.create({
    userId,
    contactType,
    title,
    firstName,
    lastName,
    phone,
    email,
    birthDate:birthDates,
    companyName,
    address
  });

  

  return res.status(201).json({
      success: true,
      message: "Contact added successfully",
      data: contact,
    });
  });


  //************ add contact with contact type company **********/
exports.adminAddContactCompany = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user._id;
    const {
      contactType,
      companyName,
      email,
      phone,
      website,
      address
    } = req.body;
    const phoneNo = await Contact.findOne({phone})
    if(phoneNo){
        return next(new ErrorHandler("phone already in use"), 401);
       }
  
    const emailId = await Contact.findOne({email})
    if(emailId){
        return next(new ErrorHandler("email already in use"), 401);
       }


    if(contactType !== "Company"){
   return next(new ErrorHandler("Contact Type must be Company"),401) 
    }
  
  const contact = await Contact.create({
    userId,
    contactType,
    companyName,
    email,
    phone,
    website,
    address
  });
  return res.status(201).json({
      success: true,
      message: "Contact added successfully",
      data: contact,
    });
  });


    //*********  Filtered contact Listing */
exports.adminFilterContactList = catchAsyncErrors(async(req,res,next) => {
        const {contactType} = req.body;
        if(contactType !== "Person" && contactType !=="Company"){
            return next(new ErrorHandler("Contact Type must be of Person or Company "),401) 
             }
        
        const contacts = await Contact.find({$and:[{userId:req.user._id},{contactType}]});
        return res.status(200).json({
          success: true,
          message: "Contact list retrieved successfully",
          data: contacts,
        });
      });
    
    
//********* all contacts  ****************/
      exports.adminGetAllContact = catchAsyncErrors(async (req, res, next) => {
        const contacts= await Contact.find();
        return res.status(200).json({
          success: true,
          message: "Contact list retrieved successfully",
          data: contacts,
        });
      })

//************ delete contact admin *****************/
exports.adminDeleteContact = catchAsyncErrors(async (req, res, next) => {
    const {contactId} = req.body
    if(!contactId||contactId ==""){
      return next(new ErrorHandler("contactId is required"),401);
    }
    const contact = await Contact.findById({_id:contactId});
    if (!contact) {
      return next(new ErrorHandler("contact not found"), 404);
    }
    await contact.remove();
    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    })
    });


 //************ add task  admin ******/
exports.adminAddTask = catchAsyncErrors(async (req, res, next) => {
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
  
    if(taskStatus !== "Pending" && taskStatus !=="In_progress"&&taskStatus !=="In_review"){
   return next(new ErrorHandler("Task Status must be of Pending or In_progress or In_review Type"),401) 
    }
  
    if(priorityLevel !== "High" && priorityLevel !=="Normal"&&priorityLevel !=="Low"){
      return next(new ErrorHandler("Priority Level must be of High or Normal or Low Type"),401) 
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
      priorityLevel
  });
  return res.status(201).json({
      success: true,
      message: "Task added successfully",
      data: task,
    });
  });

//*************** all task List admin */
exports.admintaskList = catchAsyncErrors(async (req, res, next) => {
    const tasks = await Task.find();
    return res.status(200).json({
      success: true,
      message: "Task list retrieved successfully",
      data: tasks,
    });
  });
  
//************ delete task admin *****************/
exports.adminDeleteTask = catchAsyncErrors(async (req, res, next) => {
    const {taskId} = req.body
    if(!taskId||taskId ==""){
      return next(new ErrorHandler("taskId is required"),401);
    }
    const task = await Task.findById({_id:taskId});
    if (!task) {
      return next(new ErrorHandler("task not found"), 404);
    }
    await task.remove();
    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    })
    });

//*************** get all users listing *********/
exports.adminGetUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({role:"user"}).select("-token");
    res.status(200).json({
      success: true,
      message: "Users Listed", 
      data:users,
    });
  });


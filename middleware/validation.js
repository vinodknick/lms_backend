const User = require("../models/userModel");
const { check, validationResult } = require("express-validator");

(exports.firstName = check("firstName", "First Name is required")
  .not()
  .isEmpty()
  .bail()
  .isAlpha()
  .withMessage("First Name must be alphabetic.")
  .bail()
  .isLength({ min: 3 })
  .withMessage("First Name must be of minimum 3 characters long.")),
  (exports.lastName = check("lastName", "Last Name is required")
    .not()
    .isEmpty()
    .bail()
    .isAlpha()
    .withMessage("Last Name must be alphabetic.")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Last Name must be of minimum 3 characters long.")),
  (exports.full_name = check("full_name", "Full Name is required")
    .not()
    .isEmpty()),
  (exports.email = check("email")
    .not()
    .isEmpty()
    .withMessage("email is required")
    //.ball() can be used to stop running further validations if any of the previous ones in the chain have failed.
    .bail()
    // if email is empty, the following will not be run
    .isEmail()
    .toLowerCase()
    .withMessage("email not valid")),
    // .bail()
    // .custom((value, { req }) => {
    //   return new Promise((resolve, reject) => {
    //     User.findOne({ email: req.body.email }, function (err, User) {
    //       if (err) {
    //         reject(new Error("Server Error"));
    //       }
    //       if (Boolean(User)) {
    //         reject(new Error("Email already in use"));
    //       }
    //       resolve(true);
    //     });
    //   });
    // }),
  (exports.password = check("password")
    .not()
    .isEmpty()
    .withMessage("password is required")
    .bail()
    .trim())
    .custom((password) => {
      if (
        password &&
        password.match(
          /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/
        )
      ) {
        return true;
      }
    })
    .withMessage(
      "Password must contain 8 characters and atleast 1 number, 1 uppercase and lowercase letter."
    ),

    (exports.oldPassword = check("oldPassword")
    .not()
    .isEmpty()
    .withMessage("old password is required")), 
  (exports.newPassword = check("newPassword")
    .not()
    .isEmpty()
    .withMessage("new password is required")
    .bail()
    .trim())
    .custom((newPassword) => {
      if (
        newPassword &&
        newPassword.match(
          /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/
        )
      ) {
        return true;
      }
    })
    .withMessage(
      "New Password must contain 8 characters and atleast 1 number, 1 uppercase and lowercase letter."
    ),
  (exports.confirmPassword = check("confirmPassword")
    .not()
    .isEmpty()
    .withMessage("confirm password is required")
    .bail()
    .trim()),
  (exports.otp = check("otp").not().isEmpty().withMessage("Otp is required")),
  (exports.firebase_token = check(
    "firebase_token",
    "firebase token is required"
  ))
    .not()
    .isEmpty(),
  (exports.social_id = check("social_id", "social id is required"))
    .not()
    .isEmpty(),
  (exports.profile_pic = check("profile_pic", "profile pic is required"))
    .not()
    .isEmpty(),
  (exports.eventName = check("eventName", "Event Name is required"))
    .not()
    .isEmpty(),
  (exports.attendees = check("attendees", "Attendees is required"))
    .not()
    .isEmpty(),
  (exports.eventLocation = check("eventLocation", "Event Location is required"))
    .not()
    .isEmpty(),
  (exports.startDate = check("startDate", "Start Date is required"))
    .not()
    .isEmpty()
    .custom((startDate) => {
      if (
        startDate &&
        startDate.match(
          /(((0|1)[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/((19|20)\d\d))$/
        )
      ) {
        return true;
      }
    })
    .withMessage("Invalid Start Date Format");
(exports.endDate = check("endDate", "End Date is required"))
  .not()
  .isEmpty()
  .custom((endDate) => {
    if (
      endDate &&
      endDate.match( /(((0|1)[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/((19|20)\d\d))$/)
    ) {
      return true;
    }
  })
  .withMessage("Invalid End Date Format"),
  (exports.birthDate = check("birthDate", "Birth Date is required"))
  .not()
  .isEmpty()
  .custom((birthDate) => {
    if (
      birthDate &&
      birthDate.match( /(((0|1)[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/((19|20)\d\d))$/)
    ) {
      return true;
    }
  })
  .withMessage("Invalid Birth Date Format"),
  (exports.openDate = check("openDate", "Open Date is required"))
  .not()
  .isEmpty(),
  // .custom((openDate) => {
  //   if (
  //     openDate &&
  //     openDate.match( /(((0|1)[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/((19|20)\d\d))$/)
  //   ) {
  //     return true;
  //   }
  // })
  // .withMessage("Invalid Open Date Format"),
  (exports.closedDate = check("closedDate", "Closed Date is required"))
  .not()
  .isEmpty(),
  // .custom((closedDate) => {
  //   if (
  //     closedDate &&
  //     closedDate.match( /(((0|1)[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/((19|20)\d\d))$/)
  //   ) {
  //     return true;
  //   }
  // })
  // .withMessage("Invalid Closed Date Format"),
  (exports.pendingDate = check("pendingDate", "Pending Date is required"))
  .not()
  .isEmpty(),
  // .custom((pendingDate) => {
  //   if (
  //     pendingDate &&
  //     pendingDate.match( /(((0|1)[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/((19|20)\d\d))$/)
  //   ) {
  //     return true;
  //   }
  // })
  // .withMessage("Invalid Pending Date Format"),
  (exports.statuteOfLimitationsDate = check("statuteOfLimitationsDate", "Statute Of Limitations Date is required"))
  .not()
  .isEmpty(),
  // .custom((statuteOfLimitationsDate) => {
  //   if (
  //     statuteOfLimitationsDate &&
  //     statuteOfLimitationsDate.match( /(((0|1)[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/((19|20)\d\d))$/)
  //   ) {
  //     return true;
  //   }
  // })
  // .withMessage("Invalid statute Of Limitations Date Format"),
  (exports.startTime = check("startTime", "Start Time is required"))
    .not()
    .isEmpty()
    .custom((startTime) => {
      if (
        startTime &&
        startTime.match(/^\b((1[0-2]|0?[1-9]):([0-5][0-9]) ([AP][M]))$/)
      ) {
        return true;
      }
    })
    .withMessage("Invalid Start Time Format"),
  (exports.endTime = check("endTime", "End Time is required")).not().isEmpty()
  .custom((startTime) => {
    if (
      startTime &&
      startTime.match(/^\b((1[0-2]|0?[1-9]):([0-5][0-9]) ([AP][M]))$/)
    ) {
      return true;
    }
  })
  .withMessage("Invalid End Time Format"),
  (exports.timeEstimate = check("timeEstimate", "timeEstimate is required")).not().isEmpty()
  .custom((timeEstimate) => {
    if (
      timeEstimate &&
      timeEstimate.match(/^\b((1[0-2]|0?[1-9]):([0-5][0-9]) ([AP][M]))$/)
    ) {
      return true;
    }
  })
  .withMessage("Invalid Time Format"),
  
  (exports.permissions = check("permissions", "Permissions is required"))
    .not()
    .isEmpty(),
  (exports.client = check("client", "Client is required"))
    .not()
    .isEmpty(),
    (exports.matterDescription = check("matterDescription", "Matter Description is required"))
    .not()
    .isEmpty(),
  (exports.taskStatus = check("taskStatus", "Task Status is required"))
    .not()
    .isEmpty(),
  (exports.priorityLevel = check("priorityLevel", "Priority Level is required"))
    .not()
    .isEmpty(),
    (exports.matterStatus = check("matterStatus", "Matter Status is required"))
    .not()
    .isEmpty(),
    (exports.billableStatus = check("billableStatus", "Billable Status is required"))
    .not()
    .isEmpty(),
  (exports.contactType = check("contactType", "Contact Type is required"))
    .not()
    .isEmpty(),
    (exports.contact = check("contact", "Contact is required"))
    .not()
    .isEmpty(),
  (exports.companyName = check("companyName", "Company Name is required"))
    .not()
    .isEmpty(),
  (exports.taskName = check("taskName", "Task Name is required"))
    .not()
    .isEmpty(),
    (exports.assignee = check("assignee", "assignee is required"))
    .not()
    .isEmpty(),
    (exports.subject = check("subject", "subject is required"))
    .not()
    .isEmpty(),
    (exports.note = check("note", "note is required"))
    .not()
    .isEmpty(),
    (exports.date = check("date", "Date is required"))
    .not()
    .isEmpty()
    .custom((date) => {
      if (
        date &&
        date.match(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/)
      ) {
        return true;
      }
    })
    .withMessage("Invalid Date Format"),
    (exports.dueDate = check("dueDate", "dueDate is required"))
    .not()
    .isEmpty()
    .custom((dueDate) => {
      if (
        dueDate &&
        dueDate.match(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/)
      ) {
        return true;
      }
    })
    .withMessage("Invalid Date Format"),
    (exports.select = check("select", "select is required"))
    .not()
    .isEmpty(),
  (exports.phone = check("phone")
    .not()
    .isEmpty()
    .withMessage("phone number is required")
    .bail()
    .trim()
    .isNumeric()
    .withMessage("Phone number must be numeric.")
    .bail()
    .isLength({ max: 10, min: 10 })
    .withMessage("Phone number must be 10 digits long.")
    // .bail()
    // .custom((value, { req }) => {
    //   return new Promise((resolve, reject) => {
    //     User.findOne({ phone: req.body.phone }, function (err, User) {
    //       if (err) {
    //         reject(new Error("Server Error"));
    //       }
    //       if (Boolean(User)) {
    //         reject(new Error("phone number already in use"));
    //       }
    //       resolve(true);
    //     });
    //   });
    // })
    ),

  
  // Validation error handler
  (exports.userValidation = (req, res, next) => {
    const errors = validationResult(req).formatWith(({ msg }) => `${msg}`);

    if (!errors.isEmpty()) {
      let errorMessage = "";
      errorMessage = errors.array();
      if (errorMessage.length >= 1) {
        return res
          .status(400)
          .json({ success: false, message: errorMessage[0] });
      }
    }
    next();
  });

const express = require("express");
const {
  login,
  forgotPassword,
  resetPassword,
  logout,
  addTask, taskList,
  addEvent, eventList,
  contactList,
   getAllContact,
    addContactPerson,
     addContactCompany, 
     getAllMatters,
     getMatterDetails,
     getUsers,
     allContactListing,
     filterMatter,
     addNote,
     allTaskList,
     contactListAdmin
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  firstName,
  lastName,
  email,
  phone,
  confirmPassword,
  newPassword,
  firebase_token,
  taskName, 
  userValidation,
  taskStatus,
  priorityLevel,
  eventName,
  attendees,
  eventLocation,
  startDate,
  endDate,
  startTime,
  endTime,
  contactType,
  companyName,
  birthDate,
  select,
  subject,
  note,
  date,
  assignee,
  timeEstimate,
  dueDate,
} = require("../middleware/validation");
const router = express.Router();

//----------------user auth routes------------------//

router.route("/login").post(firebase_token,userValidation,login);

router.route("/forgotPassword").post(forgotPassword);

router
  .route("/resetPassword")
  .post(
    email,
    newPassword,
    confirmPassword,
    userValidation,
    resetPassword
  );

// router.route("/upload/image").post(imageUpload)

router.route("/logout").post(isAuthenticatedUser, logout);



router.route("/get/all/users").post(isAuthenticatedUser, getUsers);


//----------------user task routes------------------//
router
.route("/add/task")
.post(taskName,timeEstimate,dueDate,priorityLevel,assignee,taskStatus,userValidation,isAuthenticatedUser,addTask)

router
.route("/task/list")
.post(taskStatus,userValidation,isAuthenticatedUser,taskList)

router
.route("/all/task/list")
.post(isAuthenticatedUser,allTaskList)


//------------------user event routes ---------------//
router
  .route("/add/event")
  .post(
    eventName,
    attendees,
    eventLocation,
    startDate,
    endDate,
    startTime,
    endTime,
    userValidation,
    isAuthenticatedUser,
    addEvent
  );

  router
  .route("/event/list")
  .post(startDate,userValidation,isAuthenticatedUser,eventList)



//---------------- contact route ----------------/
router
.route("/add/contact/person")
.post(contactType,firstName,lastName,email,phone,birthDate,userValidation,isAuthenticatedUser,addContactPerson)

router
.route("/add/contact/company")
.post(contactType,companyName,email,phone,userValidation,isAuthenticatedUser,addContactCompany)



// *****Filtered contact Listing  (user -> Person||Company) ******
router
.route("/contact/list")
.post(contactType,userValidation,isAuthenticatedUser,contactList)

// all contacts of single login user *******/
router
.route("/all/contact/list")
.post(isAuthenticatedUser,getAllContact)

//********** contact listing (user+admin)**********/
router
.route("/all/contact/listing")
.post(isAuthenticatedUser,allContactListing)

//******* admin all contact listing *********/
// router
// .route("/contact/listing/admin")
// .post(isAuthenticatedUser,contactListAdmin)


//---------------- matter  route ----------------/
router
  .route("/get/all/matter")
  .post(isAuthenticatedUser, getAllMatters);

router
.route("/get/matter/details")
.post(isAuthenticatedUser, getMatterDetails)

router
.route("/filter/matter")
.post(isAuthenticatedUser,filterMatter)

//-----------------Note route-----------------/
router
.route("/add/note")
.post(subject,note,date,select,userValidation,isAuthenticatedUser,addNote)

module.exports = router;
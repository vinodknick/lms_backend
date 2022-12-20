const express = require("express");
const {
  adminLogin,
  admintaskList,
  adminGetDocuments,
  adminAddMatter,
  adminGetAllMatters,
  adminFilterMatters,
  adminAddContactPerson,
  adminAddContactCompany,
  adminFilterContactList,
  adminGetAllContact,
  adminAddTask,
  adminDeleteMatter,
  adminDeleteContact,
  adminDeleteTask,
  adminGetUsers,
  adminSignup,
  verifyOtp,
  adminForgotPassword,
  adminResetPassword,
  adminUpdatePassword,
  adminLogout,
  signup,
  signupVerifyOtp
} = require("../controllers/adminController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  client,
  matterDescription,
  permissions,
  matterStatus,
  openDate,
  closedDate,
  pendingDate,
  statuteOfLimitationsDate,
  contactType,
  firstName,
  lastName,
  email,
  companyName,
  phone,
  billableStatus,
  userValidation,
  taskStatus,
  taskName,
  priorityLevel,
  contact,
  password,
  confirmPassword,
  otp,
  newPassword,
  oldPassword
  
} = require("../middleware/validation");
const router = express.Router();

//********** admin routes **********/
router
  .route("/admin/signup")
  .post(
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
    userValidation,
    adminSignup
  );

router.route("/admin/verify/otp").post(email, otp, userValidation,verifyOtp);

router.route("/admin/signup/verify/otp").post(email,otp,userValidation,signupVerifyOtp);

router.route("/admin/login").post(adminLogin);

router.route("/admin/forgot/password").post(adminForgotPassword);

router
  .route("/admin/reset/password")
  .post(
    email,
    newPassword,
    confirmPassword,
    userValidation,
    adminResetPassword
  );
router
.route("/admin/update/password")
.post(oldPassword,newPassword,confirmPassword,userValidation,isAuthenticatedUser,adminUpdatePassword)

router.route("/admin/logout").post(isAuthenticatedUser, adminLogout);

router
  .route("/user/signup")
  .post(
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
    userValidation,
    isAuthenticatedUser,
    signup
  );


router
  .route("/admin/document/list")
  .post(isAuthenticatedUser, authorizeRoles("admin"), adminGetDocuments);

router
  .route("/admin/add/matter")
  .post(
    // client,
    matterDescription,
    permissions,
    matterStatus,
    billableStatus,
    openDate,
    closedDate,
    pendingDate,
    statuteOfLimitationsDate,
    contact,
    userValidation,
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminAddMatter
  );

router
  .route("/admin/get/all/matter")
  .post(isAuthenticatedUser, authorizeRoles("admin"), adminGetAllMatters);

router
  .route("/admin/filter/matter")
  .post(
    matterStatus,
    userValidation,
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminFilterMatters
  );

router
.route("/admin/delete/matter")
.post(isAuthenticatedUser,authorizeRoles("admin"),adminDeleteMatter)


router
  .route("/admin/add/contact/person")
  .post(
    contactType,
    firstName,
    lastName,
    // birthDate,
    phone,
    email,
    userValidation,
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminAddContactPerson
  );

router
  .route("/admin/add/contact/company")
  .post(
    contactType,
    companyName,
    phone,
    email,
    userValidation,
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminAddContactCompany
  );

router
.route("/admin/filter/contact/list")
.post(contactType,userValidation,isAuthenticatedUser,authorizeRoles("admin"),adminFilterContactList)

router
.route("/admin/all/contact/list")
.post(isAuthenticatedUser,authorizeRoles("admin"),adminGetAllContact)

router
.route("/admin/delete/contact")
.post(isAuthenticatedUser,authorizeRoles("admin"),adminDeleteContact)

router
.route("/admin/add/task")
.post(taskName,priorityLevel,taskStatus,userValidation,isAuthenticatedUser,authorizeRoles("admin"),adminAddTask)

router
  .route("/admin/task/list")
  .post(isAuthenticatedUser, authorizeRoles("admin"), admintaskList);

router
  .route("/admin/delete/task")
  .post(isAuthenticatedUser,authorizeRoles("admin"),adminDeleteTask)

router.route("/admin/get/all/users").post(isAuthenticatedUser,authorizeRoles("admin"),adminGetUsers);

module.exports = router;






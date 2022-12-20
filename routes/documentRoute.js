const express = require("express");
const { uploadDocument, getDocuments } = require("../controllers/documentController");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();
const { upload } = require("../middleware/s3Bucket");



//****** upload file on s3Bucket */
router.route( "/upload/document").post(isAuthenticatedUser,
    upload.array("files"),uploadDocument
  );

  module.exports = router;

// router
// .route("/getdocuments")
// .post(isAuthenticatedUser,getDocuments)  
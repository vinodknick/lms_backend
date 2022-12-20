const dotenv = require("dotenv");

dotenv.config({ path: "config/config.env" });

var aws = require("aws-sdk"),
  multer = require("multer"),
  multerS3 = require("multer-s3");
aws.config.update({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});
  s3 = new aws.S3();
exports.upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "mylmsbkt",
    key: function (req, file, cb) {
      console.log("ffff",file.mimetype)
      // if (
      //   file.mimetype == "application/pdf"||
      //   file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      // ) {
      //   return cb(null, "public/" + Date.now() + file.originalname); //use Date.now() for unique file keys
      // } else {
      //   return cb(new Error("Only pdf and docx format allowed!"));
      // }
      return cb(null, "public/" + Date.now() + file.originalname);
    },
  }),
});


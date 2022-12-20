const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "public/",
  filename: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      // file.mimetype == "video/mp4" ||
      // file.mimetype == "audio/mpeg" ||
      // file.mimetype == "audio/mp4" ||
      file.mimetype == "application/pdf"
    ) {
      return cb(
        null,
        `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
      );
    } else {
      return cb(new Error("Only .png, .jpg, .jpeg, and .pdf format allowed!"));
    }
  },
});

exports.upload = multer({ storage: storage });




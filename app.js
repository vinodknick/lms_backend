const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

const errorMiddleware = require("./middleware/error");

// View Engine set up
// app.set("views", path.join(__dirname, "./views"));
// app.set("view engine", "ejs");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors());
// Route Imports
const user = require("./routes/userRoute");
const admin = require("./routes/adminRoute");
const document = require("./routes/documentRoute");

// const web = require("./routes/webRoute");

app.use("/api/v1", user);
app.use("/api/v1", admin);
app.use("/api/v1/", document);
// app.use("/", web);

//Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
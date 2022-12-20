const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// const Review = require("../models/reviewModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    //Get Token from header
    token = authorization.split(" ")[1];
    // console.log("token",token)

    //Verify Token
    const userID = jwt.verify(token, process.env.JWT_SECRET);

    //check token in data
    let data = await User.findById(userID.id).select("token");

    if (data == null) {
      return next(new ErrorHandler("Token is invalid or expired", 401));
    }
    // console.log("data.token",data.token)
    if (data.token != null && data != null) {
      if (data.token === authorization.split(" ")[1]) {
        req.user = await User.findById(userID.id);
      } else {
        res.status(401).json({
          success: "false",
          message: "Unauthorized User",
        });
        return;
      }
      // console.log(req.user.token);
    } else {
      res.status(401).json({
        success: "false",
        message: " Token expired you have to login again",
      });
      return;
    }
    next();
  }
  if (!token) {
   return res.status(401).send({message:"Token is invalid or expired",success:false});
  }
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role:${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};

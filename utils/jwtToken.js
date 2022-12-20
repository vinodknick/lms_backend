const User = require("../models/userModel")


// Create token and saving in cookie

const sendToken = async(message,user, statusCode, res) => {
  const token = user.getJWTToken();

   await User.updateOne({_id:user._id},{$set:{token:token}});

   const data = await User.findById({_id:user._id});
  // console.log(data);

  //option for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message :message,
    user:data,
  });
};

module.exports = sendToken;

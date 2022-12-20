
const User = require("../models/userModel");
module.exports.generateOTP = async (email) => {
    try {
         const otp=(Math.floor(1000 + Math.random() * 9000)).toString(); 
         console.log(otp);
         await User.findOneAndUpdate({email:email},{$set:{otp:otp}});
    } catch (error) {
       console.log(error);
    }
  };


//   module.exports.generateOTP = async (phone) => {
//     try {
//         // Find your account sid and auth token in your Twilio account Console.
//         // console.log(process.env.TWILIO_ACCOUNT_SID);
//         // var client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//         // Send the text message.
//          const otp=Math.floor(1000 + Math.random() * 9000) 
//          console.log(otp);
//          await User.findOneAndUpdate({phone:phone},{$set:{otp:otp}});
//         // client.messages.create({
//         //     to: '+919997951530',
//         //     from: '+19783916212',
//         //     body: otp
//         // });
//         // return otp;
//     } catch (error) {
//        console.log(error);
//     }
//   };

  
  

const nodeMailer = require("nodemailer");
const ejs = require("ejs");

const sendEmail = async (title,disc, email, otp, filename) => {
  ejs.renderFile(
    __dirname + `/../views/${filename}`,
    { title: title,disc:disc, otp:otp },
    function (err, data) {
      if (err) {
        console.log(err.message);
      }
  var transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
      const mailOptions = {
        from:  process.env.EMAIL_FROM,
        to: email,
        subject: title,
        html: data,
      };
      transporter.sendMail(mailOptions);
    }
  );
};

module.exports = sendEmail;






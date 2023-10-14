const nodemailer = require("nodemailer");

exports.generateOTP = () => {
  return Math.floor(Math.random() * 900000) + 100000;
};

// exports.generateOTP = (otp_length = 6){
//     let OTP = '';
//     for(let i = 1; i <= otp_length; i++){
//         OTP += Math.floor(Math.random()*9);
//     }
//     return OTP;
// };

// return was missing here,
exports.generateMailTransporter = () => {
  return nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.NODEMAILER_AUTH_USER,
      pass: process.env.NODEMAILER_AUTH_PASS,
    },
  });
};

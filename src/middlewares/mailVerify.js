const nodemailer = require('nodemailer');
const responseLib = require('../libs/responseLib');


// set up the main provider
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'wilson.sporer@ethereal.email',//user id for ethereal email server
        pass: 'pwUgZb6n2SPMgJK5uQ'//password for eftereal email server
    }
});
// Create and send verification email
const sendVerificationEmail = async (email, otp) => {
    try {
      // Create the email message
      const mailOptions = {
        from: 'smtp.ethereal.email',
        to: email,
        subject: 'Otp verification',
        text: `Your verification OTP: ${otp}`
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
    } catch (error) {
      if(error)
      res.status(500).send(responseLib.generate(true,error.message,null));
    }
  };  
const passwordResetEmail=async(email,resetToken) => {
    try {
      // Create the email message
      const resetLink = `${CLIENT_URL}/reset-password?token=${resetToken}`;
      const mailOptions = {
        from: 'smtp.ethereal.email',
        to: email,
        subject: 'Password reset link',
        text: `Click to reset password ${resetLink}`,
      };
      //send the email
      await transporter.sendMail(mailOptions);
    }catch(err){
      res.status(500).send(responseLib.generate(true,err.message,null));
    }
};

module.exports=
{sendVerificationEmail:sendVerificationEmail,
passwordResetEmail:passwordResetEmail}
  
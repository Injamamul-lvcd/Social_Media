// Function to generate a random 6 digis OTP
const generateOTP = () => {
    const otpLength = 6;
    const digits = '0123456789';
    let otp = '';
    
    for (let i = 0; i < otpLength; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    
    return otp;
  }
let randomString=(length)=>{
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomString = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    return randomString;
  }
  
  
module.exports={
  generateOTP:generateOTP,
  randomString:randomString
}
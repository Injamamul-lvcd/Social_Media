const otpLib=require('../libs/otpLib');
const responseLib=require('../libs/responseLib');
const checkLib = require('../libs/checkLib');
const mailService=require('../middlewares/mailVerify');
const otpModel=require('../models/user-otpModel');
const userController=require('../controllers/userController')

let sendOTP=async(req,res)=>{
    try{
        const email=req.body.email;
        const type=req.body.type;
        const value=await otpModel.findOne({email:email});
        const otp=otpLib.generateOTP();
        if(checkLib.isEmpty(value)){
            let data=new otpModel({
                email:email,
                type:type,
                otp:otp
        })
        await data.save();
        mailService.sendVerificationEmail(email,otp);
        res.status(200).send(responseLib.generate(false,"otp sent successfully",data));
        }else{
            value.type=type;
            value.otp=otp;
            await value.save();
            mailService.sendVerificationEmail(email,otp);
            
        res.status(200).send(responseLib.generate(false,"otp resent successfully",value));
        }   
    }catch(err){
        res.status(500).send(responseLib.generate(true,err.message,null));
    }

}
let verifyOTP=async(req,res)=>{
    try{
        let msg={};
        const email=req.body.email;
        const otp=req.body.otp;
        const type=req.body.type;
        const values=req.body;
        const data=await otpModel.findOne({email:email});
        if(checkLib.isEmpty(data)){
            res.status(400).send(responseLib.generate(true,"invalid email",null));
        }
        else{
            if(data.otp==otp && data.type==type){
                switch(type){
                    case "register":
                        msg=await userController.register(values);
                        res.status(200).send(msg);
                        break;
                    case "login":
                        msg=await userController.login(values);
                        res.status(200).send(msg);
                        break;
                    case "forgetPassword":
                        msg=await userController.forgotPassword(values);
                        res.status(200).send(msg);
                        break;
                } 
            }else{
               throw new Error("please enter a valid otp and type");
            }
        }
        }catch(err){
            res.status(500).send(responseLib.generate(true,err.message,null));
        }

}
module.exports={
    sendOTP: sendOTP,
    verifyOTP: verifyOTP
}
const mongoose=require('mongoose');
const Schema = mongoose.Schema;


const otpSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        enum:['register','login','forgetPassword']
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    expiresAt:{
        type:Date,
        default:600*1000
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
})

const userOtp=mongoose.model('Otp',otpSchema);

module.exports=userOtp;
const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    photo:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    },
    email:{
        type:String,
        required:true,
    },
    mobile:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    mobileVerified:{
        type:Boolean,
        default:false,
    }

})

const User=mongoose.model('User',userSchema);
module.exports=User;
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const logoutSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    jwtid:{
        type: String,
    },
    email:{
        type: String
    },
    logout_time:{
        type: Date,
        default:Date.now()

    }
})

const logOutModel=mongoose.model('logout',logoutSchema);
module.exports=logOutModel;
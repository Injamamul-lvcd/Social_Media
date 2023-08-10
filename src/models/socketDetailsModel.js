const mongoose=require('mongoose');
const Schema=mongoose.Schema

const socketSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    phone:{
        type:String,
        required:true
    },
    socketId:{
        type:String,
        default:null
    },
    rooms:[{
        type:String,
        default:null
    }],
    active_status:{
        type:String,
        enum:['online','offline']
    }
})
const socketDetailsModel=mongoose.model('socket_details',socketSchema);
module.exports =socketDetailsModel;
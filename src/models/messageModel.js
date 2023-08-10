const mongoose=require("mongoose");
const Schema=mongoose.Schema;

//model for messages
const messageSchema=new Schema({
    content:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['sent','delivered','received'],
        default:"sent"
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
});

//creat mongoose model for messages schema
const messageModel=mongoose.model('message',messageSchema);
module.exports=messageModel;
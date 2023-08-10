const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const commentSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'userModel'
    },
    content:{
        type:String,
        required:true
    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:'postModel'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Comment=mongoose.model('Comments',commentSchema);

module.exports=Comment;
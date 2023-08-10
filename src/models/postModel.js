const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const commentModel=require('../models/commentModel')

let postSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userModel',
    },
    caption:{
        type:String,
        default:""
    },
    photo:{
        type:String,
        default:""
    },
    access:{
        type:String,
        enum:["public", "private","friends","followers","followings"],
        default:"public"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})
const Post=mongoose.model('Posts',postSchema);
module.exports=Post;
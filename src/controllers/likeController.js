const postModel=require('../models/postModel')
const likeModel=require("../models/likeModel")
const responseLib=require('../libs/responseLib');
const checkLib=require("../libs/checkLib")


let likePost=async(req,res)=>{
    try{
        const userId=req.user.data._id;
        const postId=req.body.postId;
        //add the like to a post by postId
        const post=await postModel.findById(postId);
        const userLiked=await likeModel.findOne({user:userId,post:postId});
        if(!post){
            res.status(404).send(responseLib.generate(false,"post does not exist",null));
        }else{
            //checking wheather the user already like the post or not
            if(!userLiked){
                const newLike=new likeModel({
                    user:userId,
                    post:postId
                })
                await newLike.save();
                res.status(200).send(responseLib.generate(false,"You liked the post",post));
            }else
                throw new Error("You already liked the post");
        }
    }catch(err){
        res.status(500).send(responseLib.generate(true,err.message,null));
    }
}
//get all the like by postId
let getLikes=async(req,res)=>{
    const page=req.query.page*1 || 1;
    const limit=req.query.limit*1 || 10;
    const skip=(page-1)*limit;
    try{
        let postId=req.params.postId;
        const post=await postModel.findById(postId);
        console.log("This is your post-------",post);
        if(!post){
            throw new Error("The post does not exist");
        }else{
            const likes=await likeModel.find({post:postId},{user:1,_id:0}).populate("user","name")
            .skip(skip)
            .limit(limit);
            res.status(200).send(responseLib.generate(false,"here all likes",likes));
        }
    }catch(err){
        res.status(500).send(responseLib.generate(true,err.message,null));
    }
}

//unlike a post with postId
let unlikePost=async(req,res)=>{
    try{
        userId=req.user.data._id;
        const postId=req.body.id;
        const post=await postModel.findById(postId);
        if(!post){
            throw new Error("post not found");
        }else{
            await likeModel.findOneAndDelete({user:userId, post:postId});
            res.status(200).send(responseLib.generate(false,"you unliked the post",post));
        }
    }catch(err){
        res.status(404).send(responseLib.generate(true,err.message,null));
    }
}

module.exports={
    likePost:likePost,
    unlikePost:unlikePost,
    getLikes:getLikes
}
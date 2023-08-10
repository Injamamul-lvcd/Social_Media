const mongoose = require('mongoose');
const responseLib=require('../libs/responseLib');
const checkLib=require('../libs/checkLib')
const postModel=require('../models/postModel');


// create a post
// let createPost=async(req,res)=>{
//     try {
//         const user=req.user._id;
//         const caption=req.body.caption;
//         let photoPath=null;
//         if(req.file && caption){
//             photoPath=req.file.path;
//             let post=new postModel({
//                 user: user,
//                 caption:caption,
//                 photo:photoPath,
//             })
//             await post.save();
//             res.status(200).send(responseLib.generate(false,"post created successfully",post));
//         }else if(req.file && !caption){
//             photoPath=req.file.path;
//             let post=new postModel({
//                 user: user,
//                 caption: caption,
//                 photo:photoPath
//             });
//             await post.save();
//             res.status(200).send(responseLib.generate(false,"post created successfully",post));
//         }else if(!req.file && caption){
//             let post=new postModel({
//                 user: user,
//                 caption: caption,
//                 photoPath:photoPath
//             })
//             await post.save();
//             res.status(200).send(responseLib.generate(false,"post created successfully",post));
//         }else
//             throw new Error("Invalid request ! please select either a caption or a photo");

//      }catch(err){
//         res.status(500).send(responseLib.generate(true,err.message,null));
//     }
// };
//creat post example
let createPost=async(req,res)=>{
    try {
        const user=req.user.data._id;
        const caption=req.body.caption;
        let photoPath=null;
        const access=req.body.access;
        if(!req.file && !access && !caption){
            throw new Error("You haven't select anything");
            //res.status(200).send(responseLib.generate(false,"post created successfully",post));
        }else{
            if(req.file){
                photoPath=req.file.path;
                let post=new postModel({
                    user: user,
                    caption: caption,
                    photo:photoPath,
                    access:access
                });
                await post.save();
                res.status(200).send(responseLib.generate(false,"post created successfully",post));
            }else if(!req.file){
                let post=new postModel({
                    user: user,
                    caption: caption,
                    photoPath:photoPath,
                    access: access
                })
                await post.save();
                res.status(200).send(responseLib.generate(false,"post created successfully",post));
            }else
                throw new Error("Invalid request ! please select either a caption or a photo");
        }
        }catch(err){
            res.status(500).send(responseLib.generate(true,err.message,null));
        }
};

//get post by user id
let getPostsByUserId=async(req,res)=>{
    const page=req.query.page*1 || 1;
    const limit=req.query.limit*1 || 10;
    const skip=(page-1)*limit;
    try {
        let user=req.params.userId;
        let posts=await postModel.find({user:user},{_id:0,__v:0})
        .skip(skip)
        .limit(limit);
        if(!checkLib.isEmpty(posts)){
            res.status(200).send(responseLib.generate(false,"Post fetched successfully",posts));
        }else
            throw new Error("Couldn't find the post");
    }catch(err){
        res.status(500).send(responseLib.generate(true,err.message,null));
    }
};

//get post by post id
let getPostByPostId=async(req,res)=>{
    try {
        let postId=req.params.postId;
        let post=await postModel.findById(postId);
        if(!checkLib.isEmpty(post)){
            res.status(200).send(responseLib.generate(false,"post fetched successfully",post));
        }else
            throw new Error("Couldn't find any post");
    }catch(err){
        res.status(500).send(responseLib.generate(true,err.message,null));
    }
};

//update the post by post id
let updatePost=async(req,res)=>{
    try{
        let postId=req.body.postId;
        let photoPath=null;
        let caption=req.body.caption;
        let post=await postModel.findById(postId);
        if(!checkLib.isEmpty(post)){
            if(req.file && caption){
                photoPath=req.file.path;
                post.caption=req.body.caption;
                post.photo=photoPath;
                await post.save();
                res.status(200).send(responseLib.generate(false,"post updated successfully",post));
            }else if(req.file && !caption){
                photoPath=req.file.path;
                post.photo=photoPath;
                await post.save();
                res.status(200).send(responseLib.generate(false,"post updated successfully",post));
            }else if(!req.file && caption){
                post.caption=req.body.caption;
                await post.save();
                res.status(200).send(responseLib.generate(false,"post updated successfully",post));
            }else
                throw new Error("You have'nt updated anything")
        }else
            throw new Error("Enter correct post Id")
    }catch(err){
        res.status(500).send(responseLib.generate(true,err.message,null));
    }
};

//update access of the post
let updateAccess =async(req,res)=>{
    try{
        const {postId,access}=req.body;
        const post=await postModel.findById(postId);
        if(!checkLib.isEmpty(post)){
            post.access = access;
            await post.save();
            res.status(200).send(responseLib.generate(false,"access updated successfully",post));
        }else{
            throw new Error("Post not found");
        }
    }catch(error){
        res.status(404).send(responseLib.generate(true,error.message,null));
    }
};

//delete post by post id
let deletePost=async(req,res)=>{
    try{
        let postId=req.body.postId;
        let post=await postModel.findById(postId);
        if(!checkLib.isEmpty(post)){
            await post.remove();
            res.status(200).send(responseLib.generate(false,"post deleted successfully",post));
        }else
            throw new Error("Couldn't find the post");
    }catch(err){
        res.status(500).send(responseLib.generate(true,err.message,null));
    }
};



module.exports={
    getPostsByUserId:getPostsByUserId,
    getPostByPostId:getPostByPostId,
    createPost:createPost,
    updatePost:updatePost,
    updateAccess:updateAccess,
    deletePost:deletePost
}
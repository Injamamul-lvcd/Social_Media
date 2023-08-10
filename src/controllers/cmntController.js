const cmntModel=require('../models/commentModel');
const responseLib=require('../libs/responseLib');
const checkLib=require('../libs/checkLib');
const postModel=require('../models/postModel')



//New comment creates
let createComment=async(req,res)=>{
    try{
        let comment=new cmntModel({
            user:req.user.data._id,
            content:req.body.content,
            postId:req.body.postId
        });
        comment=await comment.save();
        //await postModel.findByIdAndUpdate(req.body.postId,{$push:{comments:comment}});
        res.status(200).json(responseLib.generate(false,"Comment created",comment));
    }catch(err){
        res.status(500).json(responseLib.generate(true,err.message,null));
    }
};

// get comments by postId
let getCmntByPostId=async(req,res)=>{
    const page=req.query.page*1 || 1;
    const limit=req.query.limit*1 || 10;
    const skip=(page-1)*limit;
    try{
        const postId=req.params.postId;
        const comments=await cmntModel.find({postId:postId},{postId:0,_id:0,__v:0})
        .skip(skip)
        .limit(limit);
        if(!checkLib.isEmpty(comments)){
            res.status(200).json(responseLib.generate(false,"Comments fetched",comments));
        }else
            throw new Error("Sorry! comments not found");
    }catch(err){
            res.status(500).json(responseLib.generate(true,err.message,null));
    }
};

//update a comment 
let updateCmnt=async(req,res)=>{
    try{
        const cmntId=req.body.cmntId;
        const comment=await cmntModel.findById(cmntId);
        if(!checkLib.isEmpty(comment)){
            comment.content=req.body.content;
            await comment.save();
            res.status(200).json(responseLib.generate(false,"Comment updated",comment));
        }else
            throw new Error("Sorry! comments not found");
    }catch(err){
        res.status(500).json(responseLib.generate(true,err.message,null));
    }
};

//delete a comment by comment id
let deleteCmnt=async(req,res)=>{
    try{
        const commentId=req.body.id;
        const comment=await cmntModel.findByIdAndDelete(commentId);
        await postModel.findOneAndUpdate({_id:comment.postId},{ $pull:{comments:{ _id: commentId}}},{new: true})
        res.status(200).json(responseLib.generate(false,"Comments deleted successfully",null));
    }catch(err){
        res.status(500).json(responseLib.generate(true,err.message,null));
    }
};


module.exports={
    createComment: createComment,
    getCmntByPostId: getCmntByPostId,
    updateCmnt: updateCmnt,
    deleteCmnt: deleteCmnt
}
const responseLib=require('../libs/responseLib')
const tokenLib=require('../libs/tokenLib')
const check=require('../libs/checkLib');
const userModel=require('../models/userModel')
const postModel=require('../models/postModel')
const cmntModel=require('../models/commentModel')
const logOutModel=require('../models/logOutModel');


// Check the user is authenticated or not.
let isAuthorized=async(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(' ')[1];
        if(!check.isEmpty(token))
        {
            let decoded=await tokenLib.verifyClaimWithoutSecret(token);
            let val=await isTokenBlacklisted(decoded.jwtid)
                if(val){
                    res.status(401).send(responseLib.generate(false,"You are not logged in",null));
              }else{
                    req.user=decoded;
                    next()
              }
        }
        else{
            let apiResponse=responseLib.generate(true,'Authorization Is Missing in Request',null)
            res.status(403).send(apiResponse)
        }
    }catch(err){
        let apiResponse=responseLib.generate(true,err.message,null)
        res.status(403).send(apiResponse)
    }
}

// Checking for admin access

let isAdmin=async(req,res,next) => {
    if(req.user.role==='admin'){
        next()
    }else{
        let apiResponse=responseLib.generate(false,'You are not authorized to perform this action',null)
        res.status(403).send(apiResponse)
    }
}

// Checking for user access for profile updations
let isUser=async(req, res,next) =>{
    const userId=req.user._id;
    console.log("This is user id",userId);
    const profile = await userModel.findById(userId);
    if(profile._id==userId){
        next()
    }else{
        let apiResponse=responseLib.generate(true,'You are not authorized to perform this action',null)
        res.status(403).send(apiResponse)
    }
}

//checking for user access to update the post
let isPostAuthor=async(req,res,next) => {
    const userId=req.user._id;
    console.log("this is user id:... " + userId);
    const postId=req.body.postId;
    console.log("This is postId:..... " + postId);
    const post=await postModel.findById(postId);
    if(post.user==userId){
        next();
    }else
        res.status(403).send(responseLib.generate(true,"you are not allowed to perform this action",null));
}
let isCommentAuthor=async(req,res,next)=>{
     const userId=req.user._id;
     const cmntId=req.body.cmntId;
     const comment=await cmntModel.findById(cmntId);
     if(comment.user==userId){
        next();
     }else
        res.status(403).send(responseLib.generate(true,"you_are_not_allowed to perform this action",null));
}
// Function to check if a token is blacklisted
const isTokenBlacklisted = async(tokenId) => {
    try{
        let data= await logOutModel.find({jwtid:tokenId});
        if(data.length==0){
            return false;
        }else
            return true;
    }catch(err){
        throw err;
    }
};
module.exports={
    isAuthorized:isAuthorized,
    isAdmin:isAdmin,
    isUser:isUser,
    isPostAuthor:isPostAuthor,
    isCommentAuthor:isCommentAuthor
}
const mongoose = require("mongoose");
const logOutModel=require("../models/logOutModel")
const UserModel = require("../models/userModel");
const tokenLib = require("../libs/tokenLib");
const passwordLib = require("../libs/passwordLib");
const responseLib = require("../libs/responseLib");
const checkLib = require("../libs/checkLib");
const friendModel = require("../models/friendsModel");
const followersModel = require("../models/followerModel");
const followingModel = require("../models/followingModel");
const postModel=require("../models/postModel");




// Login
let login=async(values)=>{
  try {
        let msg={};
        const {email, password} =values;
        let user=await logOutModel.find({email:email});
        console.log(user);
        if(user.length!=0){
            await logOutModel.findOneAndRemove({email:email});
        }
        let findUser = await UserModel.findOne({ email: email });
        if(checkLib.isEmpty(findUser)){
            throw new Error("User not registered");
        }
        if(await passwordLib.verify(password, findUser.password)){
            let payload = {
                exp: findUser.exp,
                token: await tokenLib.generateToken(findUser),
             };
             msg=responseLib.generate(false,"You logged in",payload);
             return msg;
        }else
            msg=responseLib.generate(true,"user login failed",null);
            return msg;
    }catch(err){
        console.log(err.message);
    }
};
//logOut
let logOut= async(req,res)=>{
    try{
        let tokenId=req.user.jwtid;
        let data= new logOutModel({
            userId:req.user.data._id,
            jwtid:tokenId,
            email:req.user.data.email
        })
        await data.save();
        res.status(200).send(responseLib.generate(false,"Logout successfull",req.user))
    }catch(err){
        res.status(500).send(responseLib.generate(true,err.message,null));
    }   
}
//Registration
let register = async (values) => {
  try {
        let msg={};
        const email = values.email;
        let findUser = await UserModel.findOne({ email: email });
        let newUser = new UserModel({
            name: values.name,
            password: await passwordLib.hash(values.password),
            mobileVerified:true,
            email: values.email,
            mobile: values.mobile,
            });
        if(checkLib.isEmpty(findUser)) {
            let payload = (await newUser.save()).toObject();

            delete payload._v;
            delete payload._id;
            delete payload.password;
            msg=responseLib.generate(false,"user registered successfully", payload);
            return msg;
        }else{
            msg=responseLib.generate(true,"This email is already registered",null);
            return msg;
        }
    }catch (err){
        console.log(err.message);
    }
};

// Users email verification
let emailVerification = async (req, res) => {
  try{
        const{ email, otp } = req.body;
        const findUser = await UserModel.findOne({ email: email });
        console.log(findUser);
        if(findUser.otp == otp) {
            findUser.isVerified = true;
            await findUser.save();
            res.status(200).send(responseLib.generate(false, "Email verification successful", findUser));
        }else
            throw new Error("Invalid OTP! please enter corrct OTP");
    }catch(err){
        res.status(500).send(responseLib.generate(true, err.message, null));
    }
};

//get user list
let getUserList = async (req, res) => {
    const page=req.query.page*1 || 1;
    const limit=req.query.limit*1 || 10;
    const skip=(page-1)*limit;
    try{
        let data = await UserModel.find({},{name:1,_id:1})
        .skip(skip)
        .limit(limit);
        if(!checkLib.isEmpty(data)){
            res.status(200).send(responseLib.generate(false, "found the list", data));
         }else{
            throw new Error("An error occurd");
        }
    }catch(err){
        res.status(400).send(responseLib.generate(true, err.message, null));
    }
};
//searching by  user name with pagination
let searchUsers=async(req,res)=>{
  const { query, page = 1, pageSize = 10 } = req.query;
  const skip = (page - 1) * pageSize;
  try{
        let allResults=await UserModel.find({
            "$or":[
                {"name":{$regex:query,$options: 'i'}}
            ]
        },{name:1,_id:1})
        .skip(skip)
        .limit(pageSize);
        //.sort({createdAt: -1});
        // const userResults = await UserModel.find({
        //     "$or": [
        //       { "name": { $regex: query, $options: 'i' }}
        //     ]
        //   }).select('name');
      
        //   // Search for posts matching the keyword
        //   const postResults = await postModel.find({
        //     "$or": [    
        //     {"caption": { $regex: query, $options: 'i' }}
        //     ]
        //   }).select('caption');
        // const allResults = Object.assign({},userResults,postResults)
        if(allResults.length==0){
            throw new Error("No results found");
        }else
            res.status(200).send(responseLib.generate(false,"here your results",allResults))  
    }catch(error){
        res.status(500).send(true,error.message,null);
    }
}

//forget and reset
let forgotPassword= async(values)=>{
    try{
        let { newPassword,email } = values;
        console.log("This is your email and newpassword........")
        console.log(email+"and"+newPassword)
        newPassword=await passwordLib.hash(newPassword)
        const findUser = await UserModel.findOneAndUpdate({ email: email },{password: newPassword});
        console.log(findUser);
        if(!checkLib.isEmpty(findUser)){
            let msg=responseLib.generate(false,"password reset successful", findUser);
            return msg;
        }else
            throw new Error("You are not registered");
    }catch(err){
        console.log(err.message)
    }
}

//update the profile
let updateProfile =async(req,res)=>{
    try{
        let id=req.user.data._id;
        let photoPath =null;
        let bio=req.body.bio;
        let profile=await UserModel.findById(id);
        if(!checkLib.isEmpty(profile)){
            if(req.file && bio){
                photoPath =req.file.path;
                profile.bio=bio;
                profile.photo=photoPath;
                await profile.save();
                res.status(200).send(responseLib.generate(false,"profile updated successfully",profile));
            }else if(req.file && !bio){
                photoPath =req.file.path;
                profile.photo=photoPath;
                await profile.save();
                res.status(200).send(responseLib.generate(false,"profile updated successfully",profile));
            }else if(!req.file && bio){
                profile.bio=bio;
                await profile.save();
                res.status(200).send(responseLib.generate(false,"profile updated successfully",profile));
            }else
                throw new Error("You have'nt updated anything");
        }else
            throw new Error("profile is not available")

    }catch(err){
        res.status(401).send(responseLib.generate(true,err.message,null));
    }
}

//delete a profile
let deleteProfile =async(req,res)=>{
    try{
        let userId=req.user.data._id;
        let user=await UserModel.findById(userId);
        if(!checkLib.isEmpty(user)){
            await UserModel.remove()
            res.status(200).send(responseLib.generate(false,"profile deleted successfully",null));
        }else
            throw new Error("Couldn't find the profile");


    }catch(err){
        res.status(500).send(responseLib.generate(true,err.message,null));
    }
}

// go to newsfeed
// I make it without pagination
let newsFeed =async(req,res) => {
    try {
        let userId=req.user.data._id;
        // Get the user's followers,followings and friends
        const followings=await followingModel.find({user:userId});
        const followers =await followersModel.find({user:userId});
        const friends =await friendModel.find({user:userId});
        console.log("-------------------------")
        console.log("followings: " + followings)
        console.log("followers: " + followers)
        console.log("friends: " + friends)
   
        // Fetch relevant posts from publics, friends,followings and followers
        const relevantPosts = await postModel.find({
            $or: [
                { access: 'public' },
                {
                    access: 'friends', 
                    user: { $in: friends } 
                },
                {
                    access: 'followings', 
                    user: { $in:followings } 
                },
                { 
                    access: 'followers', 
                    user: { $in:followers } 
                },
                { 
                    access: 'private', 
                    user: userId 
                }
              ]
            },{_id:0,__v:0})
            .sort({ createdAt: -1 });
        console.log("Relevant posts:",relevantPosts)
        if(!checkLib.isEmpty(relevantPosts))
            res.status(200).send(responseLib.generate(false,"Newsfeed",relevantPosts));
        else{
            throw new Error("Couldn't find any posts");
        }
    }catch(err){
        res.status(500).send(responseLib.generate(true,err.message,null));
    }
};
module.exports = {
  login: login,
  logOut: logOut,
  register: register,
  getUserList: getUserList,
  forgotPassword:forgotPassword,
  emailVerification: emailVerification,
  show: getUserList,
  updateProfile: updateProfile,
  deleteProfile: deleteProfile,
  searchUsers:searchUsers,
  newsFeed:newsFeed
};

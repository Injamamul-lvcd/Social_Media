const userModel = require('../models/userModel');
const followerModel=require("../models/followerModel");
const followingModel = require("../models/followingModel");
const responseLib=require('../libs/responseLib');
const checkLib = require('../libs/checkLib');



// Follow a user
let followUser=async(req,res)=>{
  try{
      const userId= req.user.data._id;
      const followingId = req.body.id;
      const user=await userModel.findById(followingId);
      
      //user registered or not
      if(checkLib.isEmpty(user)){
        res.status(404).send(responseLib.generate(false,"user not registered",null));
      }
      //check whether it trying to follower himself/herself
      if(userId==followingId)
        throw new Error("You can't follow yourself");
      //check if user already following the following user
      const existingFollowing=await followerModel.findOne({user:followingId,follower:userId});
      if(existingFollowing){
        res.status(200).send(responseLib.generate(false,"You already following to this user",existingFollowing));
      }else{
        const newFollowing=new followingModel({
          user:userId,
          following:followingId
        });
        await newFollowing.save();
        const newFollower=new followerModel({
          user:followingId,
          follower:userId
        });
        await newFollower.save();
        res.status(200).send(responseLib.generate(false,"following successfull",newFollowing));
  
      }
    }catch (error){
      res.status(500).send(responseLib.generate(true,error.message,null));
    }
}

// Unfollow a user
let unfollowUser=async(req, res)=>{
  try{
      const  userId  = req.user.data._id;
      const  followingId  = req.body;
      const following= await userModel.findById(followingId);
      if(checkLib.isEmpty(following)){
        throw new Error("User not registered",null);
      }else{
        //check wheather the user is follow or not
        const existingFollowing=await followingModel.findOne({user:userId,following:followingId});
        if(checkLib.isEmpty(existingFollowing)){
          throw new Error("You are not a follower");
        }else{
          await followingModel.findByIdAndRemove({user:userId,following:followingId});
          await followerModel.findOneAndRemove({user:followingId,follower:userId});
          res.status(200).send(responseLib.generate(false,"You unfollow this user",null));
        }
      }
  }catch(error){
    res.status(500).send(responseLib.generate(true,error.message,null));
  }
}

// Get followers of a user
let getFollowers=async(req, res)=>{
    const page=req.query.page*1 || 1;
    const limit=req.query.limit*1 || 10;
    const skip=(page-1)*limit;
  try{
      const userId= req.params.userId;
      // find the followers using userId
      const user = await userModel.findById(userId)
      if(checkLib.isEmpty(user)){
        throw new Error("user not registered");
      }else{
        const followers = await followerModel.find({user:userId},{follower:1,_id:0}).populate("follower","name");
        if(checkLib.isEmpty(followers)){
          res.status(404).send(responseLib.generate(false,"The user don't have a follower",null));
        }else{
          res.status(200).send(responseLib.generate(false,"Here the followers are",followers));
        }
      }
    }catch(error){
      res.status(500).send(responseLib.generate(true,error.message,null));
  }
}

// Get users followed by a user
let getFollowings=async(req, res)=>{
    const page=req.query.page*1 || 1;
    const limit=req.query.limit*1 || 10;
    const skip=(page-1)*limit;
  try{
      const userId= req.params.userId;
      //find the followings using userId
      const user = await userModel.findById(userId)
      if(checkLib.isEmpty(user)){
        throw new Error("user not registered");
      }else{
        const followings = await followingModel.find({user:userId},{following:1,_id:0}).populate("following","name");
        if(checkLib.isEmpty(followings)){
          throw new Error("The user don't follow anyone");
        }else{
          res.status(200).send(responseLib.generate(false,"Here the followings are",followings));
        }
      }
    }catch(error){
      res.status(500).send(responseLib.generate(true,error.message,null));
    }
}

module.exports = {
  followUser:followUser,
  unfollowUser:unfollowUser,
  getFollowers:getFollowers,
  getFollowings:getFollowings
};

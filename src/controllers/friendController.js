const  userModel= require('../models/userModel');
const checkLib=require('../libs/checkLib');
const friendModel=require("../models/friendsModel")
const friendRequestModel= require("../models/friendRequestModel");
const responseLib=require('../libs/responseLib');


//friend request send
let sendFriendRequest=async(req,res)=>{
    try {
        const  userId= req.user.data._id;
        const requesterId= req.body.requesterId;
        //Update the requester's friendRequests field
        //before update,checking wheather the request is already send or not
        const requester=await userModel.findById(requesterId);
        if(checkLib.isEmpty(requester)){
            throw new Error("requester does not exist");
        }else if(userId === requesterId){
            throw new Error("You can't send friend requests to Yourself");
        }else{
            const friend=await friendModel.findOne({user:userId,friend:requesterId});
            const friendRequest = await friendRequestModel.findOne({user:requesterId,friendRequest:userId});
            if(!friend && !friendRequest){
                const newRequest=new friendRequestModel({
                    user:requesterId,
                    friendRequest:userId
                })
                await newRequest.save();
                res.status(200).send(responseLib.generate(false,"friend request sent successfully",null));
            }else{
                throw new Error("You already have a friend request or both are friends")
            }    
        }
    }catch (error){
        res.status(500).send(responseLib.generate(true,error.message,null));
    }
}

//accept a friend request
let acceptFriendRequest=async(req,res)=>{
    try {
        const requestId = req.body.requestId;
        const acceptorId = req.user.data._id;
        //Update the acceptor's friendRequests and friends fields
        const user=await userModel.findById(requestId);
        if(checkLib.isEmpty(user)){
            throw new Error("RequestId does'nt exist");
        }else{
            const isFriend=await friendModel.findOne({user:acceptorId,friend:requestId})
            if(isFriend){
                throw new Error("You both are already friends");
            }else{
                const newFriend=new friendModel({
                    user:acceptorId,
                    friend:requestId
                });
                await newFriend.save();
                //make a friend of requester also
                const friend=new friendModel({
                    user:requestId,
                    friend:acceptorId
                });
                await friend.save();
                //Update the requester's friends field
                await friendRequestModel.findOneAndDelete({user:acceptorId,friendRequest:requestId});
                res.status(200).send(responseLib.generate(false,'Friend request accepted successfully',null));
                }
            }      
    }catch(error){
        res.status(500).send(responseLib.generate(true,error.message,null));
    }
};

//get all the friend requests
let getFriendRequests=async(req,res)=>{
    try {
        const userId = req.user.data._id;
        const page=req.query.page*1 || 1;
        const limit=req.query.limit*1 || 10;
        const skip=(page-1)*limit;
        //Retrieve the user's friend requests
        const friendRequests = await friendRequestModel.find({user:userId},{friendRequest:1,_id:0}).populate("friendRequest","name")
        .skip(skip)
        .limit(limit);
        if(checkLib.isEmpty(friendRequests)){
            res.status(404).send(responseLib.generate(false,"You don't have any friend requests",null));
        }else{
            res.status(200).send(responseLib.generate(false,"You have friend requests",friendRequests));
        }     
    }catch(error){
        res.status(500).send(responseLib.generate(false,error.message,null));
    }
}

//get all the friends
let getFriends=async(req,res)=>{
    try {
        const userId= req.params.userId;
        const page=req.query.page*1 || 1;
        const limit=req.query.limit*1 || 10;
        const skip=(page-1)*limit;
        const isUser=await userModel.findById(userId)
        if(!isUser)
        {
            throw new Error("User not registered")
        }else{
            //Retrieve the user's friendlist
            const friends= await friendModel.find({user:userId},{friend:1,_id:0}).populate("friend","name")
            .skip(skip)
            .limit(limit);
            if(!checkLib.isEmpty(friends))
                res.status(200).send(responseLib.generate(false,"Your friends are",friends));
            else
                throw new Error("You dont have any friends")
        }
    }catch(error){
        res.status(500).send(responseLib.generate(true,error.message,null));
    }
}
// cancel a friend request
let cancelRequest =async(req,res)=>{
    try{
        const myId=req.user.data._id;
        const requestedId=req.body.requestedId;
        const isUser=await userModel.findById(requestedId);
        if(checkLib.isEmpty(isUser)){
            throw new Error("User does not exist")
        }else{
            let data=await friendRequestModel.findOne({user:requestedId,friendRequest:myId})
            if(data){
                await friendRequestModel.findOneAndDelete({user:requestedId,friendRequest:myId})
                res.status(200).send(responseLib.generate(false,"You cancelled the request",null))
            }else{
                throw new Error("you have'nt sent any requet to this user")
            }
        }
    }catch(error){
        res.status(500).send(responseLib.generate(true,error.message,null));
    }
}
//reject a friend request
let rejectRequest =async(req,res)=>{
    try{
        const myId=req.user.data._id
        const requestorId=req.body.requestorId
        const user=await userModel.findById(requestorId)
        if(checkLib.isEmpty(user)){
            throw new Error("User does'nt exist");
        }else{
            let data=await friendRequestModel.findOne({user:myId,friendRequest:requestorId})
            if(data){
                await friendRequestModel.findOneAndDelete({user:myId,friendRequest:requestorId})
                res.status(200).send(responseLib.generate(false,"Friend request rejected",null))
            }else
                throw new Error("User have'nt send you any friend request");
        }
    }catch(error){
        res.status(500).send(responseLib.generate(true,error.message,null));
    }
}

// unfriend a user
let unFriend=async(req,res)=>{
    try{
        const myId=req.user.data._id
        const friendId=req.body.friendId
        const friend=await userModel.findById(friendId);
        if(checkLib.isEmpty(friend)){
            throw new Error("Friend is not registered")
        }else{
            let data=await friendModel.findOne({user:myId, friend:friendId});
            if(data){
                await friendModel.findOneAndDelete({user:myId, friend:friendId})
                await friendModel.findOneAndDelete({user:friendId, friend:myId})
                res.status(200).send(responseLib.generate(false,"Unfriend successfully updated",data));
            }else{
                throw new Error("You are not a friend of this user");
            }  
        }
    }catch(error){
        res.status(500).send(responseLib.generate(true,error.message,null));
    }
}

module.exports = {
  sendFriendRequest:sendFriendRequest,
  acceptFriendRequest:acceptFriendRequest,
  getFriendRequests:getFriendRequests,
  getFriends:getFriends,
  cancelRequest:cancelRequest,
  rejectRequest:rejectRequest,
  unFriend:unFriend
};


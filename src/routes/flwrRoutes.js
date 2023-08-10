const express = require('express');
const FollowerController=require('../controllers/flwrController')
const auth=require('../middlewares/auth')


// Follower Routes
const setRouter=(app)=>{

    app.post('/users/follow',auth.isAuthorized,FollowerController.followUser);
    app.delete('/users/unfollow',auth.isAuthorized,auth.isUser,FollowerController.unfollowUser);
    app.get('/users/followers/:userId',auth.isAuthorized,FollowerController.getFollowers);
    app.get('/users/followings/:userId',auth.isAuthorized,FollowerController.getFollowings);
}

module.exports={setRouter:setRouter}


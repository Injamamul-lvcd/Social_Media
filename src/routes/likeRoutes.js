const express= require('express');
const LikeController=require('../controllers/likeController');
const auth=require('../middlewares/auth');


// Like Routes
let setRouter=(app)=>{
    app.get('/post/likes/:postId',auth.isAuthorized,LikeController.getLikes)
    app.put('/post/like',auth.isAuthorized,LikeController.likePost);
    app.put('/post/Unlike',auth.isAuthorized,auth.isUser,LikeController.unlikePost);
}

module.exports={setRouter:setRouter}


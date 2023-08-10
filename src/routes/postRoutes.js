const express = require('express');
const auth=require('../middlewares/auth');
const upload=require('../middlewares/upload');
const postController=require('../controllers/postController')



//set routes for Posts
let setRouter=(app)=>{
    
    app.post('/user/post',auth.isAuthorized,upload.single('photo'),postController.createPost);
    app.get('/user/posts/:userId',auth.isAuthorized,postController.getPostsByUserId);
    app.get('/user/post/:postId',auth.isAuthorized,postController.getPostByPostId);
    app.put('/user/post',auth.isAuthorized,upload.single('photo'),auth.isPostAuthor,postController.updatePost);
    app.put('/user/post/access',auth.isAuthorized,auth.isPostAuthor,postController.updateAccess);
    app.delete('/user/post',auth.isAuthorized,auth.isPostAuthor,postController.deletePost);

}

module.exports={setRouter:setRouter}
const cmntController=require('../controllers/cmntController');
const auth=require('../middlewares/auth');
const express=require('express');


//Routes for Comments
let setRouter=(app)=>{
    app.post('/post/comment',auth.isAuthorized,cmntController.createComment);
    app.get('/post/comment/:postId',auth.isAuthorized,cmntController.getCmntByPostId);
    app.put('/post/comment/update',auth.isAuthorized,auth.isCommentAuthor,cmntController.updateCmnt);
    app.delete('/post/comment/delete',auth.isAuthorized,auth.isCommentAuthor,cmntController.deleteCmnt);
}


module.exports ={setRouter:setRouter}


const friendRequestController=require('../controllers/friendController');
const auth=require('../middlewares/auth');


// Friends request Routes
let setRouter=(app)=>{
    app.post('/user/friend-request',auth.isAuthorized,friendRequestController.sendFriendRequest);
    app.post('/user/friend-request/accept',auth.isAuthorized,friendRequestController.acceptFriendRequest);
    app.get('/user/friend-request',auth.isAuthorized,friendRequestController.getFriendRequests);
    app.get('/user/friends/:userId',auth.isAuthorized,friendRequestController.getFriends); 
    app.put('/user/friends/cancel',auth.isAuthorized,auth.isUser,friendRequestController.cancelRequest); 
    app.put('/user/friends/reject',auth.isAuthorized,auth.isUser,friendRequestController.rejectRequest);
    app.put('/user/unfriend',auth.isAuthorized,auth.isUser,friendRequestController.unFriend);
}

module.exports={setRouter:setRouter}


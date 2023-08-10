const upload=require('../middlewares/upload')
const otpController=require('../controllers/otpController')
const validator=require('../middlewares/validator')
const auth=require('../middlewares/auth')
const userController=require('../controllers/userController')



let setRouter = (app)=>{
    app.post('/user/logout',auth.isAuthorized,userController.logOut);
    app.get('/search/:keyword',auth.isAuthorized,userController.searchUsers);
    app.get("/newsfeed",auth.isAuthorized,userController.newsFeed)
    app.get("/user/allusers",auth.isAuthorized,userController.getUserList)
    app.post('/generate-otp',otpController.sendOTP);
    app.post('/verify-otp',validator.typeValidate,otpController.verifyOTP);
    app.put('/user/update-profile',upload.single('photo'),auth.isAuthorized,auth.isUser,userController.updateProfile);
    app.delete('/user/delete-profile',auth.isAuthorized,auth.isUser,userController.deleteProfile)
}

module.exports={setRouter:setRouter}
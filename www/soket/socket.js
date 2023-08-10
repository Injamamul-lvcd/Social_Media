const socketIo=require('socket.io')
const socketDetailsModel=require('../../src/models/socketDetailsModel')
const otpLib=require('../../src/libs/otpLib')
const messageModel=require('../../src/models/messageModel')
const groupMsgModel=require('../../src/models/groupMsgModel')
const privateMsgModel=require('../../src/models/privateMsgModel')
let startSocket=(server)=>{
    const io=socketIo(server);
    io.on('connection',(socket) => {
      socket.on("join", async (data) => {
        const { userId, phone } = data;
        try{
          let user = await socketDetailsModel.findOne({ phone: phone });
          if (user) {
            user.active_status = "online";
            user.socketId = socket.id;
            await user.save();
            console.log(phone + " is online");
          } else {
            let newUser = new socketDetailsModel({
              userId: userId,
              phone: phone,
              socketId: socket.id,
              active_status: "online"
            });
            await newUser.save();
            console.log(phone + " is online");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      });      
      socket.on('create_room',async()=>{
          let room=otpLib.randomString(6)
          let user=await socketDetailsModel.findOneAndUpdate({socketId:socket.id},{$push:{rooms:room}});
          socket.join(room);
          io.in(room).emit('message',`The room is created by ${user.phone}`);
          socket.emit('room_no',`Your room is ${room}`);
        });
      
        socket.on('join_room',async(room)=>{
           // Store the user's name and socket ID in the users schema
          let user=await socketDetailsModel.findOneAndUpdate({socketId:socket.id},{$push:{rooms:room}});
          if(!user)
            socket.emit('error',"First you have to join  socket-server");
          socket.emit('message', `Welcome to room ${room}!`);
          io.in(room).emit('message', `A new user ${user.phone} has joined the room`);
          socket.join(room);
        });
      // files sharing features
      socket.on('sendFile', (data) => {
        const { fileData, fileName, fileType, receiver } = data;
        const filePath = `uploads/${fileName}`;
        fs.writeFileSync(filePath, fileData, 'base64');
        socket.to(receiver).emit('fileReceived', { fileName, fileType });
        console.log(`File '${fileName}' sent to ${receiver}`);
      });
          
      // Group message 
      socket.on('group_chat',async(data) => {
        try{
            let {room, message} = data;
            let user= await socketDetailsModel.findOne({socketId:socket.id})
            if(!user){
              socket.emit('error',"First you to joined to socket-server");
            }else{
              if(user.rooms.includes(room)){
              io.in(room).emit('message',user.phone+":"+message);
              let newMessage= new messageModel({
                  content: message,
                  status:"delivered"
                })
              await newMessage.save();
              // Store the conversation in DB
              const conversation = new groupMsgModel({
                  room: room,
                  user: user._id,
                  message: newMessage._id
                });
              await conversation.save()
              }
            }
        }catch(err) {
          console.log("error: " + err.message);
        }
      });
        
      // personal message
      socket.on('private_chat',async(data) => {
          try{
              let {receiverSocketId,message} = data;
              const getSender=await socketDetailsModel.findOne({socketId:socket.id})
              const getReceiver=await socketDetailsModel.findOne({socketId:receiverSocketId})
              if(getReceiver){ 
                io.to(receiverSocketId).emit('message',getSender.phone+":"+message);
                let newMsg=new messageModel({
                  content:message,
                  status:"delivered"
                })
                await newMsg.save();
                const privateConversation = new privateMsgModel({
                  sender: getSender.userId,
                  receiver: getReceiver.userId,
                  message: message
                });
                await privateConversation.save();
              }else{
                //socket.emit('error', 'Invalid receiver user.');
                console.log(" receiver socket id is not exist");
              }
          }catch(err){
              console.log("error",err.message);
          }
      });
      socket.on('disconnect', async()=> {
        try{
            let user=await socketDetailsModel.findOneAndUpdate({socketId:socket.id},{active_status :"offline"});
            console.log(user.phone+" is disconnected");
          }catch(error){
            console.log(error.message);
          }
        });
    });
}
module.exports={
    startSocket:startSocket
}
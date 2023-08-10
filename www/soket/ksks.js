socket.on("join", async (data) => {
    const { userId, phone } = data;
  
    try {
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
  
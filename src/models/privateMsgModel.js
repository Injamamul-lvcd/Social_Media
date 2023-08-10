const mongoose=require('mongoose');
const Schema = mongoose.Schema;


// Define a Mongoose schema for the personal conversation
const privateConversationSchema = new Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    receiver:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    message:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'message',
    },
    timestamp:{ 
        type: Date, 
        default: Date.now 
    }
  });
  
 // Create a Mongoose model based on the schema
const privateMsgModel= mongoose.model("PrivateConversation", privateConversationSchema);
module.exports = privateMsgModel;
  
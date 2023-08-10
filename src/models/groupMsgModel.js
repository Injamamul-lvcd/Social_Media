const mongoose = require('mongoose')
const Schema = mongoose.Schema;


//Model for group chat messages
const groupConversationSchema = new Schema({
  room:{ 
    type: String, 
    required: true 
    },
  user:{ 
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

// Create a Mongoose model for group model
const groupMsgModel= mongoose.model("GroupConversation", groupConversationSchema);
module.exports= groupMsgModel;
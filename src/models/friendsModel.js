const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const friendSchema = new Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  friend:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Friend = mongoose.model('Friends', friendSchema);

module.exports = Friend;

const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const friendRequestSchema = new Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  friendRequest:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const FriendRequest = mongoose.model('FriendRequests', friendRequestSchema);

module.exports = FriendRequest;

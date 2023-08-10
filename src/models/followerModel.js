const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followerSchema = new Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  follower:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Follower = mongoose.model('Followers', followerSchema);

module.exports = Follower;

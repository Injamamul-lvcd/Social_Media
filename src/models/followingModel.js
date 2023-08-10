const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const followingSchema = new Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Following = mongoose.model('Followings', followingSchema);

module.exports = Following;

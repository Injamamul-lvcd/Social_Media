const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const likeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Posts',
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Like = mongoose.model('Likes', likeSchema);

module.exports = Like;

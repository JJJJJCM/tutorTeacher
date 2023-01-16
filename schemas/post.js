const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  writer : {
    type : mongoose.SchemaTypes.ObjectId,
    required : true
  },
  title : {
    type : String,
    required : true
  },
  date : {
    type : String,
    required : true
  },
  time : {
    type : Date,
    default : Date.now
  },
},{id : false})

postSchema.virtual('postId').get(function(){
  return this._id.toHexString();
})
postSchema.set('toJSON', {
  virtuals: true
})

module.exports = mongoose.model("posts", postSchema);
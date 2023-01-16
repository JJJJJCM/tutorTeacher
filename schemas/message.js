const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatroomId : {
    type : mongoose.SchemaTypes.ObjectId,
    required : true
  },
  userId : {
    type : mongoose.SchemaTypes.ObjectId,
    required : true
  },
  content : {
    type : String,
    required : true
  },
  date : {
    type : Date,
    default : Date.now
  },
},{id : false})

messageSchema.virtual('messageId').get(function(){
  return this._id.toHexString();
})
messageSchema.set('toJSON', {
  virtuals: true
})

module.exports = mongoose.model("messages", messageSchema);
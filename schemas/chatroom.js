const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
  member : {
    type : Array
  },
  date : {
    type : Date,
    default : Date.now
  },
  title : {
    type : String,
    required : true
  },
},{id : false})

chatroomSchema.virtual('chatroomId').get(function(){
  return this._id.toHexString();
})
chatroomSchema.set('toJSON', {
  virtuals: true
})

module.exports = mongoose.model("chatrooms", chatroomSchema);
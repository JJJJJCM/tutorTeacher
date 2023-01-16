const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nickname : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true
  },
  confirm : {
    type : String,
    required : true
  },
},{id : false})

userSchema.virtual('userId').get(function(){
  return this._id.toHexString();
})
userSchema.set('toJSON', {
  virtuals: true
})

module.exports = mongoose.model("users", userSchema);
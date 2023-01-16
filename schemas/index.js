const mongoose = require("mongoose")
mongoose.set('strictQuery', false)

const connect = () => {
  mongoose
    .connect("mongodb+srv://ckdals1994:ckdalsla94@cluster0.xtrzoeq.mongodb.net/test_websocket?retryWrites=true&w=majority")
    .catch(err => console.log(err))
};

mongoose.connection.on("error", err => {
  consoe.error("몽고디비 연결 에러", err)
})

module.exports = connect
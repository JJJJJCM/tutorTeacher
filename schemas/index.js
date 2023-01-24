const mongoose = require("mongoose")
mongoose.set('strictQuery', false)

const connect = () => {
  mongoose
    .connect(process.env.DB_URL)
    .catch(err => console.log(err.message))
};

mongoose.connection.on("error", err => {
  console.error("몽고디비 연결 에러", err)
})

module.exports = connect
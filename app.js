const express = require('express')
const connect = require('./schemas')
const bodyParser= require('body-parser')
const upload = require('./middlewares/upload-middleware')
const cookieParser = require('cookie-parser')

const postRouter = require('./routes/post.js')
const userRouter = require('./routes/user.js')
const chatroomRouter = require('./routes/chatroom.js')
const messageRouter = require('./routes/message.js')
const authMiddleware = require('./middlewares/auth-middleware.js')

const app = express() // 이거 밑에다 추가하면 됨
const port = 8080
connect()

// socket.io
const http = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

app.set('view engine', 'ejs')
app.use('/public', express.static('public'))
app.use(bodyParser.urlencoded({extended: true})) 
app.use(cookieParser())
app.use(express.json())

app.use('/api', [postRouter, userRouter, chatroomRouter, messageRouter]) // upload 추가하기

// 스케줄 입력 페이지
app.get('/', (req, res) => {
  res.render('post.ejs')
})

// 게시글 전체 목록
app.get('/list', (req, res) => {
  res.render('list.ejs')
})

// 게시글 상세 페이지
app.get('/detail/:postId', (req, res) => {
  const {postId} = req.params
  res.render('detail.ejs', {postId})
})

// 로그인 페이지
app.get('/login', (req, res) => {
  res.render('login.ejs')
})

// 회원가입 페이지
app.get('/signup', (req, res) => {
  res.render('signup.ejs')
})

// 업로드 패이지
app.get('/upload', (req, res) => {
  res.render('upload.ejs')
})
app.post('/upload', upload.single('profile'), (req, res) => { // multer가 원래 미들웨어
  res.status(200).json({message : '업로드 완료'})
})
app.get('/upload/:imageName', (req, res) => {
  const {imageName} = req.params
  
  res.sendFile(__dirname + '/public/image/' + imageName)
})

// 채팅방 페이지
app.get('/chat', authMiddleware, (req, res) => {
  res.render('chat.ejs')
})

// socket.io 페이지
app.get('/socket', (req, res) => {
  res.render('socket.ejs')
})

// websocket 양방향 통신, socket.io 라이브러리 사용
io.on('connection', (socket) => {
  console.log('유저 접속 됨')

  socket.on('roomSend', (data) => {
    io.to('room1').emit('broadcast', data)
  })
  socket.on('joinroom', (data) => {
    socket.join('room1')
  })

  socket.on('user-send', (data) => {  // 클라이언트 -> 서버, eventlistener
    io.emit('broadcast', data)  // 서버 -> 클라이언트, 모든 유저에게
  })
})

http.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!')
})





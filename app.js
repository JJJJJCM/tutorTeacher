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

const app = express()
const port = 8080
connect()

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

// 업로드패이지-------------------------------------
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
//-------------------------------------------------

// 채팅방 페이지
app.get('/chat', authMiddleware, (req, res) => {
  res.render('chat.ejs')
})

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!')
})





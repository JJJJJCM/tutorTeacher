const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

const User = require('../schemas/user.js')
const authMiddleware = require('../middlewares/auth-middleware.js')

// 회원가입
router.post('/signup', async (req, res) => {
  const {nickname, password, confirm} = req.body
  const nicknameCheck = /^(?=.*?[a-zA-Z])(?=.*?[0-9]).{4,20}$/

  if(!nickname || !password || !confirm) return res.status(400).json({message : '아이디 또는 비밀번호를 입력해주세요.'})

  if(!nicknameCheck.test(nickname)) return res.status(412).json({message : '아이디 형식이 비정상적입니다.'})

  if(nickname === password) return res.status(412).json({message : '패스워드에 닉네임이 포함되어 있습니다.'})

  if(password.length < 4 || confirm.length < 4) return res.status(412).json({message : '패스워드가 4자리 이상이어야합니다.'})

  if(password !== confirm) return res.status(412).json({message : '패스워드가 일치하지 않습니다.'})

  try {
    const checkUsers = await User.findOne({nickname})
    if(checkUsers) return res.status(400).json({message : '이미 사용 중인 아이디입니다.'})

    await User.create({nickname, password, confirm})
    return res.status(201).json({message : '회원가입이 완료되었습니다.'})
  } catch (err) {
    return res.status(500).json({message : err})
  }
})

// 로그인
router.post('/login', async (req, res) => {
  const {nickname, password} = req.body

  if(!nickname || !password) return res.status(400).json({message : '아이디 또는 비밀번호를 입력해주세요.'})

  try {
    const user = await User.findOne({nickname})

    if(!user || password !== user.password) return res.status(400).json({message : '아이디 또는 비밀번호가 일치하지 않습니다.'})

    const accessToken = jwt.sign({userId : user._id}, 'my-secret-key', {expiresIn : '1d'})
    res.cookie('accessToken', accessToken)

    res.status(200).json({message : '로그인에 성공하였습니다.'})
  } catch (err) {
    return res.status(500).json({message : err})
  }
})

// 로그인 체크
router.get('/login/check', authMiddleware, async (req, res) => [
  
])


module.exports = router
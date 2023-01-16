const express = require('express')
const router = express.Router()

const Message = require('../schemas/message.js')
const authMiddleware = require('../middlewares/auth-middleware.js')

// 메세지 보내기
router.post('/message', authMiddleware, async (req, res) => {
  const {chatroomId, content} = req.body

  if(!chatroomId || !content) return res.status(400).json({message : '값을 입력해주세요'})

  try {
    await Message.create({chatroomId, userId : res.locals.user._id, content})
    res.status(200).json({message : '메세지를 성공적으로 보냈습니다.'})
  } catch (err) {
    return res.status(500).json({message : err})
  }
})

module.exports = router
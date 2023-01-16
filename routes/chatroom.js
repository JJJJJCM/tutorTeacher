const express = require('express')
const router = express.Router()
const { ObjectId } = require('mongoose').Types

const Chatroom = require('../schemas/chatroom.js')
const authMiddleware = require('../middlewares/auth-middleware.js')

// 채팅방 정보 저장
router.post('/chatroom', authMiddleware, async (req, res) => {
  const {writer} = req.body
  const data = { member : [ObjectId(writer), res.locals.user._id], title : '무슨무슨채팅방' }

  try {
    await Chatroom.create(data)
    res.status(200).json({message : '채팅방에 정보를 보냈습니다.'})
  } catch (err) {
    return res.status(500).json({message : err})
  }
})

// 내가 속한 채팅방 불러오기
router.get('/chatroom', authMiddleware, async (req, res) => {
  try {
    const chat = await Chatroom.find({member : res.locals.user._id})
    res.status(200).json({chatroomData : chat})
  } catch (err) {
    console.log(err)
    return res.status(500).json({message : err})
  }
})

module.exports = router
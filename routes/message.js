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
    res.status(200)
  } catch (err) {
    return res.status(500).json({message : err})
  }
})

// SSE (Server Sent Event)
router.get('/message/:chatroomId', authMiddleware, async (req, res) => {
  const {chatroomId} = req.params

  try {
    res.writeHead(200, {
      "Connection": "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    });
    const message = await Message.find({chatroomId})
    res.write('event: test\n'); // 보낼 데이터 이름
    res.write(`data: ${JSON.stringify(message)}\n\n`);  // 보낼 데이터

    Message.watch().on('change', (result) => {
      let changeDocument = [result.fullDocument]
      res.write('event: test\n')
      res.write(`data: ${JSON.stringify(changeDocument)}\n\n`)
    })
  } catch {
    return res.status(500).json({message : err})
  }
});

module.exports = router
const express = require('express')
const router = express.Router()

const Post = require('../schemas/post.js')
const authMiddleware = require('../middlewares/auth-middleware.js')


// 게시물 작성
router.post('/post', authMiddleware, async (req, res) => {
  const {title, date} = req.body

  if(!title || !date) return res.status(400).json({message : '값을 입력하세요'})

  try {
    await Post.create({title, date, writer : res.locals.user._id})
    res.status(200).json({message : '성공적으로 스케줄이 등록되었습니다.'})
  } catch (err) {
    return res.status(500).json({message : err})
  }
})

// 전체 게시물 조회
router.get('/post', async (req, res) => {
  try {
    const posts = await Post.find().sort({time : -1})
    return res.status(200).json({posts : posts})
  } catch (err) {
    return res.status(500).json({message : err})
  }
})

// 게시물 상세 조회 - detail.ejs
router.get('/post/:postId', async (req, res) => {
  const {postId} = req.params

  try {
    const post = await Post.findById(postId)
    return res.status(200).json({post})
  } catch (err) {
    return res.status(500).json({message : err})
  }
})

// 게시글 삭제
router.delete('/post/:postId', authMiddleware, async (req, res) => {
  const {postId} = req.params

  try {
    const post = await Post.findById(postId)

    // 둘 다 객체타입이기 때문 ( 메모리 주소 안에 저장된 순수한 값만 가져와서 비교 )
    if(!post.writer.equals(res.locals.user._id)) return res.status(400).json({message : '다른 사용자의 게시글은 삭제할 수 없습니다.'})

    if(post) {
      await Post.deleteOne({_id : postId})
      return res.status(200).json({message : '게시글을 삭제하였습니다.'})
    }
  } catch (err) {
    return res.status(500).json({message : err})
  }
})

// 게시글 수정
router.put('/post/:postId', authMiddleware, async (req, res) => {
  const {postId} = req.params
  const {title, date} = req.body

  if(!title || !date) return res.status(400).json({message : '값을 입력하세요'})

  try {
    const post = await Post.findById(postId)
    console.log(post)

    if(!post.writer.equals(res.locals.user._id)) return res.status(400).json({message : '다른 사용자의 게시글은 수정할 수 없습니다.'})

    if(post) {
      await Post.updateOne({_id : postId}, {$set : {title, date}})
      return res.status(200).json({message : '게시글을 수정하였습니다.'})
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({message : err})
  }
})

module.exports = router
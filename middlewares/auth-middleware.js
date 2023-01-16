const jwt = require('jsonwebtoken')
const User = require('../schemas/user.js')

module.exports = async (req, res, next) => {
  const accessToken = req.cookies.accessToken
  
  if(!accessToken) return res.status(400).json({message : '로그인 후 이용 가능한 API입니다.'})

  try {
    const {userId} = jwt.verify(accessToken, 'my-secret-key')
    
    const user = await User.findById(userId)
    
    res.locals.user = user
    next()
  } catch (err) {
    res.clearCookie('accessToken')
    return res.status(500).json({message : err})
  }
}
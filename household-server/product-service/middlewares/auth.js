const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/config')

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'Token is missing' })
  } else {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user_id = decoded.id
    next()
  }
}

module.exports = verifyToken

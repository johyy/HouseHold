const express = require('express')
const router = express.Router()
const { postgresPool } = require('../config/databases')
const User = require('../models/user')
const verifyToken = require('../middlewares/auth')
const { hashPassword} = require('../services/passwordService')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/config')

router.get('/', async (req, res) => {
  try {
    const result = await postgresPool.query('SELECT * FROM users')
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching users from PostgreSQL:', error.message)
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
    try {
      const { name, username, password } = req.body

      const passwordHash = await hashPassword(password)
    
      const user = new User({ name, username, password: passwordHash })
      await user.save()
  
      const token = jwt.sign({ id: user.id }, JWT_SECRET)

      res.status(201).json({ user, token })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  router.put('/:id', verifyToken, async (req, res) => {
    try {
      const { id } = req.params
      const updates = { ...req.body }

      if (updates.password) {
          updates.password = await hashPassword(updates.password)
      }
  
      const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true })
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' })
      }
  
      res.json(updatedUser)
    } catch (error) {
      console.error('Error updating user:', error.message)
      res.status(500).json({ error: error.message })
    }
  })


router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    const deletedUser = await User.findByIdAndDelete(id)
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(deletedUser)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router

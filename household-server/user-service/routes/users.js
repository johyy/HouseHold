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

/* FOR TESTING PURPOSES / POSTING DIRECTLY TO POSTGRES
router.post('/', async (req, res) => {
    try {
      const { name, username, password } = req.body

      const existingUser = await postgresPool.query('SELECT * FROM users WHERE username = $1', [username])
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Username is already taken' })
      }

      const passwordHash = await hashPassword(password)

      const result = await postgresPool.query(
        'INSERT INTO users (name, username, password) VALUES ($1, $2, $3) RETURNING id',
        [name, username, passwordHash]
      )

      const userId = result.rows[0].id
      const token = jwt.sign({ id: userId }, JWT_SECRET)

      res.status(201).json({ user: { id: userId, name, username }, token })
    } catch (error) {
      console.error('Error creating user in PostgreSQL:', error.message)
      res.status(500).json({ error: error.message })
    }
})*/

router.post('/', async (req, res) => {
    try {
      const { name, username, password } = req.body

      const existingUser = await User.findOne({ username })
      if (existingUser) {
        return res.status(400).json({ error: 'Username is already taken' })
      }

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

router.get('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user_id
    const query = `SELECT id, name, username FROM users WHERE id = $1`
    const values = [userId]
    const result = await postgresPool.query(query, values)
    
    res.json(result.rows[0])
  } catch (error) {
      res.status(500).json({ error: error.message })
  }
})

module.exports = router

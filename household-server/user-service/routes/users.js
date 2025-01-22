const express = require('express')
const router = express.Router()
const { mongoose, postgresPool } = require('../config/databases')
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  username: String,
  password: String,
}))

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
      const user = new User({ name, username, password })
      await user.save()
      res.status(201).json(user)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true })
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


router.delete('/:id', async (req, res) => {
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

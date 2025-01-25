const express = require('express')
const router = express.Router()
const { postgresPool } = require('../config/databases')
const Location = require('../models/location')
const verifyToken = require('../middlewares/auth')

router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user_id
    const query = `SELECT * FROM locations WHERE owner_id IS NULL OR owner_id = $1`
    const values = [userId]
    const result = await postgresPool.query(query, values)
    
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching locations from PostgreSQL:', error.message)
    res.status(500).json({ error: error.message })
  }
})

router.post('/', verifyToken, async (req, res) => {
    const { name, description } = req.body

    try {
        const location  = new Location({
            name,
            description,
            owner_id: req.user_id,
        })
        await location.save()
        res.status(201).json(location)
    } catch (error) {
        console.error('Error creating location in MongoDB:', error.message)
        res.status(500).json({ error: error.message })
    }
})

router.put('/:id', verifyToken, async (req, res) => {
    const locationId = req.params.id
    const userId = req.user_id
    const { name, description } = req.body
  
    try {
      const location = await Location.findOne({ _id: locationId, owner_id: userId })
      if (!location) {
        return res.status(403).json({ error: 'Unauthorized: You do not own this location.' })
      }
  
      location.name = name || location.name
      location.description = description || location.description
      await location.save()
  
      console.log('Updated location:', location)
      res.status(200).json(location)
    } catch (error) {
      console.error('Error updating location in MongoDB:', error.message)
      res.status(500).json({ error: error.message })
    }
})

router.delete('/:id', verifyToken, async (req, res) => {
    const locationId = req.params.id
    const userId = req.user_id
  
    try {
      const location = await Location.findOne({ _id: locationId, owner_id: userId })
      if (!location) {
        return res.status(403).json({ error: 'Unauthorized: You do not own this location.' })
      }
  
      await Location.deleteOne({ _id: locationId })
      res.json({ message: 'Location deleted successfully.' })
    } catch (error) {
      console.error('Error deleting location in MongoDB:', error.message)
      res.status(500).json({ error: error.message })
    }
})

module.exports = router

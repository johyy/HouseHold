const express = require('express')
const verifyToken = require('../middlewares/auth')
const UserPreference = require('../models/userPreference')
const { postgresPool } = require('../config/databases')

const router = express.Router()

router.get('/', verifyToken, async (req, res) => {
    try {
        const result = await postgresPool.query(
            'SELECT * FROM user_preferences WHERE user_id = $1',
            [req.user_id]
        ) 

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Preferences not found.' })
        }
        
        res.json(result.rows)
    } catch (error) {
        console.error('Error fetching user preferences from PostgreSQL:', error.message)
        res.status(500).json({ error: error.message })
    }
})

router.post('/', verifyToken, async (req, res) => {
    const { clothing_sizes, cosmetic_preferences, notes } = req.body

    try {
        const preferences  = new UserPreference({
            user_id: req.user_id,
            clothing_sizes,
            cosmetic_preferences,
            notes
        })

        await preferences.save()
        res.status(201).json(preferences)
    } catch (error) {
        console.error('Error creating user preferences in MongoDB:', error.message)
        res.status(500).json({ error: error.message })
    }
})

router.put('/', verifyToken, async (req, res) => {
    const { clothing_sizes, cosmetic_preferences, notes } = req.body

    try {
        const preferences = await UserPreference.findOneAndUpdate(
            { user_id: req.user_id }, 
            { clothing_sizes, cosmetic_preferences, notes }, 
            { new: true }
        )

        if (!preferences) {
            return res.status(404).json({ error: 'Preferences not found.' })
        }

        console.log('Updated preferences:', preferences)
        res.status(200).json(preferences)
    } catch (error) {
        console.error('Error updating user preferences:', error.message)
        res.status(500).json({ error: error.message })
    }
})

router.delete('/', verifyToken, async (req, res) => {
    try {
        const preferences = await UserPreference.findOneAndDelete({ user_id: req.user_id })

        if (!preferences) {
            return res.status(404).json({ error: 'Preferences not found.' })
        }

        res.status(200).json({ message: 'Preferences deleted successfully.', preferences })
    } catch (error) {
        console.error('Error deleting user preferences:', error.message)
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
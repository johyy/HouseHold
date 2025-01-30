const express = require('express')
const router = express.Router()
const { postgresPool } = require('../config/databases')
const TestProduct = require('../models/testProduct')

router.get('/', async (req, res) => {
  try {
    const query = `SELECT * FROM testProducts`
    const result = await postgresPool.query(query)
    
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching test products from PostgreSQL:', error.message)
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
    const { name, description, user_id, location_id, category_id, expiration_date, quantity, unit } = req.body

    try {
        const product = new TestProduct({
            name,
            description,
            user_id,
            location_id,
            category_id,
            expiration_date,
            quantity,
            unit
        })

        await product.save()
        res.status(201).json(product)
    } catch (error) {
        console.error('Error creating test product in MongoDB:', error.message)
        res.status(500).json({ error: error.message })
    }
})

module.exports = router

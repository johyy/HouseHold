const express = require('express')
const router = express.Router()
const { postgresPool } = require('../config/databases')
const Product = require('../models/product')
const Location = require('../models/location')
const Category = require('../models/category')
const verifyToken = require('../middlewares/auth')

router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user_id
    const query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.quantity,
        p.unit,
        p.expiration_date,
        l.name AS location,
        c.name AS category
      FROM products p
      LEFT JOIN locations l ON p.location_id = l.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.user_id = $1
    `;
    const values = [userId]
    const result = await postgresPool.query(query, values)
    
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching products from PostgreSQL:', error.message)
    res.status(500).json({ error: error.message })
  }
})

router.post('/', verifyToken, async (req, res) => {
    const { name, description, location_id, category_id, expiration_date, quantity, unit } = req.body
  
    try {
        const location = await Location.findById(location_id)
        const category = await Category.findById(category_id)
  
        if (!location) {
            return res.status(400).json({ error: 'Invalid location_id: Location not found.' })
        }
  
        if (!category) {
            return res.status(400).json({ error: 'Invalid category_id: Category not found.' })
        }
  
        const product = new Product({
            name,
            description,
            user_id: req.user_id,
            location_id,
            category_id,
            expiration_date,
            quantity,
            unit,
        })
  
        await product.save()
        res.status(201).json(product)
    } catch (error) {
        console.error('Error creating product in MongoDB:', error.message)
        res.status(500).json({ error: error.message })
    }
})

router.put('/:id', verifyToken, async (req, res) => {
    const productId = req.params.id
    const { name, description, location_id, category_id, expiration_date, quantity, unit } = req.body
  
    try {
        const product = await Product.findById(productId)
        if (!product) {
          return res.status(404).json({ error: 'Product not found.' })
        }
  
      if (location_id) {
        const location = await Location.findById(location_id)
        if (!location) {
          return res.status(400).json({ error: 'Invalid location_id: Location not found.' })
        }
        product.location_id = location_id
      }
  
      if (category_id) {
        const category = await Category.findById(category_id)
        if (!category) {
          return res.status(400).json({ error: 'Invalid category_id: Category not found.' })
        }
        product.category_id = category_id
      }
  
      if (name) product.name = name
      if (description) product.description = description
      if (expiration_date) product.expiration_date = expiration_date
      if (quantity !== undefined) product.quantity = quantity
      if (unit) product.unit = unit
  
      await product.save()
      res.json({ message: 'Product updated successfully.', product })
    } catch (error) {
      console.error('Error updating product in MongoDB:', error.message)
      res.status(500).json({ error: error.message })
    }
})

router.delete('/:id', verifyToken, async (req, res) => {
    const productId = req.params.id
  
    try {
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' })
        }
  
        await Product.deleteOne({ _id: productId })
        res.json({ message: 'Product deleted successfully.' })
    } catch (error) {
        console.error('Error deleting product in MongoDB:', error.message)
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
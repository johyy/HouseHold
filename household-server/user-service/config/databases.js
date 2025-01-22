const mongoose = require('mongoose')
const { Pool } = require('pg')
const config = require('./config')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
  })

const postgresPool = new Pool({
  connectionString: config.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
})

postgresPool.query('SELECT NOW()')
  .then(res => console.log('Connected to PostgreSQL:', res.rows[0]))
  .catch(err => console.error('Error connecting to PostgreSQL:', err.message))

module.exports = { mongoose, postgresPool }
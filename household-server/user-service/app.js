const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { Pool } = require('pg')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
  })


const postgresPool = new Pool({
  connectionString: config.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

postgresPool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.message)
  } else {
    console.log('Connected to PostgreSQL:', res.rows[0])
  }
})

app.use(cors())
app.use(express.json())

app.get('/mongodb', (req, res) => {
    const state = mongoose.connection.readyState;
    const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
    res.json({
      status: states[state],
      message: state === 1 ? 'MongoDB is connected' : 'MongoDB is not connected',
    })
  })

  app.get('/postgres', async (req, res) => {
    try {
      const result = await postgresPool.query('SELECT 1');
      res.json({
        status: 'Connected',
        message: 'PostgreSQL is connected',
        result: result.rows,
      });
    } catch (error) {
      console.error('Error connecting to PostgreSQL:', error.message);
      res.status(500).json({
        status: 'Disconnected',
        message: 'PostgreSQL is not connected',
        error: error.message,
      })
    }
  })
  

module.exports = app

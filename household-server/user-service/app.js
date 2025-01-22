const express = require('express')
const cors = require('cors')
const changeStream = require('./services/changeStream')

const healthRoutes = require('./routes/health')
const userRoutes = require('./routes/users')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/health', healthRoutes)
app.use('/users', userRoutes)

changeStream()

module.exports = app
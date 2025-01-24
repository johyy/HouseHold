const express = require('express')
const cors = require('cors')
const changeStream = require('./services/changeStream')

const healthRoutes = require('./routes/health')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/health', healthRoutes)

changeStream()

module.exports = app
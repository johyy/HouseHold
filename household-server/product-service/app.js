const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require ('mongoose')

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Product service works')
})

module.exports = app
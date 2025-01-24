const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    owner_id: { 
        type: String, 
        required: true
    },
})

const Location = mongoose.model('Location', locationSchema)

module.exports = Location
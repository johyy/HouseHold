const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    owner_id: {
        type: String,
        required: true,
    },
})

const Category = mongoose.model("Category", categorySchema)

module.exports = Category

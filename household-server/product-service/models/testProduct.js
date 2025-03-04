const mongoose = require("mongoose")

const testProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    user_id: String,
})

const TestProduct = mongoose.model(
    "TestProduct",
    testProductSchema,
    "testProducts",
)

module.exports = TestProduct

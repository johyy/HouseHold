const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: String,
        user_id: {
            type: String,
            required: true,
        },
        location_id: {
            type: String,
            default: null,
        },
        category_id: {
            type: String,
            required: true,
        },
        expiration_date: Date,
        quantity: Number,
        unit: String,
    },
    { timestamps: true },
)

const Product = mongoose.model("Product", productSchema)

module.exports = Product

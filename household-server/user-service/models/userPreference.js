const mongoose = require("mongoose")

const userPreferenceSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
    },
    clothing_sizes: String,
    cosmetic_preferences: String,
    notes: String,
})

const UserPreference = mongoose.model(
    "UserPreference",
    userPreferenceSchema,
    "user_preferences",
)

module.exports = UserPreference

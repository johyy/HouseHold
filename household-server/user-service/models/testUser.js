const mongoose = require("mongoose")

const testUserSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
    },
    password: String,
})

const TestUser = mongoose.model("TestUser", testUserSchema, "testUsers")

module.exports = TestUser

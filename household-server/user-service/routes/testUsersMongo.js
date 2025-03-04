const express = require("express")
const router = express.Router()
const TestUser = require("../models/testUser")

router.get("/", async (req, res) => {
    try {
        const users = await TestUser.find({})
        res.json(users)
    } catch (error) {
        console.error("Error fetching test users from MongoDB:", error.message)
        res.status(500).json({ error: error.message })
    }
})

router.post("/", async (req, res) => {
    try {
        const { name, username, password } = req.body

        const user = new TestUser({ name, username, password })
        await user.save()

        res.status(201).json(user)
    } catch (error) {
        console.error("Error creating test user in MongoDB:", error.message)
        res.status(500).json({ error: error.message })
    }
})

module.exports = router

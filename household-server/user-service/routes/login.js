const express = require("express")
const jwt = require("jsonwebtoken")
const { getUserByUsername } = require("../services/userService")
const { JWT_SECRET } = require("../config/config")
const { verifyPassword } = require("../services/passwordService")

const router = express.Router()

router.post("/", async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res
            .status(400)
            .json({ error: "Username and password are required." })
    }
    try {
        const user = await getUserByUsername(username)

        if (!user) {
            return res.status(404).json({ error: "User not found." })
        }

        const isPasswordValid = await verifyPassword(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password." })
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET)

        return res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
            },
        })
    } catch (error) {
        console.error("Login error:", error)
        return res.status(500).json({ error: "Internal server error." })
    }
})

module.exports = router

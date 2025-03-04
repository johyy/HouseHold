const express = require("express")
const router = express.Router()
const { postgresPool } = require("../config/databases")

router.get("/", async (req, res) => {
    try {
        const result = await postgresPool.query("SELECT * FROM testUsers")
        res.json(result.rows)
    } catch (error) {
        console.error(
            "Error fetching test users from PostgreSQL:",
            error.message,
        )
        res.status(500).json({ error: error.message })
    }
})

router.post("/", async (req, res) => {
    try {
        const { name, username, password } = req.body

        const result = await postgresPool.query(
            "INSERT INTO testUsers (name, username, password) VALUES ($1, $2, $3) RETURNING *",
            [name, username, password],
        )

        const user = result.rows[0]
        res.status(201).json(user)
    } catch (error) {
        console.error("Error creating test user in PostgreSQL:", error.message)
        res.status(500).json({ error: error.message })
    }
})

module.exports = router

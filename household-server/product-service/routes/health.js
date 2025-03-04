const express = require("express")
const router = express.Router()
const { mongoose, postgresPool } = require("../config/databases")

router.get("/mongodb", (req, res) => {
    const state = mongoose.connection.readyState
    const states = ["Disconnected", "Connected", "Connecting", "Disconnecting"]
    res.json({
        status: states[state], 
        message:
            state === 1 ? "MongoDB is connected" : "MongoDB is not connected",
    })
})

router.get("/postgres", async (req, res) => {
    try {
        const result = await postgresPool.query("SELECT 1")
        res.json({
            status: "Connected",
            message: "PostgreSQL is connected",
            result: result.rows,
        })
    } catch (error) {
        console.error("Error connecting to PostgreSQL:", error.message)
        res.status(500).json({ status: "Disconnected", message: error.message })
    }
})

module.exports = router

const mongoose = require("mongoose")
const { Pool } = require("pg")
const config = require("./config")
const logger = require("../utils/logger")

mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        logger.info("Connected to MongoDB")
    })
    .catch((error) => {
        logger.error("Error connecting to MongoDB:", error.message)
    })

const postgresPool = new Pool({
    connectionString: config.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
})

postgresPool
    .query("SELECT NOW()")
    .then((res) => logger.info("Connected to PostgreSQL:", res.rows[0]))
    .catch((err) =>
        logger.error("Error connecting to PostgreSQL:", err.message),
    )

module.exports = { mongoose, postgresPool }

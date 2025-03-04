const { postgresPool } = require("../config/databases")
const logger = require("../utils/logger")

const syncChangesToPostgres = async (change) => {
    try {
        const { operationType, fullDocument, documentKey, updateDescription } =
            change
        logger.info("Received change:", change)

        if (change.ns.coll === "user_preferences") {
            if (operationType === "insert") {
                const {
                    _id,
                    user_id,
                    clothing_sizes,
                    cosmetic_preferences,
                    notes,
                } = fullDocument
                await postgresPool.query(
                    "INSERT INTO user_preferences (id, user_id, clothing_sizes, cosmetic_preferences, notes) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING",
                    [
                        _id.toString(),
                        user_id,
                        clothing_sizes,
                        cosmetic_preferences,
                        notes,
                    ],
                )
                logger.info(
                    "Inserted user preferences into PostgreSQL:",
                    fullDocument,
                )
            } else if (operationType === "update") {
                const { updatedFields } = updateDescription
                const id = documentKey._id.toString()

                const updates = []
                const values = []
                let index = 1

                for (const [key, value] of Object.entries(updatedFields)) {
                    updates.push(`${key} = $${index}`)
                    values.push(value)
                    index++
                }

                if (updates.length > 0) {
                    values.push(id)
                    const query = `UPDATE user_preferences SET ${updates.join(", ")} WHERE id = $${index}`
                    await postgresPool.query(query, values)
                    logger.info(
                        "Updated user preferences in PostgreSQL:",
                        updatedFields,
                    )
                } else {
                    logger.info("Update skipped: No fields to update.")
                }
            } else if (operationType === "delete") {
                const id = documentKey._id.toString()
                await postgresPool.query(
                    "DELETE FROM user_preferences WHERE id = $1",
                    [id],
                )
                logger.info("Deleted user preferences from PostgreSQL:", id)
            }
        }

        if (change.ns.coll === "users") {
            if (operationType === "insert") {
                const { _id, name, username, password } = fullDocument
                await postgresPool.query(
                    "INSERT INTO users (id, name, username, password) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING",
                    [_id.toString(), name, username, password],
                )
                logger.info("Inserted new user into PostgreSQL:", fullDocument)
            } else if (operationType === "update") {
                const { updatedFields } = updateDescription
                const id = documentKey._id.toString()

                const updates = []
                const values = []
                let index = 1

                for (const [key, value] of Object.entries(updatedFields)) {
                    updates.push(`${key} = $${index}`)
                    values.push(value)
                    index++
                }

                if (updates.length > 0) {
                    values.push(id)
                    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = $${index}`
                    await postgresPool.query(query, values)
                    logger.info("Updated user in PostgreSQL:", updatedFields)
                } else {
                    logger.info("Update skipped: No fields to update.")
                }
            } else if (operationType === "delete") {
                const id = documentKey._id.toString()
                await postgresPool.query("DELETE FROM users WHERE id = $1", [
                    id,
                ])
                logger.info("Deleted user from PostgreSQL:", id)
            }
        }
    } catch (error) {
        logger.error("Error syncing change to PostgreSQL:", error.message)
    }
}

module.exports = syncChangesToPostgres

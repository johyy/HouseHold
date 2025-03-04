const { postgresPool } = require("../config/databases")
const logger = require("../utils/logger")

const syncChangesToPostgres = async (change) => {
    try {
        const { operationType, fullDocument, documentKey, updateDescription } =
            change
        logger.info("Received change:", change)

        if (change.ns.coll === "categories") {
            if (operationType === "insert") {
                const { _id, name, description, owner_id } = fullDocument
                await postgresPool.query(
                    "INSERT INTO categories (id, name, description, owner_id) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING",
                    [_id.toString(), name, description, owner_id],
                )
                logger.info("Inserted category into PostgreSQL:", fullDocument)
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
                    const query = `UPDATE categories SET ${updates.join(", ")} WHERE id = $${index}`
                    await postgresPool.query(query, values)
                    logger.info(
                        "Updated category in PostgreSQL:",
                        updatedFields,
                    )
                } else {
                    logger.info("Update skipped: No fields to update.")
                }
            } else if (operationType === "delete") {
                const id = documentKey._id.toString()
                await postgresPool.query(
                    "DELETE FROM categories WHERE id = $1",
                    [id],
                )
                logger.info("Deleted category from PostgreSQL:", id)
            }
        }

        if (change.ns.coll === "locations") {
            if (operationType === "insert") {
                const { _id, name, description, owner_id } = fullDocument
                await postgresPool.query(
                    "INSERT INTO locations (id, name, description, owner_id) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING",
                    [_id.toString(), name, description, owner_id],
                )
                logger.info("Inserted location into PostgreSQL:", fullDocument)
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
                    const query = `UPDATE locations SET ${updates.join(", ")} WHERE id = $${index}`
                    await postgresPool.query(query, values)
                    logger.info(
                        "Updated location in PostgreSQL:",
                        updatedFields,
                    )
                } else {
                    logger.info("Update skipped: No fields to update.")
                }
            } else if (operationType === "delete") {
                const id = documentKey._id.toString()
                await postgresPool.query(
                    "DELETE FROM locations WHERE id = $1",
                    [id],
                )
                logger.info("Deleted location from PostgreSQL:", id)
            }
        }

        if (change.ns.coll === "products") {
            if (operationType === "insert") {
                const {
                    _id,
                    name,
                    description,
                    user_id,
                    location_id,
                    category_id,
                    expiration_date,
                    quantity,
                    unit,
                    createdAt,
                    updatedAt,
                } = fullDocument
                await postgresPool.query(
                    `INSERT INTO products (id, name, description, user_id, location_id, category_id, expiration_date, quantity, unit, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             ON CONFLICT (id) DO NOTHING`,
                    [
                        _id.toString(),
                        name,
                        description,
                        user_id,
                        location_id,
                        category_id,
                        expiration_date,
                        quantity,
                        unit,
                        createdAt,
                        updatedAt,
                    ],
                )
                logger.info("Inserted product into PostgreSQL:", fullDocument)
            } else if (operationType === "update") {
                const { updatedFields } = updateDescription
                const id = documentKey._id.toString()

                const updates = []
                const values = []
                let index = 1

                const fieldMap = {
                    updatedAt: "updated_at",
                }

                for (const [key, value] of Object.entries(updatedFields)) {
                    const columnName = fieldMap[key] || key
                    updates.push(`${columnName} = $${index}`)
                    values.push(value)
                    index++
                }

                if (!updatedFields.updatedAt) {
                    updates.push(`updated_at = $${index}`)
                    values.push(new Date().toISOString())
                    index++
                }

                if (updates.length > 0) {
                    values.push(id)
                    const query = `UPDATE products SET ${updates.join(", ")} WHERE id = $${index}`
                    await postgresPool.query(query, values)
                    logger.info("Updated product in PostgreSQL:", updatedFields)
                } else {
                    logger.info("Update skipped: No fields to update.")
                }
            } else if (operationType === "delete") {
                const id = documentKey._id.toString()
                await postgresPool.query("DELETE FROM products WHERE id = $1", [
                    id,
                ])
                logger.info("Deleted product from PostgreSQL:", id)
            }
        }

        if (change.ns.coll === "testProducts") {
            if (operationType === "insert") {
                const { _id, name, description, user_id } = fullDocument
                await postgresPool.query(
                    `INSERT INTO testProducts (id, name, description, user_id)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (id) DO NOTHING`,
                    [_id.toString(), name, description, user_id],
                )
                logger.info(
                    "Inserted test product into PostgreSQL:",
                    fullDocument,
                )
            }
        }
    } catch (error) {
        logger.error("Error syncing change to PostgreSQL:", error.message)
    }
}

module.exports = syncChangesToPostgres

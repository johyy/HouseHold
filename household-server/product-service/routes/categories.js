const express = require("express")
const router = express.Router()
const { postgresPool } = require("../config/databases")
const Category = require("../models/category")
const verifyToken = require("../middlewares/auth")
const logger = require("../utils/logger")

router.get("/", verifyToken, async (req, res) => {
    try {
        const userId = req.user_id
        const query = `SELECT * FROM categories WHERE owner_id IS NULL OR owner_id = $1`
        const values = [userId]
        const result = await postgresPool.query(query, values)

        res.json(result.rows)
    } catch (error) {
        logger.error(
            "Error fetching categories from PostgreSQL:",
            error.message,
        )
        res.status(500).json({ error: error.message })
    }
})

router.post("/", verifyToken, async (req, res) => {
    const { name, description } = req.body

    try {
        const category = new Category({
            name,
            description,
            owner_id: req.user_id,
        })
        await category.save()
        res.status(201).json(category)
    } catch (error) {
        logger.error("Error creating category in MongoDB:", error.message)
        res.status(500).json({ error: error.message })
    }
})

router.put("/:id", verifyToken, async (req, res) => {
    const categoryId = req.params.id
    const userId = req.user_id
    const { name, description } = req.body

    try {
        const category = await Category.findOne({
            _id: categoryId,
            owner_id: userId,
        })
        if (!category) {
            return res
                .status(403)
                .json({ error: "Unauthorized: You do not own this category." })
        }

        category.name = name || category.name
        category.description = description || category.description
        await category.save()

        logger.info("Updated category:", category)
        res.status(200).json(category)
    } catch (error) {
        logger.error("Error updating category in MongoDB:", error.message)
        res.status(500).json({ error: error.message })
    }
})

router.delete("/:id", verifyToken, async (req, res) => {
    const categoryId = req.params.id
    const userId = req.user_id

    try {
        const category = await Category.findOne({
            _id: categoryId,
            owner_id: userId,
        })
        if (!category) {
            return res
                .status(403)
                .json({ error: "Unauthorized: You do not own this category." })
        }

        await Category.deleteOne({ _id: categoryId })
        res.json({ message: "Category deleted successfully." })
    } catch (error) {
        logger.error("Error deleting category in MongoDB:", error.message)
        res.status(500).json({ error: error.message })
    }
})

module.exports = router

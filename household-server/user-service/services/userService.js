const User = require("../models/user")
const logger = require("../utils/logger")

const getUserByUsername = async (username) => {
    try {
        const user = await User.findOne({ username })
        return user
    } catch (error) {
        logger.error("Error fetching user by username:", error)
        throw error
    }
}

module.exports = { getUserByUsername }

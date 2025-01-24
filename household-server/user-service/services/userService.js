const User = require('../models/user')

const getUserByUsername = async (username) => {
    try {
        const user = await User.findOne({ username })
        return user
    } catch (error) {
        console.error('Error fetching user by username:', error)
        throw error
    }
}

module.exports = { getUserByUsername }

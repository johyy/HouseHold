const User = require('../models/user')
// const { postgresPool } = require('../config/databases')

const getUserByUsername = async (username) => {
    try {
        const user = await User.findOne({ username })
        return user
    } catch (error) {
        console.error('Error fetching user by username:', error)
        throw error
    }
} 

/* FOR TESTING PURPOSES / USING ONLY POSTGRES AS A DATABASE
const getUserByUsername = async (username) => {
    try {
        const result = await postgresPool.query('SELECT * FROM users WHERE username = $1', [username])
        return result.rows[0]
    } catch (error) {
        console.error('Error fetching user from PostgreSQL:', error)
        throw error
    }
}*/

module.exports = { getUserByUsername }

require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const POSTGRES_URL = process.env.POSTGRES_URL

module.exports = {
  MONGODB_URI,
  POSTGRES_URL,
  PORT
}
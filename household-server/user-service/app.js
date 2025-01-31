const express = require('express')
const cors = require('cors')
const changeStream = require('./services/changeStream')

const healthRoutes = require('./routes/health')
const userRoutes = require('./routes/users')
const loginRoutes = require('./routes/login')
const userPreferencesRoutes = require('./routes/userPreferences')
const testUsersMongoRoutes = require('./routes/testUsersMongo')
const testUsersPostgresRoutes = require('./routes/testUsersPostgres')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/health', healthRoutes)
app.use('/users', userRoutes)
app.use('/login', loginRoutes)
app.use('/preferences', userPreferencesRoutes)
app.use('/testusers/mongo', testUsersMongoRoutes)
app.use('/testusers/postgres', testUsersPostgresRoutes)

changeStream()

module.exports = app
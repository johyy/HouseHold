const express = require('express')
const cors = require('cors')
const changeStream = require('./services/changeStream')

const healthRoutes = require('./routes/health')
const locationRoutes = require('./routes/locations')
const categoryRoutes = require('./routes/categories')
const productRoutes = require('./routes/products')
const testProductRoutes = require('./routes/testProducts')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/health', healthRoutes)
app.use('/locations', locationRoutes)
app.use('/categories', categoryRoutes)
app.use('/products', productRoutes)
app.use('/testproducts', testProductRoutes)

changeStream()

module.exports = app
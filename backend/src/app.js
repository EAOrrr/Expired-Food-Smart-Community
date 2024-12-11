const express = require('express')
const cors = require('cors')
// require('express-async-errors')
const app = express()

const middleware = require('./utils/middleware')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const productRouter = require('./controllers/products')
const cartRouter = require('./controllers/carts')
const orderRouter = require('./controllers/orders')

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/orders', orderRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app
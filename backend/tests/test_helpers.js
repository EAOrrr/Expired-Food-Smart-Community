const { 
  User,
  Product,
  IdempotencyKey,
  Cart,
  Order,
  Review,
} = require('../src/models')

const initialProducts = [
  {
    name: 'product1',
    price: 100,
    description: 'description1',
    stock: 10,
  },
  {
    name: 'product2',
    price: 200,
    description: 'description2',
    stock: 20,
  },
  {
    name: 'product3',
    price: 300,
    description: 'description3',
    stock: 30,
  },
  {
    name: 'product4',
    price: 400,
    description: 'description4',
    stock: 40,
  }
]

const usersInDb = async () => {
  const users = await User.findAll()
  return users.map(u => u.toJSON())
}

const productsInDb = async () => {
  const products = await Product.findAll()
  return products.map(p => p.toJSON())
}

const idempotencyKeysInDb = async () => {
  const idempotencyKeys = await IdempotencyKey.findAll()
  return idempotencyKeys.map(k => k.toJSON())
}

const cartsInDb = async () => {
  const carts = await Cart.findAll()
  return carts.map(c => c.toJSON())
}

const ordersInDb = async () => {
  const orders = await Order.findAll()
  return orders.map(o => o.toJSON())
}


const reviewsInDb = async () => {
  const reviews = await Review.findAll()
  return reviews.map(r => r.toJSON())
}

const getToken = async (api, user) => {
  const response = await api
    .post('/api/login')
    .send({ username: user.username, password: user.password })
    .expect(200)
    .expect('Content-Type', /application\/json/)
  return response.body.token
}


module.exports = {
  initialProducts,
  usersInDb,
  productsInDb,
  idempotencyKeysInDb,
  reviewsInDb,
  ordersInDb,
  cartsInDb,
  getToken,
}
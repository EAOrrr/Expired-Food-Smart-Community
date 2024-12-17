const { 
  User,
  Product,
  IdempotencyKey,
  Cart,
  Order,
  Review,
  Image,
  Bill,
  Message,
} = require('../src/models')

const initialProducts = [
  {
    name: 'product1',
    price: 100,
    description: 'description1',
    stock: 10,
    status: 'active'
  },
  {
    name: 'product2',
    price: 200,
    description: 'description2',
    stock: 20,
    status: 'active'
  },
  {
    name: 'product3',
    price: 300,
    description: 'description3',
    stock: 30,
    status: 'active'
  },
  {
    name: 'product4',
    price: 400,
    description: 'description4',
    stock: 40,
    status: 'active'
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

const billsInDb = async () => {
  const bills = await Bill.findAll()
  return bills.map(b => b.toJSON())
}

const messagesInDb = async () => {
  const messages = await Message.findAll()
  return messages.map(m => m.toJSON())
}

const getToken = async (api, user) => {
  const response = await api
    .post('/api/login')
    .send({ username: user.username, password: user.password })
    .expect(200)
    .expect('Content-Type', /application\/json/)
  return response.body.token
}

const clearDatabase = async () => {
  await Message.destroy({ where: {} })
  await Bill.destroy({ where: {} })
  await Image.destroy({ where: {} })
  await Cart.destroy({ where: {} })
  await Review.destroy({ where: {} })
  await Order.destroy({ where: {} })
  await IdempotencyKey.destroy({ where: {} })
  await Product.destroy({ where: {} })
  await User.destroy({ where: {} })
}


module.exports = {
  initialProducts,
  usersInDb,
  productsInDb,
  idempotencyKeysInDb,
  reviewsInDb,
  ordersInDb,
  cartsInDb,
  messagesInDb,
  getToken,
  clearDatabase,
  billsInDb,
}
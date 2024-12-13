const users = require('./users')
const products = require('./products')

const data = [
  {
    orderId: '3c42081a-b705-4e46-91f6-872f7bd75886',
    productId: products[0].productId,
    quantity: 2,
    total: 20.00,
    price: 10.00,
    sellerId: users[0].userId,
    buyerId: users[1].userId,
    status: 'Pending'
  },
  {
    orderId: '09697fbf-35bc-4e53-a079-d3017c15489c',
    productId: products[1].productId,
    quantity: 3,
    total: 60.00,
    price: 20.00,
    sellerId: users[0].userId,
    buyerId: users[2].userId,
    status: 'delivered'
  },
  {
    orderId: 'db173a30-291d-4e25-9b9d-366ba81ac95b',
    productId: products[2].productId,
    quantity: 4,
    total: 120.00,
    price: 30.00,
    sellerId: users[1].userId,
    buyerId: users[0].userId,
    status: 'Pending'
  }
]

module.exports = data
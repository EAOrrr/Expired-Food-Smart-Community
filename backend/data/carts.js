const products = require('./products')
const users = require('./users')

const data = [
  {
    cartId: '3c42081a-b705-4e46-91f6-872f7bd75886',
    userId: users[1].userId,
    productId: products[0].productId,
    quantity: 2,
    addedAt: '2024-01-01',
  },
  {
    cartId: '09697fbf-35bc-4e53-a079-d3017c15489c',
    userId: users[2].userId,
    productId: products[1].productId,
    quantity: 3,
    addedAt: '2024-02-02',
  },
  {
    cartId: 'db173a30-291d-4e25-9b9d-366ba81ac95b',
    userId: users[0].userId,
    productId: products[2].productId,
    quantity: 4,
    addedAt: '2024-03-03',
  }
]

module.exports = data
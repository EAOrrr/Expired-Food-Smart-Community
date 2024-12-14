const users = require('./users')

const data = [
  {
    productId: '379b266f-085d-4a3c-86ff-f98e59e1dfca',
    name: 'apple',
    price: 10.00,
    description: 'This is an apple',
    stock: 10,
    expiryDate: '2023-01-01',
    sellerId: users[0].userId,
  },
  {
    productId: '69d8979b-5282-41b9-9033-5707a3c51c45',
    name: 'fish',
    price: 20.00,
    description: 'This is a fish',
    stock: 20,
    expiryDate: '2023-02-02',
    sellerId: users[0].userId
  },
  {
    productId: 'f566acdd-f54c-47c2-bb03-f36bb8114263',
    name: 'chip',
    price: 30.00,
    description: 'This is a chip',  
    stock: 30,
    expiryDate: '2023-03-03',
    sellerId: users[1].userId
  }
]

module.exports = data

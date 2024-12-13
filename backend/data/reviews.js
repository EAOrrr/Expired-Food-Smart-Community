const orders = require('./orders')
const users = require('./users')

const data = [
  {
    reviewId: '1718c98f-5ada-4f79-8faa-a4ded9a0c6cc',
    content: 'nice buyer',
    rating: 4,
    reviewerId: users[0].userId,
    reviewedId: users[2].userId, 
    type: 'sellerToBuyer',
    orderId: orders[1].orderId
  },
  {
    reviewId: '394885a0-1fcf-43dd-ae7a-634b72ad6397',
    content: 'good seller',
    rating: 5,
    reviewerId: users[2].userId,
    reviewedId: users[0].userId,
    type: 'buyerToSeller',
    orderId: orders[1].orderId
  },
]

module.exports = data
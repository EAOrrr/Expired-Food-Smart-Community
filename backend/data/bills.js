const users = require('./users')
const orders = require('./orders')
const { or } = require('sequelize')

const data = [
  {
    billId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    userId: users[0].userId,
    amount: 20.0,
    operation: 'deposit',
  },
  {
    billId: '724dd07b-ba0e-4995-976e-82357a15393a',
    userId: users[1].userId,
    amount: 10.0,
    operation: 'deposit',
  },
  {
    billId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    userId: users[1].userId,
    amount: -20.0,
    operation: 'payment',
    orderId: orders[0].orderId,
  },
  {
    billId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    userId: users[0].userId,
    amount: 60.0,
    operation: 'income',
    orderId: orders[1].orderId,
  },
  {
    billId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    userId: users[2].userId,
    amount: -60.0,
    operation: 'payment',
    orderId: orders[1].orderId,
  },
  {
    billId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    userId: users[0].userId,
    amount: 120.0,
    operation: 'refund',
    orderId: orders[2].orderId,
  },
  {
    billId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
    userId: users[1].userId,
    amount: -120.0,
    operation: 'payment',
    orderId: orders[2].orderId,
  },
]

module.exports = data
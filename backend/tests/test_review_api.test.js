const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helpers')
const app = require('../src/app')
const supertest = require('supertest')
const api = supertest(app)
const { User, Product, Review, Order } = require('../src/models')
const { connectToDatabase, sequelize } = require('../src/utils/db')

const user0 = {
  username: 'testuser0',
  password: 'password',
  phone: '1234560',
  address: 'testaddress',
}

const user1 = {
  username: 'testuser1',
  password: 'password',
  phone: '1234561',
  address: 'testaddress',
}

let user0Id, user1Id
let user0Token, user1Token

beforeEach(async () => {
  await connectToDatabase()
  await helper.clearDatabase()
  const response = await api
    .post('/api/users')
    .send(user0)
    .expect(201)
  user0Id = response.body.userId
  const response1 = await api
    .post('/api/users')
    .send(user1)
    .expect(201)
  user1Id = response1.body.userId

  user0Token = await helper.getToken(api, user0)
  user1Token = await helper.getToken(api, user1)

  await Product.bulkCreate(helper.initialProducts
    .map(p => ({ ...p, sellerId: user0Id }))
  )

  const products = await helper.productsInDb()
  await Order.bulkCreate(products.map(p => ({
    productId: p.id, 
    SellerId: user0Id, 
    BuyerId: user1Id, 
    quantity: 3, 
    price: p.price, 
    total: 3 * p.price, 
    status: 'Delivered'
  })))

  const orders = await helper.ordersInDb()
  console.log('orders', orders)

})

describe('create a review', () => {
  test('create a review', async () => {
    const orders = await helper.ordersInDb()
    const reviewsAtStart = await helper.reviewsInDb()
    const order = orders[0]
    const review = {
      content: 'good product',
      rating: 5,
      orderId: order.orderId
    }
    const response = await api
      .post('/api/reviews')
      .send(review)
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const reviewsAtEnd = await helper.reviewsInDb()
    assert.strictEqual(reviewsAtEnd.length, reviewsAtStart.length + 1)
    assert.strictEqual(response.body.content, review.content)
    assert.strictEqual(response.body.rating, review.rating)
    assert.strictEqual(response.body.orderId, review.orderId)
    assert.strictEqual(response.body.reviewerId, user1Id)
    assert.strictEqual(response.body.reviewedId, user0Id)
    assert.strictEqual(response.body.type, 'buyerToSeller')

  })
})


after(async () => {
  await helper.clearDatabase()
  await sequelize.close()
})
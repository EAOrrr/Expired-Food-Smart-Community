const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helpers')
const app = require('../src/app')
const supertest = require('supertest')
const api = supertest(app)
const { User, Product, Cart } = require('../src/models')
const { connectToDatabase, sequelize } = require('../src/utils/db')

const user = {
  username: 'testuser',
  password: 'password',
  phone: '123456',
  address: 'testaddress'
}

let userId

beforeEach(async () => {
  await connectToDatabase()
  await Cart.destroy({ where: {}})
  await Product.destroy({ where: {}})
  await User.destroy({ where: {}})
  const response = await api
    .post('/api/users')
    .send(user)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  userId = response.body.userId
  console.log(response.body)
  await Product.bulkCreate(helper.initialProducts
    .map(p => ({ ...p, sellerId: userId })))
})

describe('test cart api', () => {
  let token
  beforeEach(async () => {
    token = await helper.getToken(api, user)
    const products = (await helper.productsInDb()).slice(0, 2)
    console.log(products)
    await Cart.bulkCreate(products.map(p => ({ 
      productId: p.productId, 
      userId, 
      quantity: 2 })))
  })

  test('get carts', async () => {
    const response = await api
      .get('/api/carts/me')
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    console.log(response.body)
    assert.strictEqual(response.body.length, 2)
  })

  test('add product to cart', async () => {
    const product = (await helper.productsInDb())[2]
    const cartsAtStart = await helper.cartsInDb()
    const response = await api
      .post(`/api/carts/${product.productId}`)
      .send({ quantity: 3 })
      .set('Authorization', `bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    console.log(response.body)
    assert.strictEqual(response.body.productId, product.productId)
    assert.strictEqual(response.body.userId, userId)
    assert.strictEqual(response.body.quantity, 3)
    const cartsAtEnd = await helper.cartsInDb()
    assert.strictEqual(cartsAtEnd.length, cartsAtStart.length + 1)
  })

  test('add existing product to cart', async () => {
    const product = (await helper.productsInDb())[0]
    const cartsAtStart = await helper.cartsInDb()
    const response = await api
      .post(`/api/carts/${product.productId}`)
      .send({ quantity: 3 })
      .set('Authorization', `bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    console.log(response.body)
    assert.strictEqual(response.body.error, 'product already in cart')
    const cartsAtEnd = await helper.cartsInDb()
    assert.strictEqual(cartsAtEnd.length, cartsAtStart.length)
  })

  test('update cart', async () => {
    const product = (await helper.productsInDb())[0]
    const cartsAtStart = await helper.cartsInDb()
    const cartToUpdate = cartsAtStart.find(c => c.productId === product.productId)

    const response = await api
      .put(`/api/carts/${product.productId}`)
      .send({ quantity: 1 })
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    console.log(response.body)
    assert.strictEqual(response.body.quantity, 1)
  })

  test('delete cart', async () => {
    const product = (await helper.productsInDb())[0]
    const cartsAtStart = await helper.cartsInDb()
    const cartToDelete = cartsAtStart.find(c => c.productId === product.productId)

    await api
      .delete(`/api/carts/${product.productId}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)
    
    const cartsAtEnd = await helper.cartsInDb()
    assert.strictEqual(cartsAtEnd.length, cartsAtStart.length - 1)
  })
})

after(() => {
  sequelize.close()
})
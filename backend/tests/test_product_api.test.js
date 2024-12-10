const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helpers')
const app = require('../src/app')
const supertest = require('supertest')
const api = supertest(app)
const { User, Product } = require('../src/models')
const { connectToDatabase, sequelize } = require('../src/utils/db')

const user = {
  username: 'testuser',
  password: 'password',
  phone: '123456',
  address: 'testaddress'
}
beforeEach(async () => {
  await connectToDatabase()
  await Product.destroy({ where: {}})
  await User.destroy({ where: {}})
  await api
    .post('/api/users')
    .send(user)
    .expect(201)
    .expect('Content-Type', /application\/json/)
})

describe('test product api', () => {
  let token
  let productId
  const product0 = {
    name: 'testproduct0',
    price: 100,
    description: 'testdescription',
    stock: 10
  }

  beforeEach(async () => {
    token = await helper.getToken(api, user)
    const response = await api
      .post('/api/products')
      .send(product0)
      .set('Authorization', `bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    productId = response.body.productId
  })

  test('create a product', async () => {
    const productsAtStart = await helper.productsInDb()
    const product = {
      name: 'testproduct1',
      price: 100,
      description: 'testdescription',
      stock: 10
    }
    const response = await api
      .post('/api/products')
      .send(product)
      .set('Authorization', `bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const productsAtEnd = await helper.productsInDb()
    assert.strictEqual(productsAtEnd.length, productsAtStart.length + 1)
  })

  test('update a product', async () => {
    const product = {
      name: 'testproduct3234',
      price: 100,
      description: 'testdescription',
      stock: 10
    }
    await api
      .put(`/api/products/${productId}`)
      .send(product)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
    const updatedProduct = await Product.findByPk(productId)
    assert(updatedProduct.name === product.name)
  })

  test('delete a product', async () => {
    const productsAtStart = await helper.productsInDb()
    await api
      .delete(`/api/products/${productId}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)
    const productsAtEnd = await helper.productsInDb()
    assert.strictEqual(productsAtEnd.length, productsAtStart.length - 1)
  })

})

after(async () => {
  await Product.destroy({ where: {}})
  await User.destroy({ where: {}})
  await sequelize.close()
})
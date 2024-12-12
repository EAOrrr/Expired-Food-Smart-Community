const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helpers')
const app = require('../src/app')
const supertest = require('supertest')
const api = supertest(app)
const { User } = require('../src/models')
const { connectToDatabase, sequelize } = require('../src/utils/db')

beforeEach(async () => {
  await connectToDatabase()
  await User.destroy({ where: {}})
})

describe('create a user', () => {
  const user = {
    username: 'testuser',
    password: 'password',
    phone: '123456',
    address: 'testaddress'
  }

  test('create a user', async () => {
    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })
})

describe('login', () => {
  const user = {
    username: 'testuser',
    password: 'password',
    phone: '123456',
    address: 'testaddress'
  }
   test('login', async () => {
    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api
      .post('/api/login')
      .send({ username: user.username, password: user.password })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert(response.body.token)
    assert(response.body.username === user.username)
    assert(response.body.userId)
  })
})

describe('user info management', () => {
  const user = {
    username: 'testuser',
    password: 'password',
    phone: '123456',
    address: 'testaddress'
  }

  beforeEach(async () => {
    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('get user info', async () => {
    const token = await helper.getToken(api, user)
    const response = await api
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert(response.body.username === user.username)
    assert(response.body.phone === user.phone)
    assert(response.body.address === user.address)
  })

  test('update user info', async () => {
    const usersAtStart = await helper.usersInDb()
    const idempotencyKeysAtStart = await helper.idempotencyKeysInDb()
    const userBalance = usersAtStart.filter(u => u.username === user.username)[0].balance
    const token = await helper.getToken(api, user)
    const depositId = 'testdepositid'
    const response = await api
      .post('/api/users/me/deposit')
      .send({amount: 120, idempotencyKey: depositId})
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    console.log(response.body)
    assert.strictEqual(parseFloat(response.body.balance), 120 + parseFloat(userBalance))
    const usersAtEnd = await helper.usersInDb()
    const userBalanceAtEnd = usersAtEnd.filter(u => u.username === user.username)[0].balance
    assert.strictEqual(parseFloat(userBalanceAtEnd), 120 + parseFloat(userBalance))
    const idempotencyKeysAtEnd = await helper.idempotencyKeysInDb()
    assert.strictEqual(idempotencyKeysAtEnd.length, idempotencyKeysAtStart.length + 1)
    
  })

})

after(async () => {
  await User.destroy({ where: {}})
  await sequelize.close()
})

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
  await helper.clearDatabase()
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
    assert.strictEqual(parseFloat(response.body.balance), 120 + parseFloat(userBalance))
    const usersAtEnd = await helper.usersInDb()
    const userBalanceAtEnd = usersAtEnd.filter(u => u.username === user.username)[0].balance
    assert.strictEqual(parseFloat(userBalanceAtEnd), 120 + parseFloat(userBalance))
    const idempotencyKeysAtEnd = await helper.idempotencyKeysInDb()
    assert.strictEqual(idempotencyKeysAtEnd.length, idempotencyKeysAtStart.length + 1)
    
  })

})

describe('test user balance', () => {
  let userToken, userId
  const user = {
    username: 'testuser',
    password: 'password',
    phone: '123456',
    address: 'testaddress'
  }

  beforeEach(async () => {
    const response = await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    userId = response.body.userId
    userToken = await helper.getToken(api, user)
  })

  test('deposit', async () => {
    const usersAtStart = await helper.usersInDb()
    const userBalanceAtStart = usersAtStart.find(u => u.username === user.username).balance
    const billsAtStart = await helper.billsInDb()

    const idempotencyKey = 'testdepositid'
    const response = await api
      .post('/api/users/me/deposit')
      .send({ amount: 120, idempotencyKey })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(parseFloat(response.body.balance), 120 + parseFloat(userBalanceAtStart))

    const usersAtEnd = await helper.usersInDb()
    const userBalanceAtEnd = usersAtEnd.find(u => u.username === user.username).balance
    assert.strictEqual(parseFloat(userBalanceAtEnd), 120 + parseFloat(userBalanceAtStart))
    const billsAtEnd = await helper.billsInDb()
    assert.strictEqual(billsAtEnd.length, billsAtStart.length + 1)
    const depositBill = billsAtEnd.find(b => b.userId === userId && b.operation === 'deposit')
    assert(depositBill)
    assert.strictEqual(parseFloat(depositBill.amount), 120)
  })

  test('deposit too many requests', async () => {
    const usersAtStart = await helper.usersInDb()
    const userBalanceAtStart = usersAtStart.find(u => u.username === user.username).balance
    const idempotencyKey1 = 'testdepositid1vhj'
    const idempotencyKey2 = 'testdepositid2gyui'

    await api
      .post('/api/users/me/deposit')
      .send({ amount: 120, idempotencyKey: idempotencyKey1 })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const response = await api
      .post('/api/users/me/deposit')
      .send({ amount: 120, idempotencyKey: idempotencyKey2 })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(429)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.error, 'too many requests')
    const usersAtEnd = await helper.usersInDb()
    const userBalanceAtEnd = usersAtEnd.find(u => u.username === user.username).balance
    assert.strictEqual(parseFloat(userBalanceAtEnd), 120 + parseFloat(userBalanceAtStart))
  })

})

after(async () => {
  await helper.clearDatabase()
  await sequelize.close()
})

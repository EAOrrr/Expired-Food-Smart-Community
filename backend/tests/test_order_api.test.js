const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helpers')
const app = require('../src/app')
const supertest = require('supertest')
const api = supertest(app)
const { User, Product, Cart, Order, IdempotencyKey } = require('../src/models')
const { connectToDatabase, sequelize } = require('../src/utils/db')

const user = {
  username: 'testuser',
  password: 'password',
  phone: "1234561",
  address: "testaddress",
}

const user1 = {
  username: 'testuser1',
  password: 'password',
  phone: "1234562",
  address: "testaddress",
}

const user2 = {
  username: 'testuser2',
  password: 'password',
  phone: "1234563",
  address: "testaddress",
}

let userId, userId1, userId2
let userToken, userToken1, userToken2

beforeEach(async () => {
  await connectToDatabase()
  await IdempotencyKey.destroy({ where: {} })
  await Order.destroy({ where: {} })
  await Cart.destroy({ where: {} })
  await Product.destroy({ where: {} })
  await User.destroy({ where: {} })
  const response = await api
    .post('/api/users')
    .send(user)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  userId = response.body.userId

  const response1 = await api
    .post('/api/users')
    .send(user1)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  userId1 = response1.body.userId

  const response2 = await api
    .post('/api/users')
    .send(user2)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  userId2 = response2.body.userId

  await Product.bulkCreate(helper.initialProducts
    .map(p => ({ ...p, sellerId: userId1 })))
  userToken = await helper.getToken(api, user)
  userToken1 = await helper.getToken(api, user1)
  userToken2 = await helper.getToken(api, user2)

  await User.update({ balance: 1000 }, { where: { userId } })
})

describe.only('post /api/orders/product', () => {
  test('buy a product', async () => {
    const productsAtStart = await helper.productsInDb()
    const ordersAtStart = await helper.ordersInDb()
    const usersAtStart = await helper.usersInDb()

    const product = productsAtStart[0]
    const response = await api
      .post('/api/orders/product')
      .send({ productId: product.productId, quantity: 1, idempotencyKey: 'unique' })
      .set('Authorization', `bearer ${userToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.buyerId, userId)
    assert.strictEqual(response.body.total, product.price)
    assert.strictEqual(response.body.status, 'Pending')
    assert.strictEqual(response.body.sellerId, product.sellerId)
    assert.strictEqual(response.body.price, product.price)
    assert.strictEqual(response.body.quantity, 1)

    const productsAtEnd = await helper.productsInDb()
    const ordersAtEnd = await helper.ordersInDb()
    const usersAtEnd = await helper.usersInDb()

    const productAfterBuy = productsAtEnd.find(p => p.productId === product.productId)
    assert.strictEqual(productAfterBuy.stock, product.stock - 1)
    assert.strictEqual(productsAtEnd.length, productsAtStart.length)
    assert.strictEqual(ordersAtEnd.length, ordersAtStart.length + 1)
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    const userAfterBuy = usersAtEnd.find(u => u.userId === userId)
    assert.strictEqual(parseFloat(userAfterBuy.balance), parseFloat(usersAtStart.find(u => u.userId === userId).balance - product.price))
  })

  test('buy a product with insufficient stock', async () => {
    const productsAtStart = await helper.productsInDb()
    const ordersAtStart = await helper.ordersInDb()
    const usersAtStart = await helper.usersInDb()

    const product = productsAtStart[0]
    await api
      .post('/api/orders/product')
      .send({ productId: product.productId, quantity: product.stock + 1, idempotencyKey: 'unique' })
      .set('Authorization', `bearer ${userToken}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const productsAtEnd = await helper.productsInDb()
    const ordersAtEnd = await helper.ordersInDb()
    const usersAtEnd = await helper.usersInDb()

    assert(productsAtEnd.find(p => p.productId === product.productId).stock === product.stock)
    assert.strictEqual(productsAtEnd.length, productsAtStart.length)
    assert.strictEqual(ordersAtEnd.length, ordersAtStart.length)
    const userAfterBuy = usersAtEnd.find(u => u.userId === userId)
    assert.strictEqual(parseFloat(userAfterBuy.balance), parseFloat(usersAtStart.find(u => u.userId === userId).balance))
  })

  test('buy a non-existent product', async () => {
    await api
      .post('/api/orders/product')
      .send({ productId: 'nonexistent', quantity: 1 })
      .set('Authorization', `bearer ${userToken}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test.only('buy many products', async () => {
    const productsAtStart = await helper.productsInDb()
    const ordersAtStart = await helper.ordersInDb()
    const usersAtStart = await helper.usersInDb()

    const products = productsAtStart[0]

    const response = await api
      .post('/api/orders/product')
      .send({ productId: products.productId, quantity: 2, idempotencyKey: 'unique' })
      .set('Authorization', `bearer ${userToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(parseFloat(response.body.total), parseFloat(products.price * 2))
    assert.strictEqual(response.body.status, 'Pending')
    assert.strictEqual(response.body.sellerId, products.sellerId)
    assert.strictEqual(response.body.price, products.price)
    assert.strictEqual(response.body.quantity, 2)

    const productsAtEnd = await helper.productsInDb()
    const ordersAtEnd = await helper.ordersInDb()
    const usersAtEnd = await helper.usersInDb()

    const productAfterBuy = productsAtEnd.find(p => p.productId === products.productId)
    assert.strictEqual(productAfterBuy.stock, products.stock - 2)
    assert.strictEqual(productsAtEnd.length, productsAtStart.length)
    assert.strictEqual(ordersAtEnd.length, ordersAtStart.length + 1)
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    const userBeforeBuy = usersAtStart.find(u => u.userId === userId)
    const userAfterBuy = usersAtEnd.find(u => u.userId === userId)
    console.log(userBeforeBuy.balance, products.price * 2, userAfterBuy.balance)
    assert.strictEqual(parseFloat(userAfterBuy.balance), parseFloat(userBeforeBuy.balance) - products.price * 2)
  })
})

describe('post /api/orders/cart', () => {
  beforeEach(async () => {
    // prepare a cart
    const productsAtStart = await helper.productsInDb()
    await Cart.destroy({ where: {} })

    const productsToCart = productsAtStart.slice(0, 3)
    await Cart.bulkCreate(productsToCart.map(p => ({
      productId: p.productId,
      userId: userId,
      quantity: 3
    })))
    const carts = await helper.cartsInDb()
    assert.strictEqual(carts.length, 3)
  })

  test('checkout a cart', async () => {
    const cartsAtStart = await helper.cartsInDb()
    const productsAtStart = await helper.productsInDb()
    const ordersAtStart = await helper.ordersInDb()
    const usersAtStart = await helper.usersInDb()

    const cartToCheckout = cartsAtStart[0]
    const productId = cartToCheckout.productId

    const response = await api
      .post('/api/orders/cart')
      .send({ cartIds: [cartToCheckout.cartId], idempotencyKey: 'unique' })
      .set('Authorization', `bearer ${userToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.buyerId, userId)

    const cartsAtEnd = await helper.cartsInDb()
    const productsAtEnd = await helper.productsInDb()
    const ordersAtEnd = await helper.ordersInDb()
    const usersAtEnd = await helper.usersInDb()

    const productAfterBuy = productsAtEnd.find(p => p.productId === productId)
    assert.strictEqual(productAfterBuy.stock, productsAtStart[0].stock - 3)
    assert.strictEqual(cartsAtEnd.length, cartsAtStart.length - 1)
    assert.strictEqual(productsAtEnd.length, productsAtStart.length)
    assert.strictEqual(ordersAtEnd.length, ordersAtStart.length + 1)
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    
    const userAfterBuy = usersAtEnd.find(u => u.userId === userId)
    assert.strictEqual(parseFloat(userAfterBuy.balance), parseFloat(usersAtStart.find(u => u.userId === userId).balance - productsAtStart[0].price * 3))
  })

  test('checkout an empty cart', async () => {
    await api
      .post('/api/orders/cart')
      .send({ cartIds: [], idempotencyKey: 'unique' })
      .set('Authorization', `bearer ${userToken}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('checkout a non-existent cart and an existing cart', async () => {
    const cartsAtStart = await helper.cartsInDb()
    const cartToCheckout = cartsAtStart[0]
    await api
      .post('/api/orders/cart')
      .send({ cartIds: [cartToCheckout.cartId, 'nonexistent'], idempotencyKey: 'unique' })
      .set('Authorization', `bearer ${userToken}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  }),

  test('checkout many carts', async () => {
    const cartsAtStart = await helper.cartsInDb()
    const productsAtStart = await helper.productsInDb()
    const ordersAtStart = await helper.ordersInDb()
    const usersAtStart = await helper.usersInDb()

    const carts = cartsAtStart.slice(0, 2)
    const cartIds = carts.map(c => c.cartId)
    const totalPrice = carts.reduce((acc, c) => {
      const product = productsAtStart.find(p => p.productId === c.productId)
      return acc + product.price * c.quantity
    }, 0)

    const response = await api
      .post('/api/orders/cart')
      .send({ cartIds, idempotencyKey: 'unique' })
      .set('Authorization', `bearer ${userToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.totalPrice, totalPrice)

    const cartsAtEnd = await helper.cartsInDb()
    const productsAtEnd = await helper.productsInDb()
    const ordersAtEnd = await helper.ordersInDb()
    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(cartsAtEnd.length, cartsAtStart.length - 2)
    assert.strictEqual(productsAtEnd.length, productsAtStart.length)
    assert.strictEqual(ordersAtEnd.length, ordersAtStart.length + 2)

    productsBought = productsAtStart.filter(p => cartIds.includes(p.productId))
    const userAfterBuy = usersAtEnd.find(u => u.userId === userId)
    assert.strictEqual(parseFloat(userAfterBuy.balance), parseFloat(usersAtStart.find(u => u.userId === userId).balance - totalPrice))
    assert(productsBought.every(p => productsAtEnd.find(p1 => p1.productId === p.productId).stock === p.stock - 3))
  })

})

describe('put /api/orders', () => {
  let product0
  beforeEach(async () => {
    // create a pending order
    await Order.destroy({ where: {} })
    const products = await Product.findAll({ limit: 1 })
    product0 = products[0]
    await Order.create({
      buyerId: userId,
      sellerId: userId1,
      productId: product0.productId,
      total: product0.price * 2,
      price: product0.price,
      quantity: 2,
      status: 'Pending',
    })
  })

  test('cancel an order by buyer', async () => {
    const ordersAtStart = await helper.ordersInDb()
    const usersAtStart = await helper.usersInDb()
    const user = usersAtStart.find(u => u.userId === userId)
    const order = ordersAtStart[0]
    await api
      .put(`/api/orders/${order.orderId}`)
      .send({ status: 'Cancelled' })
      .set('Authorization', `bearer ${userToken}`)
      .expect(200)
    const ordersAtEnd = await helper.ordersInDb()
    assert.strictEqual(ordersAtEnd.length, ordersAtStart.length)
    const orderAfterCancel = ordersAtEnd.find(o => o.orderId === order.orderId)
    assert.strictEqual(orderAfterCancel.status, 'Cancelled')

    // check if the stock is restored
    const productsAtEnd = await helper.productsInDb()
    const productAfterCancel = productsAtEnd.find(p => p.productId === order.productId)
    assert.strictEqual(productAfterCancel.stock, product0.stock + 2)

    // check if the balance is restored
    const usersAtEnd = await helper.usersInDb()
    const userAfterCancel = usersAtEnd.find(u => u.userId === userId)
    assert.strictEqual(parseFloat(userAfterCancel.balance), parseFloat(user.balance) + product0.price * 2)

  })


  test('cancel an order by seller', async () => {
    const ordersAtStart = await helper.ordersInDb()
    const user = await User.findByPk(userId)
    const order = ordersAtStart[0]
    await api
      .put(`/api/orders/${order.orderId}`)
      .send({ status: 'Cancelled' })
      .set('Authorization', `bearer ${userToken1}`)
      .expect(200)
    const ordersAtEnd = await helper.ordersInDb()
    assert.strictEqual(ordersAtEnd.length, ordersAtStart.length)
    const orderAfterCancel = ordersAtEnd.find(o => o.orderId === order.orderId)
    assert.strictEqual(orderAfterCancel.status, 'Cancelled')

    // check if the stock is restored
    const productsAtEnd = await helper.productsInDb()
    const productAfterCancel = productsAtEnd.find(p => p.productId === order.productId)
    assert.strictEqual(productAfterCancel.stock, product0.stock + 2)

    // check if the balance is restored
    const usersAtEnd = await helper.usersInDb()
    const userAfterCancel = usersAtEnd.find(u => u.userId === userId)
    assert.strictEqual(parseFloat(userAfterCancel.balance), parseFloat(user.balance) + product0.price * 2)
  })

  test('cancel an order by unauthorized user', async () => {
    const ordersAtStart = await helper.ordersInDb()
    const order = ordersAtStart[0]
    await api
      .put(`/api/orders/${order.orderId}`)
      .send({ status: 'Cancelled' })
      .set('Authorization', `bearer ${userToken2}`)
      .expect(403)
  })

  test('transition order status from pending to delivering', async () => {
    const ordersAtStart = await helper.ordersInDb()
    await api
      .put(`/api/orders/${ordersAtStart[0].orderId}`)
      .send({ status: 'Delivering' })
      .set('Authorization', `bearer ${userToken1}`)
      .expect(200)
    const ordersAtEnd = await helper.ordersInDb()
    assert.strictEqual(ordersAtEnd.length, ordersAtStart.length)
    const orderAfterTransition = ordersAtEnd.find(o => o.orderId === ordersAtStart[0].orderId)
    assert.strictEqual(orderAfterTransition.status, 'Delivering')
  })

  describe('transition order status from delivering to delivered', () => {
    beforeEach(async () => {
      await Order.update({ status: 'Delivering' }, { where: {} })
    })

    test('transition order status from delivering to delivered by buyer', async () => {
      const ordersAtStart = await helper.ordersInDb()
      const usersAtStart = await helper.usersInDb()
      const user1AtStart = usersAtStart.find(u => u.userId === userId1)
      
      await api
        .put(`/api/orders/${ordersAtStart[0].orderId}`)
        .send({ status: 'Delivered' })
        .set('Authorization', `bearer ${userToken}`)
        .expect(200)
      const ordersAtEnd = await helper.ordersInDb()
      assert.strictEqual(ordersAtEnd.length, ordersAtStart.length)
      const orderAfterTransition = ordersAtEnd.find(o => o.orderId === ordersAtStart[0].orderId)
      assert.strictEqual(orderAfterTransition.status, 'Delivered')

      // check if the balance is updated
      const user1AtEnd = await helper.usersInDb()
      const user1AfterTransition = user1AtEnd.find(u => u.userId === userId1)
      assert.strictEqual(parseFloat(user1AfterTransition.balance), parseFloat(user1AtStart.balance) + parseFloat(orderAfterTransition.total))

    })

  }) 
})

after(async () => {
  await IdempotencyKey.destroy({ where: {} })
  await Order.destroy({ where: {} })
  await Cart.destroy({ where: {} })
  await Product.destroy({ where: {} })
  await User.destroy({ where: {} })
  await sequelize.close()
})

const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helpers')
const app = require('../src/app')
const supertest = require('supertest')
const api = supertest(app)
const { User, Product, Cart, Order, OrderProduct } = require('../src/models')
const { connectToDatabase, sequelize } = require('../src/utils/db')

const user = {
  username: 'testuser',
  password: 'password',
  phone: "123456",
  address: "testaddress",
}

let userId
let userToken

beforeEach(async () => {
  await connectToDatabase()
  await OrderProduct.destroy({ where: {} })
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
  await Product.bulkCreate(helper.initialProducts
    .map(p => ({ ...p, sellerId: userId })))
  userToken = await helper.getToken(api, user)
})

describe('post /api/orders/buy', () => {
  test('buy a product', async () => {
    const productsAtStart = await helper.productsInDb()
    const ordersAtStart = await helper.ordersInDb()
    const orderProductsAtStart = await helper.orderProductsInDb()

    const product = productsAtStart[0]
    console.log(product)
    const response = await api
      .post('/api/orders/buy')
      .send({ productId: product.productId, quantity: 1 })
      .set('Authorization', `bearer ${userToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    console.log(response.body)
    assert.strictEqual(response.body.buyerId, userId)
    assert.strictEqual(response.body.totalPrice, product.price)
    assert.strictEqual(response.body.status, 'Pending')

    const productsAtEnd = await helper.productsInDb()
    const ordersAtEnd = await helper.ordersInDb()
    const orderProductsAtEnd = await helper.orderProductsInDb()
    const productAfterBuy = productsAtEnd.find(p => p.productId === product.productId)
    assert.strictEqual(productAfterBuy.stock, product.stock - 1)

    assert.strictEqual(productsAtEnd.length, productsAtStart.length)
    assert.strictEqual(ordersAtEnd.length, ordersAtStart.length + 1)
    assert.strictEqual(orderProductsAtEnd.length, orderProductsAtStart.length + 1)
  })

  test('buy a product with insufficient stock', async () => {
    const productsAtStart = await helper.productsInDb()
    const product = productsAtStart[0]
    await api
      .post('/api/orders/buy')
      .send({ productId: product.productId, quantity: product.stock + 1 })
      .set('Authorization', `bearer ${userToken}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('buy a non-existent product', async () => {
    await api
      .post('/api/orders/buy')
      .send({ productId: 'nonexistent', quantity: 1 })
      .set('Authorization', `bearer ${userToken}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('buy many products', async () => {
    const productsAtStart = await helper.productsInDb()
    const ordersAtStart = await helper.ordersInDb()
    const orderProductsAtStart = await helper.orderProductsInDb()

    const products = productsAtStart[0]
    const response = await api
      .post('/api/orders/buy')
      .send({ productId: products.productId, quantity: 2 })
      .set('Authorization', `bearer ${userToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(parseFloat(response.body.totalPrice), products.price * 2)
    assert.strictEqual(response.body.status, 'Pending')
    
    const productsAtEnd = await helper.productsInDb()
    const ordersAtEnd = await helper.ordersInDb()
    const orderProductsAtEnd = await helper.orderProductsInDb()

    const productAfterBuy = productsAtEnd.find(p => p.productId === products.productId)
    assert.strictEqual(productAfterBuy.stock, products.stock - 2)
    assert.strictEqual(productsAtEnd.length, productsAtStart.length)
    assert.strictEqual(ordersAtEnd.length, ordersAtStart.length + 1)
    assert.strictEqual(orderProductsAtEnd.length, orderProductsAtStart.length + 1)
    const orderProduct = orderProductsAtEnd.find(op => op.orderId === response.body.orderId)
    assert.strictEqual(parseInt(orderProduct.quantity), 2)
    assert.strictEqual(parseFloat(orderProduct.subtotal), parseFloat(products.price * 2))
    assert.strictEqual(parseFloat(orderProduct.price), parseFloat(products.price))
  })

})

describe('post /api/orders/checkout', () => {
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
    const orderProductsAtStart = await helper.orderProductsInDb()

    const cartToCheckout = cartsAtStart[0]
    const productId = cartToCheckout.productId

    const response = await api
      .post('/api/orders/checkout')
      .send({ cartIds: [cartToCheckout.cartId] })
      .set('Authorization', `bearer ${userToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    assert.strictEqual(response.body.buyerId, userId)
    assert.strictEqual(response.body.totalPrice, productsAtStart[0].price * 3)
    assert.strictEqual(response.body.status, 'Pending')

    const cartsAtEnd = await helper.cartsInDb()
    const productsAtEnd = await helper.productsInDb()
    const ordersAtEnd = await helper.ordersInDb()
    const orderProductsAtEnd = await helper.orderProductsInDb()

    const productAfterBuy = productsAtEnd.find(p => p.productId === productId)
    assert.strictEqual(productAfterBuy.stock, productsAtStart[0].stock - 3)
    assert.strictEqual(cartsAtEnd.length, cartsAtStart.length - 1)
    assert.strictEqual(productsAtEnd.length, productsAtStart.length)
    assert.strictEqual(ordersAtEnd.length, ordersAtStart.length + 1)
    assert.strictEqual(orderProductsAtEnd.length, orderProductsAtStart.length + 1)

    const orderProduct = orderProductsAtEnd.find(op => op.orderId === response.body.orderId)
    assert.strictEqual(parseInt(orderProduct.quantity), 3)
    assert.strictEqual(parseFloat(orderProduct.subtotal), parseFloat(productsAtStart[0].price * 3))
    assert.strictEqual(parseFloat(orderProduct.price), parseFloat(productsAtStart[0].price))
  
  })

  test('checkout an empty cart', async () => {
    await Cart.destroy({ where: {} })
    await api
      .post('/api/orders/checkout')
      .send({ cartIds: [] })
      .set('Authorization', `bearer ${userToken}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('checkout a non-existent cart and an existing cart', async () => { 
    const cartsAtStart = await helper.cartsInDb()
    const cartToCheckout = cartsAtStart[0]
    await api
      .post('/api/orders/checkout')
      .send({ cartIds: [cartToCheckout.cartId, 'nonexistent']})
      .set('Authorization', `bearer ${userToken}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    })

  test('checkout many carts', async () => {
    const cartsAtStart = await helper.cartsInDb()
    const productsAtStart = await helper.productsInDb()
    const ordersAtStart = await helper.ordersInDb()
    const orderProductsAtStart = await helper.orderProductsInDb()

    const carts = cartsAtStart.slice(0, 2)
    const cartIds = carts.map(c => c.cartId)
    const totalPrice = carts.reduce((acc, c) => {
      const product = productsAtStart.find(p => p.productId === c.productId)
      return acc + product.price * c.quantity
    }, 0)
    const response = await api
      .post('/api/orders/checkout')
      .send({ cartIds })
      .set('Authorization', `bearer ${userToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.totalPrice, totalPrice)
    assert.strictEqual(response.body.status, 'Pending')

    const cartsAtEnd = await helper.cartsInDb()
    const productsAtEnd = await helper.productsInDb()
    const ordersAtEnd = await helper.ordersInDb()
    const orderProductsAtEnd = await helper.orderProductsInDb()

    assert.strictEqual(cartsAtEnd.length, cartsAtStart.length - 2)
    assert.strictEqual(productsAtEnd.length, productsAtStart.length)
    assert.strictEqual(ordersAtEnd.length, ordersAtStart.length + 1)
    assert.strictEqual(orderProductsAtEnd.length, orderProductsAtStart.length + 2)

    carts.forEach(c => {
      const productAfterBuy = productsAtEnd.find(p => p.productId === c.productId)
      assert.strictEqual(productAfterBuy.stock, productsAtStart.find(p => p.productId === c.productId).stock - c.quantity)
    })

  })

  test('checkout many carts with insufficient stock', async () => {
    const cartsAtStart = await helper.cartsInDb()
    const productsAtStart = await helper.productsInDb()
    const ordersAtStart = await helper.ordersInDb()
    const orderProductsAtStart = await helper.orderProductsInDb()

    const carts = cartsAtStart.slice(0, 2)
    const cartIds = carts.map(c => c.cartId)
    const product = productsAtStart.find(p => p.productId === carts[0].productId)
    await Product.update({ stock: 0 }, { where: { productId: product.productId } })
    await api
      .post('/api/orders/checkout')
      .send({ cartIds })
      .set('Authorization', `bearer ${userToken}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

after(async () => {
  await OrderProduct.destroy({ where: {} })
  await Order.destroy({ where: {} })
  await Cart.destroy({ where: {} })
  await Product.destroy({ where: {} })
  await User.destroy({ where: {} })
  await sequelize.close()
})

const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helpers')
const app = require('../src/app')
const supertest = require('supertest')
const api = supertest(app)
const { User, Product, Image } = require('../src/models')
const { connectToDatabase, sequelize } = require('../src/utils/db')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcrypt')

const user = {
  username: 'testuser',
  password: 'password',
  phone: '123456',
  address: 'testaddress'
}
beforeEach(async () => {
  await connectToDatabase()
  // await Product.destroy({ where: {}})
  // await User.destroy({ where: {}})
  await helper.clearDatabase()
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
    assert.strictEqual(response.body.name, product.name)
    assert.strictEqual(response.body.description, product.description)
    assert.strictEqual(response.body.stock, product.stock)
    assert.strictEqual(response.body.status, 'pending')

  })

  test('update a product', async () => {
    await Product.update({ status: 'active' }, { where: { productId: productId } })
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
    assert(updatedProduct.status === 'pending')
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

  test('create a product with images', async () => {
    const productsAtStart = await helper.productsInDb();
    const product = {
      name: 'testproductWithImages',
      price: 150,
      description: 'test description with images',
      stock: 5
    };


    const response = await api
      .post('/api/products')
      .set('Authorization', `bearer ${token}`)
      .field('name', product.name)
      .field('price', product.price)
      .field('description', product.description)
      .field('stock', product.stock)
      .attach('cover', path.resolve(__dirname, './assets/cover.png'))
      .attach('images', path.resolve(__dirname, './assets/img1.png'))
      .attach('images', path.resolve(__dirname, './assets/img2.png'))
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const productsAtEnd = await helper.productsInDb();
    assert.strictEqual(productsAtEnd.length, productsAtStart.length + 1);

    const createdProduct = await Product.findByPk(response.body.productId, {
      include: [
        { model: Image, as: 'Images' },
      ]
    });

    assert(createdProduct);
    assert.strictEqual(createdProduct.Images.length, 3);

    // 可以进一步检查图片数据是否存在
    assert(createdProduct.Images.every(image => image.data));
    const covers = createdProduct.Images.filter(image => image.isCover);
    assert.strictEqual(covers.length, 1);
  });

})


describe('test admin change product status', () => {
  let token
  let productId
  beforeEach(async () => {
    const normalUser = {
      username: 'normaluser',
      password: 'password',
      phone: '123',
      address: 'testaddress'
    }
    const adminUser = {
      username: 'adminuser',
      password: 'password',
      phone: '124',
      address: 'testaddress',
    }
    const product = {
      name: 'testproduct',
      price: 100,
      description: 'testdescription',
      stock: 10
    }
    const createdUser = await User.create({ ...normalUser, passwordHash: bcrypt.hashSync(normalUser.password, 10) })
    await User.create({ ...adminUser, passwordHash: bcrypt.hashSync(adminUser.password, 10), isAdmin: true })

    token = await helper.getToken(api, adminUser)
    const createdProduct = await Product.create({ ...product, sellerId: createdUser.userId })
    productId = createdProduct.productId
    assert.strictEqual(createdProduct.status, 'pending')
  })

  test.only('admin can change product status', async () => {
    const messsagesAtStart = await helper.messagesInDb()
    await api
      .put(`/api/products/${productId}/status`)
      .send({ status: 'active'})
      .set('Authorization', `bearer ${token}`)
      .expect(200)
    const updatedProduct = await Product.findByPk(productId)
    const messsagesAtEnd = await helper.messagesInDb()
    assert.strictEqual(updatedProduct.status, 'active')
    assert.strictEqual(messsagesAtStart.length + 1, messsagesAtEnd.length)
  })


})

after(async () => {
  await helper.clearDatabase()
  await sequelize.close()
})
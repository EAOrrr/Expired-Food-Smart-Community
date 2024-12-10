const { 
  User,
  Product,
} = require('../src/models')

const usersInDb = async () => {
  const users = await User.findAll()
  return users.map(u => u.toJSON())
}

const productsInDb = async () => {
  const products = await Product.findAll()
  return products.map(p => p.toJSON())
}

const getToken = async (api, user) => {
  const response = await api
    .post('/api/login')
    .send({ username: user.username, password: user.password })
    .expect(200)
    .expect('Content-Type', /application\/json/)
  return response.body.token
}


module.exports = {
  usersInDb,
  productsInDb,
  getToken,
}
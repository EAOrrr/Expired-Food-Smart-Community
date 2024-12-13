const { connectToDatabase, sequelize } = require('./db')

const {
  User,
  Product,
  Cart,
  Order,
  Review,
} = require('../models');

const users = require('../../data/users')
const products = require('../../data/products')
const carts = require('../../data/carts')
const orders = require('../../data/orders')
const reviews = require('../../data/reviews')

const bcrypt = require('bcrypt')


const initialize = async () => {
  await connectToDatabase()
  
  await Review.destroy({ where: {} });
  await Order.destroy({ where: {} });
  await Cart.destroy({ where: {} });
  await Product.destroy({ where: {} });
  await User.destroy({ where: {} });

  const saltRounds = 10

  const usersWithHashedPasswords = users.map(user => {
    const passwordHash = bcrypt.hashSync(user.password, saltRounds)
    return { ...user, passwordHash }
  })

  await User.bulkCreate(usersWithHashedPasswords);
  await Product.bulkCreate(products);
  await Cart.bulkCreate(carts);
  await Order.bulkCreate(orders);
  await Review.bulkCreate(reviews);

  sequelize.close()
}

initialize()

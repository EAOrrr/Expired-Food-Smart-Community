const { connectToDatabase, sequelize } = require('./db')

const {
  User,
  Product,
  Cart,
  Order,
  Review,
  Image,
} = require('../models');

const users = require('../../data/users')
const products = require('../../data/products')
const carts = require('../../data/carts')
const orders = require('../../data/orders')
const reviews = require('../../data/reviews')
const images = require('../../data/images')

const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')

const initialize = async () => {
  await connectToDatabase()
  
  await Image.destroy({ where: {} });
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
  await Image.bulkCreate(images
    .map(image => ({
      ...image,
      data: fs.readFileSync(image.data),  
    })
    )
  );
  await Cart.bulkCreate(carts);
  await Order.bulkCreate(orders);
  await Review.bulkCreate(reviews);

  sequelize.close()
}

initialize()
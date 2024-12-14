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
const { chipCover, appleCover, data: images } = require('../../data/images')

const bcrypt = require('bcrypt')
const fs = require('fs')

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

  await Image.bulkCreate(images.map(
    image => ({ ...image, data: fs.readFileSync(image.data) })
  ))

  const productsInDb = await Product.findAll()
  appleProduct = productsInDb.find(p => p.name === 'apple')
  chipProduct = productsInDb.find(p => p.name === 'chip')

  appleProduct.coverImageId = appleCover.imageId
  chipProduct.coverImageId = chipCover.imageId

  await appleProduct.save()
  await chipProduct.save()


  await Cart.bulkCreate(carts);
  await Order.bulkCreate(orders);
  await Review.bulkCreate(reviews);

  sequelize.close()
}

initialize()

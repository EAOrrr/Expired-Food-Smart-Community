const path = require('path')
const products = require('../products')

// const data = [chipCover, appleCover, ...apples]
const data = [
  {
    imageId: '91cec6d6-cf18-438b-9a2d-f52fba000f21',
    data: path.join(__dirname, 'chip/cover.png'),
    mimeType: 'image/png',
    productId: products[2].productId,
    isCover: true
  },
  {
    imageId: 'aaf27f22-41dc-4f43-acaa-ffa1d805cf8f',
    data: path.join(__dirname, 'apple/cover.png'),
    mimeType: 'image/png',
    productId: products[0].productId,
    isCover: true
  },
  {
    imageId: 'b3b9b3f4-5c7b-4a6e-8e7d-0f0d4f1c0b0e',
    data: path.join(__dirname, 'apple/image1.png'),
    mimeType: 'image/png',
    productId: products[0].productId
  },
  {
    imageId: 'e1e2a3f4-5c7b-4a6e-8e7d-0f0d4f1c0b0e',
    data: path.join(__dirname, 'apple/image2.png'),
    mimeType: 'image/png',
    productId: products[0].productId
  },
  {
    imageId: '8f1c4ee8-9b09-480e-93a8-8f8054b6ad18',
    data: path.join(__dirname, 'apple/image3.png'),
    mimeType: 'image/png',
    productId: products[0].productId
  }
]

module.exports = data
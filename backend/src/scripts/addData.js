const { Product, User, Cart } = require('../models')

const addData = async () => {
  try {
    // 创建用户
    const user = await User.create({
      username: 'testuser',
      passwordHash: 'hashedpassword',
      phone: '1234567890', // 添加 phone 字段
      address: '123 Main St' // 添加 address 字段
    })

    // 创建产品
    const product1 = await Product.create({
      name: '苹果',
      description: '新鲜的苹果',
      price: 5,
      stock: 100,
      expiryDate: new Date(),
      sellerId: user.id
    })

    const product2 = await Product.create({
      name: '香蕉',
      description: '新鲜的香蕉',
      price: 3,
      stock: 150,
      expiryDate: new Date(),
      sellerId: user.id
    })

    // 创建购物车
    await Cart.create({
      userId: user.id,
      productId: product1.id,
      quantity: 2
    })

    await Cart.create({
      userId: user.id,
      productId: product2.id,
      quantity: 3
    })

    console.log('数据插入成功')
  } catch (error) {
    console.error('数据插入失败:', error)
  }
}

addData()
const bcrypt = require('bcrypt')
const router = require('express').Router()
const { userExtractor, } = require('../utils/middleware')
const { User, IdempotencyKey, Order } = require('../models')
const { sequelize } = require('../utils/db')

router.post('/', async(req, res) => {
  const { password } = req.body
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: `User validation failed:
        Path password is shorter 
        than the minimum allowed length (6)` })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = await User.create({ ...req.body, passwordHash: passwordHash })
  const userForResponse = {
    username: user.username,
    userId: user.userId
  }
  res.status(201).json(userForResponse)
})

router.get('/me', userExtractor, async (req, res) => {
  const user = req.user
  const { review } = req.query
  if (review) {
    const order = [['createdAt', 'DESC'], ['reviewId', 'DESC']] 
    if (review === 'given') {
      user.reviews = {
        given: await user.getReviewsGiven({
          order: order
        })
      }
    }
    if (review === 'received') {
      user.reviews = {
        received: await user.getReviewsReceived({
          order: order
        })
      }
    }
    if (review === 'both') {
      user.reviews = {
        given: await user.getReviewsGiven({ order: order }),
        received: await user.getReviewsReceived({ order: order })
      }
    }
  }
  delete user.passwordHash
  res.status(200).json(user)
})

router.get('/:userid', userExtractor, async (req, res) => {
  const { userid } = req.params
  const requestedUser = await User.findByPk(userid, {
    attributes: { exclude: ['passwordHash', 'address', 'balance'] },
    include: [
      {
        model: 'review',
        as: 'ReviewsReceived',
        attributes: ['rating', 'content', 'reviewId', 'type'],
      }
    ]
  })
  if (!requestedUser) {
    return res.status(404).json({ error: 'User not found' })
  }
  res.status(200).json(requestedUser)
})

router.put('/me', userExtractor, async (req, res) => {
  const user = req.user
  const body = req.body
  const updatedUser = { ...body }

  if (body.password) {
    if (body.password.length < 6) {
      return res
        .status(400)
        .json({ error: `User validation failed:
          Path password is shorter 
          than the minimum allowed length (6)` })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    updatedUser.passwordHash = passwordHash
  }
  // 移除balance 
  delete updatedUser.balance
  await user.update(updatedUser)
  res.json(user)
})

router.post('/me/deposit', userExtractor, async (req, res) => {
  const user = req.user
  const { amount, idempotencyKey } = req.body
  if (isNaN(amount)) {
    return res.status(400).json({ error: 'amount must be a number' })
  }
  if (amount < 0) {
    return res.status(400).json({ error: 'amount must be positive' })
  }
  if (!idempotencyKey) {
    return res.status(400).json({ error: 'idempotency-key is required' })
  }
  console.log(idempotencyKey)
  // await sequelize.transaction(async (t) => {
    const t = await sequelize.transaction()
    try {
      const existingKey = await user.getIdempotencyKeys({
        where: { operation: 'deposit', key: idempotencyKey },
        transaction: t,
        lock: t.LOCK_UPDATE
      })
      if (existingKey.length > 0) {
        console.log('idempotency key exists')
        console.log('')
        await t.rollback()
        return res.status(429).json({ error: 'idempotency-key exists' })
      }
      if (user.lastDepositTime) {
        console.log('\n\n\n')
        console.log(new Date() - user.lastDepositTime)
        console.log('\n\n\n')
      }
      if (user.lastDepositTime && (new Date() - user.lastDepositTime) / 1000 < 15) {
        await t.rollback()
        return res.status(429).json({ error: 'too many requests' })
      }
      user.lastDepositTime = new Date()
      await user.save({ transaction : t })
      console.log(user.toJSON())
      // 增加用户余额
      await user.increment('balance', { by: amount, transaction: t })
      // 创建deposit账单
      await user.createBill({
        amount: amount,
        operation: 'deposit'
      }, { transaction: t })
      await user.createIdempotencyKey({
        key: idempotencyKey,
        operation: 'deposit',
        userId: user.userId
      }, { transaction: t })
      const updatedUser = await User.findByPk(user.userId, { transaction: t })
      await t.commit()
      res.status(200).json({ balance: updatedUser.balance })
    } catch (error) {
      if (!t.finished) await t.rollback()
      throw error
    }
})

router.get('/me/bills', userExtractor, async (req, res) => {
  const user = req.user
  // const bills = await user.getBills({
  //   order: [['createdAt', 'DESC']]
  // })
  const userWithBill = await User.findByPk(user.userId, {
    include: {
      model: Bill,
      as: 'Bills',
      order: [['createdAt', 'DESC']],
      required: false
    },
    attributes: { exclude: ['passwordHash'] }
  })
  res.status(200).json(userWithBill)
})

module.exports = router
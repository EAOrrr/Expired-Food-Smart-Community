const bcrypt = require('bcrypt')
const router = require('express').Router()
const { userExtractor, } = require('../utils/middleware')
const { User, IdempotencyKey } = require('../models')
const { sequelize } = require('../utils/db')

router.post('/', async(req, res) => {
  const { password, username } = req.body

  const userWithName = await User.findOne({
    where: {
      username: username
    }
  })
  if (userWithName) {
    return res.status(400).json({ error: 'username already exists' })
  }
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
    userId: user.id
  }
  res.status(201).json(userForResponse)
})

router.get('/me', userExtractor, async (req, res) => {
  const user = req.user
  res.status(200).json(user)
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
  // await sequelize.transaction(async (t) => {
    const t = await sequelize.transaction()
    console.log('here')
    try {
      const existingKey = await user.getIdempotencyKeys(idempotencyKey, {
        where: { operation: 'deposit' },
        transaction: t,
        lock: t.LOCK_UPDATE
      })
      if (existingKey.length > 0) {
        return res.status(200).json({ balance: user.balance })
      }
      console.log('herer2')
      await user.createIdempotencyKey({
        key: idempotencyKey,
        operation: 'deposit',
        userId: user.userId
      }, { transaction: t })
      await user.increment('balance', { by: amount, transaction: t })
      const updatedUser = await User.findByPk(user.userId, { transaction: t })
      await t.commit()
      console.log(updatedUser)
      res.status(200).json({ balance: updatedUser.balance })
    } catch (error) {
      if (!t.finished) await t.rollback()
      throw error
    }
})

module.exports = router
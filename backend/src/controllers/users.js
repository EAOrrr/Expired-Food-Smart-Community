const bcrypt = require('bcrypt')
const router = require('express').Router()
const { userExtractor, } = require('../utils/middleware')
const { User } = require('../models')

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

module.exports = router
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { ACCESS_TOKEN_SECRET } = require('../utils/config')
const { User } = require('../models')

router.post('/', async (req, res) => {
  const body = req.body
  const user = await User.findOne({
    where :{
      username: body.username
    }
  })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.userId
  }

  const token = jwt.sign(userForToken, ACCESS_TOKEN_SECRET)
  res.status(200).send({ token, username: user.username, userId: user.userId})

})

module.exports = router
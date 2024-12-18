const jwt = require('jsonwebtoken')
const logger = require('./logger')
const { User } = require('../models')
const { ACCESS_TOKEN_SECRET } = require('./config')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const errorHandler = (error, req, res, next) => {
  console.log('\n\n', 'ERRORRRRRRRRRRRRRRRRRRRRRRR!!!!')
  console.log('From errorHandler:', error.name, error.message)
  console.error('error', error.name, error.message)
  console.log('Stack:', error.stack)
  console.log('\n\n')
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    const errorMessage = error.errors
    .map(err => `${err.path} must be unique`)
    .join(', ') 
    return res.status(400).send({ error: errorMessage })
  } else if (error.name === 'SequelizeValidationError') {
    console.log('error')
    return res.status(400).send({ error: error.message })
  } else if (error.name === 'SequelizeDatabaseError') {
    console.log(error.message)
    return res.status(400).send({ error: error.message })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired'
    })
  } else {
    const statusCode = error.statusCode || 500
    res.status(statusCode).json({
      error: {
        message: error.message,
        status: statusCode
      }
    })
  }

  next()
}

const getTokenFrom = (req) => {
  const authorization = req.get('Authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const userExtractor = async (req, res, next) => {
  const token = getTokenFrom(req)

  if (!token) {
    return res.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findByPk(decodedToken.id)

  if (!user) {
    return res.status(401).json({ error: 'user not found' })
  }

  req.user = user

  next()
}

const userExtractorAllowingNull = async (req, res, next) => {
  const token = getTokenFrom(req)

  if (!token) {
    return next()
  }

  const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET)
  if (!decodedToken.id) {
    return next()
  }

  const user = await User.findByPk(decodedToken.id)

  if (!user) {
    return next()
  }

  req.user = user

  next()
}



const unknownEndpoint = (req, res) => {
  res.status(404).send('unknown endpoint')
}

module.exports = {
  requestLogger,
  errorHandler,
  userExtractor,
  userExtractorAllowingNull,
  unknownEndpoint
}

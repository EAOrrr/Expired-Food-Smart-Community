require('dotenv').config()
const DATABASE_URL = process.env.DATABASE_URL
const PORT = process.env.PORT
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
module.exports = {
  DATABASE_URL,
  PORT,
  ACCESS_TOKEN_SECRET
}
const logger = require('./utils/logger')
const app = require('./app')
const { connectToDatabase } = require('./utils/db')
const { PORT } = require('./utils/config')

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
  })
}

start()
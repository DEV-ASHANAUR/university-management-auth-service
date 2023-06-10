import mongoose from 'mongoose'
import config from './config/index'
import app from './app'
import { logger, errorlogger } from './shared/logger'

async function connectDB() {
  try {
    await mongoose.connect(config.database_url as string)
    logger.info(`Database is connected successfully!`)
    app.listen(config.port, () => {
      logger.info(`App Listening on port: ${config.port}`)
    })
  } catch (error) {
    errorlogger.error('Failed to connect database', error)
  }
}

connectDB()

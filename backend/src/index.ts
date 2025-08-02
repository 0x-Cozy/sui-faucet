import app from './app'
import { config } from './utils/config'
import logger from './services/logger'

const startServer = async (): Promise<void> => {
  try {
    const port = config.server.port
    
    app.listen(port, () => {
      console.log(`sui faucet backend running on port ${port} ${config.server.nodeEnv} ${config.sui.network} ${config.sui.rpcUrl}`)
      
      logger.info('server started', {
        port,
        environment: config.server.nodeEnv,
        network: config.sui.network
      })
    })
  } catch (error) {
    console.error('failed to start server:', error)
    logger.error('server startup failed', { error })
    process.exit(1)
  }
}

process.on('SIGTERM', () => {
  console.log('received sigterm, shutting down gracefully')
  logger.info('server shutting down')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('received sigint, shutting down gracefully')
  logger.info('server shutting down')
  process.exit(0)
})

// handle exceptions
process.on('uncaughtException', (error) => {
  console.error('uncaught exception:', error)
  logger.error('uncaught exception', { error })
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandled rejection at:', promise, 'reason:', reason)
  logger.error('unhandled rejection', { reason, promise })
  process.exit(1)
})

startServer() 
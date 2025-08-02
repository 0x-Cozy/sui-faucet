import winston from 'winston'
import { config } from '../utils/config'
import { LogEntry } from '../types'

const logger = winston.createLogger({
  level: config.server.nodeEnv === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

if (config.server.nodeEnv !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

export const logFaucetRequest = (entry: LogEntry): void => {
  logger.info('faucet request', {
    timestamp: entry.timestamp,
    ip: entry.ip,
    walletAddress: entry.walletAddress,
    action: entry.action,
    success: entry.success,
    error: entry.error,
    txHash: entry.txHash,
    amount: entry.amount
  })
}

export const logError = (error: Error, context?: any): void => {
  logger.error('error occurred', {
    message: error.message,
    stack: error.stack,
    context
  })
}

export const logRateLimit = (ip: string, walletAddress: string, blocked: boolean): void => {
  logger.warn('rate limit triggered', {
    ip,
    walletAddress,
    blocked,
    timestamp: new Date()
  })
}

export default logger 
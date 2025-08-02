import { Redis } from '@upstash/redis'
import { config } from '../utils/config'

const redis = new Redis({
  url: config.redis.url,
  token: config.redis.token,
})

export interface DiscordRateLimitInfo {
  remaining: number
  resetTime: number
  blocked: boolean
}

export const checkDiscordRateLimit = async (discordUserId: string, walletAddress: string): Promise<DiscordRateLimitInfo> => {
  try {
    const now = Date.now()
    const windowMs = config.rateLimit.windowMs
    const maxRequests = config.rateLimit.maxRequests
    const blockDurationMs = config.rateLimit.blockDurationMs

    // create unique keys for this user and wallet combination
    const requestKey = `discord:requests:${discordUserId}:${walletAddress}`
    const blockKey = `discord:blocked:${discordUserId}:${walletAddress}`

    // check if user is currently blocked
    const isBlocked = await redis.get(blockKey)
    if (isBlocked) {
      const blockExpiry = await redis.ttl(blockKey)
      return {
        remaining: 0,
        resetTime: now + (blockExpiry * 1000),
        blocked: true
      }
    }

    const requests = await redis.get(requestKey) || 0
    const requestCount = parseInt(requests.toString())

    if (requestCount >= maxRequests) {
      await redis.setex(blockKey, Math.floor(blockDurationMs / 1000), '1')
      
      return {
        remaining: 0,
        resetTime: now + blockDurationMs,
        blocked: true
      }
    }

    const remaining = Math.max(0, maxRequests - requestCount)
    const resetTime = now + windowMs

    return {
      remaining,
      resetTime,
      blocked: false
    }

  } catch (error) {
    console.error('Discord rate limit check failed:', error)
    return {
      remaining: 1,
      resetTime: Date.now() + config.rateLimit.windowMs,
      blocked: false
    }
  }
}

export const consumeDiscordRateLimit = async (discordUserId: string, walletAddress: string): Promise<void> => {
  try {
    const windowMs = config.rateLimit.windowMs
    const requestKey = `discord:requests:${discordUserId}:${walletAddress}`
    await redis.incr(requestKey)
    
    await redis.expire(requestKey, Math.floor(windowMs / 1000))

  } catch (error) {
    console.error('Discord rate limit consumption failed:', error)
  }
}

export const getDiscordRateLimitInfo = async (discordUserId: string, walletAddress: string): Promise<DiscordRateLimitInfo> => {
  return checkDiscordRateLimit(discordUserId, walletAddress)
} 
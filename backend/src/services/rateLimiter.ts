import { Redis } from '@upstash/redis'
import { config } from '../utils/config'
import { RateLimitInfo } from '../types'
import { logRateLimit } from './logger'

// initupstash redis client
const redis = new Redis({
  url: config.redis.url,
  token: config.redis.token
})

export const checkRateLimit = async (ip: string, walletAddress: string): Promise<RateLimitInfo> => {
  try {
    const ipKey = `ratelimit:ip:${ip}`
    const walletKey = `ratelimit:wallet:${walletAddress}`
    
    // get current counts and ttls
    const [ipCount, walletCount, ipTtl, walletTtl] = await Promise.all([
      redis.get(ipKey),
      redis.get(walletKey),
      redis.ttl(ipKey),
      redis.ttl(walletKey)
    ])
    
    const ipCountNum = Number(ipCount) || 0
    const walletCountNum = Number(walletCount) || 0
    
    console.log(`limit check - IP: ${ip}, Wallet: ${walletAddress}`)
    console.log(`counts - ip: ${ipCountNum}, Wallet: ${walletCountNum}`)
    console.log(`TTLs ip: ${ipTtl}, wallet: ${walletTtl}`)
    console.log(`Max requests: ${config.rateLimit.maxRequests}`)
    
    const ipRemaining = Math.max(0, config.rateLimit.maxRequests - ipCountNum)
    const walletRemaining = Math.max(0, config.rateLimit.maxRequests - walletCountNum)
    
    const remaining = Math.min(ipRemaining, walletRemaining)
    const blocked = ipCountNum >= config.rateLimit.maxRequests || walletCountNum >= config.rateLimit.maxRequests
    
    const resetTime = Math.max(ipTtl || 0, walletTtl || 0) * 1000
    
    console.log(`Blocked: ${blocked}, Reset time: ${resetTime}ms`)
    
    if (blocked) {
      logRateLimit(ip, walletAddress, true)
    }
    
    return {
      remaining,
      resetTime,
      blocked
    }
  } catch (error) {
    console.error('rate limit check failed:', error)
    return {
      remaining: 0,
      resetTime: 0,
      blocked: true
    }
  }
}

export const consumeRateLimit = async (ip: string, walletAddress: string): Promise<void> => {
  try {
    const ipKey = `ratelimit:ip:${ip}`
    const walletKey = `ratelimit:wallet:${walletAddress}`
    
    console.log(`Rate limiting - ip: ${ip}, wallet: ${walletAddress}`)
    
    // for atomic operations
    const pipeline = redis.pipeline()
    
    pipeline.incr(ipKey)
    pipeline.incr(walletKey)
    
    // get current values to check limits
    pipeline.get(ipKey)
    pipeline.get(walletKey)
    
    // get ttls to set expiry if needed
    pipeline.ttl(ipKey)
    pipeline.ttl(walletKey)
    
    const results = await pipeline.exec()
    
    if (!results) {
      throw new Error('redis pipeline failed')
    }
    
    const [ipCount, walletCount, ipCurrent, walletCurrent, ipTtl, walletTtl] = results
    
    // set expiry if key doesn't have one
    if (ipTtl === -1) {
      await redis.expire(ipKey, config.rateLimit.windowMs / 1000)
    }
    if (walletTtl === -1) {
      await redis.expire(walletKey, config.rateLimit.windowMs / 1000)
    }
    
    // check if exceeded (using current values after increment)
    const ipCountNum = Number(ipCurrent) || 0
    const walletCountNum = Number(walletCurrent) || 0
    
    if (ipCountNum > config.rateLimit.maxRequests || walletCountNum > config.rateLimit.maxRequests) {
      console.log(`rate limit exceeded! ip: ${ipCountNum}, wallet: ${walletCountNum}`)
      throw new Error('rate limit exceeded')
    }
  } catch (error) {
    console.error('rate limit consume failed:', error)
    throw error
  }
}

export const getRateLimitInfo = async (ip: string, walletAddress: string): Promise<RateLimitInfo> => {
  return await checkRateLimit(ip, walletAddress)
}

// for testing
export const clearRateLimits = async (ip?: string, walletAddress?: string) => {
  try {
    if (ip) {
      await redis.del(`ratelimit:ip:${ip}`)
    }
    if (walletAddress) {
      await redis.del(`ratelimit:wallet:${walletAddress}`)
    }
    if (!ip && !walletAddress) {
      const keys = await redis.keys('ratelimit:*')
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    }
  } catch (error) {
    console.error('clear rate limits failed:', error)
  }
} 
import { Router, Request, Response } from 'express'
import { validateWallet } from '../middleware/validateWallet'
import { checkRateLimit, consumeRateLimit } from '../services/rateLimiter'
import { sendTokens, validateWalletAddress, getUserBalance } from '../services/suiService'
import { verifyCaptcha } from '../services/captchaService'
import { logRequest } from '../services/historyService'
import { logFaucetRequest } from '../services/logger'
import { FaucetRequest, FaucetResponse } from '../types'

const router = Router()

router.post('/request', validateWallet, async (req: Request, res: Response) => {
  //get real IP
  const ip = req.ip || 
             req.headers['x-forwarded-for'] || 
             req.headers['x-real-ip'] || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress || 
             'unknown'
  
  // if array of IPs
  const realIP = Array.isArray(ip) ? ip[0] : ip

  let walletAddress: string = ''
  let amount: number = 0

  try {
    const { walletAddress: reqWalletAddress, amount: reqAmount, captchaToken } = req.body
    walletAddress = reqWalletAddress
    amount = reqAmount
    
    // verify captcha if token provided
    if (captchaToken) {
      const captchaResult = await verifyCaptcha(captchaToken, realIP)
      if (!captchaResult.success) {
        const response: FaucetResponse = {
          success: false,
          error: captchaResult.error || 'Captcha verification failed'
        }
        
        // log failed request
        await logRequest({
          walletAddress,
          amount,
          source: 'frontend',
          ip: realIP,
          success: false,
          error: 'captcha verification failed'
        })
        
        logFaucetRequest({
          timestamp: new Date(),
          ip: realIP,
          walletAddress,
          action: 'faucet_request',
          success: false,
          error: 'captcha verification failed'
        })
        
        return res.status(400).json(response)
      }
    }
    
    // check rate limits
    const rateLimitInfo = await checkRateLimit(realIP, walletAddress)
    
    if (rateLimitInfo.blocked) {
      const response: FaucetResponse = {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      }
      
      await logRequest({
        walletAddress,
        amount,
        source: 'frontend',
        ip: realIP,
        success: false,
        error: 'rate limit exceeded',
        rateLimitInfo
      })
      
      logFaucetRequest({
        timestamp: new Date(),
        ip: realIP,
        walletAddress,
        action: 'faucet_request',
        success: false,
        error: 'rate limit exceeded'
      })
      
      return res.status(429).json(response)
    }
    
    // consume rate limit
    await consumeRateLimit(realIP, walletAddress)
    
    // send tokens
    const txHash = await sendTokens(walletAddress, amount)
    
    const response: FaucetResponse = {
      success: true,
      txHash,
      message: `${amount} SUI sent successfully`
    }
    
    await logRequest({
      walletAddress,
      amount,
      source: 'frontend',
      ip: realIP,
      txHash,
      success: true,
      rateLimitInfo
    })
    
    logFaucetRequest({
      timestamp: new Date(),
      ip: realIP,
      walletAddress,
      action: 'faucet_request',
      success: true,
      txHash,
      amount
    })
    
    res.json(response)
    
  } catch (error) {
    console.error('faucet request failed:', error)
    
    const response: FaucetResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'transaction failed'
    }
    
    // log failed request
    await logRequest({
      walletAddress,
      amount,
      source: 'frontend',
      ip: realIP,
      success: false,
      error: response.error
    })
    
    logFaucetRequest({
      timestamp: new Date(),
      ip: realIP,
      walletAddress,
      action: 'faucet_request',
      success: false,
      error: response.error
    })
    
    res.status(500).json(response)
  }
})

router.get('/balance/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params
    
    const validation = validateWalletAddress(address)
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      })
    }
    
    const balance = await getUserBalance(address)
    
    res.json({
      success: true,
      balance: balance
    })
    
  } catch (error) {
    console.error('balance check failed:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'balance check failed'
    })
  }
})

router.get('/status', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.query
    
    if (walletAddress && typeof walletAddress === 'string') {
      const validation = validateWalletAddress(walletAddress)
      
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: validation.error
        })
      }
      
      const rateLimitInfo = await checkRateLimit(req.ip || 'unknown', walletAddress)
      
      return res.json({
        success: true,
        walletValid: true,
        rateLimit: rateLimitInfo
      })
    }
    
    res.json({
      success: true,
      message: 'faucet is operational'
    })
    
  } catch (error) {
    console.error('status check failed:', error)
    res.status(500).json({
      success: false,
      error: 'status check failed'
    })
  }
})

export default router 
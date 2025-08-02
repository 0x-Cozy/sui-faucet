import { Router, Request, Response } from 'express'
import { apiKeyAuth } from '../middleware/auth'
import { checkDiscordRateLimit, consumeDiscordRateLimit } from '../services/discordRateLimiter'
import { sendTokens, getUserBalance } from '../services/suiService'
import { logRequest } from '../services/historyService'
import { getRoleConfig, setRoleConfig } from '../services/discordRoleService'

const router = Router()

router.use(apiKeyAuth)

// Fucet request endpoint
router.post('/faucet/request', async (req: Request, res: Response) => {
  try {
    const { walletAddress, amount, discordUserId } = req.body

    if (!walletAddress || !amount || !discordUserId) {
      return res.status(400).json({
        success: false,
        error: 'missing required fields'
      })
    }

    const discordUserIdStr = String(discordUserId)

    const discordRateLimitInfo = await checkDiscordRateLimit(discordUserIdStr, walletAddress)

    if (discordRateLimitInfo.blocked) {
      await logRequest({
        walletAddress,
        amount,
        source: 'discord',
        discordUserId: discordUserIdStr,
        ip: 'discord-bot',
        success: false,
        error: 'discord rate limit exceeded',
        rateLimitInfo: discordRateLimitInfo
      })

      return res.status(429).json({
        success: false,
        error: 'rate limit exceeded',
        rateLimit: discordRateLimitInfo
      })
    }

    await consumeDiscordRateLimit(discordUserIdStr, walletAddress)

    const txHash = await sendTokens(walletAddress, amount)

    await logRequest({
      walletAddress,
      amount,
      source: 'discord',
      discordUserId: discordUserIdStr,
      ip: 'discord-bot',
      txHash,
      success: true
    })

    res.json({
      success: true,
      message: 'tokens sent successfully',
      txHash,
      amount
    })
  } catch (error) {
    console.error('discord faucet request failed:', error)
    
    await logRequest({
      walletAddress: req.body.walletAddress,
      amount: req.body.amount,
      source: 'discord',
      discordUserId: String(req.body.discordUserId),
      ip: 'discord-bot',
      success: false,
      error: error instanceof Error ? error.message : 'transaction failed'
    })

    res.status(500).json({
      success: false,
      error: 'internal server error'
    })
  }
})

// Balance check endpoint
router.get('/faucet/balance/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params

    const balance = await getUserBalance(address)

    res.json({
      success: true,
      balance
    })
  } catch (error) {
    console.error('balance check failed:', error)
    res.status(500).json({
      success: false,
      error: 'failed to get balance'
    })
  }
})

// Status endpoint
router.get('/faucet/status', async (req: Request, res: Response) => {
  try {
    const { discordUserId } = req.query

    if (discordUserId) {
      const discordUserIdStr = String(discordUserId)
      const walletAddress = req.query.walletAddress as string

      if (walletAddress) {
        const discordRateLimitInfo = await checkDiscordRateLimit(discordUserIdStr, walletAddress)

        res.json({
          success: true,
          discordRateLimit: discordRateLimitInfo,
          walletValid: true
        })
      } else {
        // Discord-only status
        const discordRateLimitInfo = await checkDiscordRateLimit(discordUserIdStr, '')
        
        res.json({
          success: true,
          discordRateLimit: discordRateLimitInfo,
          walletValid: true
        })
      }
    } else {
      // General status
      res.json({
        success: true,
        message: 'faucet is operational',
        walletValid: true
      })
    }
  } catch (error) {
    console.error('status check failed:', error)
    res.status(500).json({
      success: false,
      error: 'failed to get status'
    })
  }
})

router.get('/roles/:guildId', async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params
    const config = await getRoleConfig(guildId)

    if (config) {
      res.json({
        success: true,
        config
      })
    } else {
      res.status(404).json({
        success: false,
        error: 'role configuration not found'
      })
    }
  } catch (error) {
    console.error('Failed to get role config:', error)
    res.status(500).json({
      success: false,
      error: 'failed to get role configuration'
    })
  }
})

router.post('/roles/:guildId', async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params
    const { adminRoleId, modRoleId } = req.body

    const success = await setRoleConfig(guildId, adminRoleId, modRoleId)

    if (success) {
      res.json({
        success: true,
        message: 'role configuration updated successfully'
      })
    } else {
      res.status(500).json({
        success: false,
        error: 'failed to update role configuration'
      })
    }
  } catch (error) {
    console.error('Failed to set role config:', error)
    res.status(500).json({
      success: false,
      error: 'failed to update role configuration'
    })
  }
})

export default router 
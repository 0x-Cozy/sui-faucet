import { Request, Response, NextFunction } from 'express'
import { validateWalletAddress } from '../services/suiService'

export const validateWallet = (req: Request, res: Response, next: NextFunction): void => {
  const { walletAddress } = req.body
  
  if (!walletAddress) {
    res.status(400).json({
      success: false,
      error: 'wallet address is required'
    })
    return
  }
  
  const validation = validateWalletAddress(walletAddress)
  
  if (!validation.isValid) {
    res.status(400).json({
      success: false,
      error: validation.error || 'invalid wallet address'
    })
    return
  }
  
  next()
} 
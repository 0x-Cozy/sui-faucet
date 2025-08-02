import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../utils/config'
import { AuthenticatedRequest } from '../types'

export const adminAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'authentication required'
    })
    return
  }
  
  const token = authHeader.substring(7)
  
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as any
    if (decoded.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'admin access required'
      })
      return
    }
    
    ;(req as any).admin = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    }
    
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'invalid token'
    })
  }
}

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key']
  
  if (!apiKey || apiKey !== config.api.key) {
    res.status(401).json({
      success: false,
      error: 'invalid api key'
    })
    return
  }
  
  next()
}

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any
      req.isAdmin = decoded.role === 'admin'
    } catch (error) {
      req.isAdmin = false
    }
  } else {
    req.isAdmin = false
  }
  
  next()
}

export const generateAdminToken = (username: string): string => {
  return jwt.sign(
    {
      id: 'admin',
      username,
      role: 'admin'
    },
    config.jwt.secret,
    { expiresIn: '24h' }
  )
} 
import { Request, Response, NextFunction } from 'express'
import { validateApiKey } from '../services/apiKeyService'

interface ApiRequest extends Request {
  apiApp?: any
}

export const apiKeyAuth = async (req: ApiRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'api key required'
    })
  }
  
  const apiKey = authHeader.substring(7)
  const app = await validateApiKey(apiKey)
  
  if (!app) {
    return res.status(401).json({
      success: false,
      error: 'invalid api key'
    })
  }
  
  req.apiApp = app
  next()
} 
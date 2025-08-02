import dotenv from 'dotenv'
//TODO
dotenv.config()

export const config = {
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  
  sui: {
    network: process.env.SUI_NETWORK || 'testnet',
    rpcUrl: process.env.SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443',
    faucetMnemonic: process.env.SUI_FAUCET_MNEMONIC || ''
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute for testing
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10'), // 10 requests per minute for testing
    blockDurationMs: parseInt(process.env.RATE_LIMIT_BLOCK_DURATION_MS || '300000') // 5 minutes for testing
  },
  
  redis: {
    url: process.env.UPSTASH_REDIS_REST_URL || 'redis://localhost:6379',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret'
  },
  
  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/sui_faucet'
  },
  
  admin: {
    token: process.env.ADMIN_TOKEN || 'default_admin_token'
  },
  
  api: {
    key: process.env.API_KEY || 'default_api_key'
  },
  
  captcha: {
    siteKey: process.env.HCAPTCHA_SITE_KEY || '',
    secretKey: process.env.HCAPTCHA_SECRET_KEY || ''
  },
  
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://firstmovers.com'] 
      : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174']
  }
} 
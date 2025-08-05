import express from 'express'
import cors from 'cors'
import { config } from './utils/config'
import faucetRoutes from './routes/faucet'
import discordRoutes from './routes/discord'
import adminRoutes from './routes/admin'
import refundRoutes from './routes/refund'
import apiRoutes from './routes/api'
import apiFaucetRoutes from './routes/apiFaucet'

const app = express()

app.set('trust proxy', true)

// middleware
app.use(express.json())

// cors explicit headers
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'Origin', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})

// routes
app.use('/api/faucet', faucetRoutes)
app.use('/api/discord', discordRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/refund', refundRoutes)
app.use('/api', apiRoutes)
app.use('/api', apiFaucetRoutes)

// health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

export default app 
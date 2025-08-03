import express from 'express'
import cors from 'cors'
import { config } from './utils/config'
import faucetRoutes from './routes/faucet'
import discordRoutes from './routes/discord'
import adminRoutes from './routes/admin'
import refundRoutes from './routes/refund'

const app = express()

app.set('trust proxy', true)

// middleware
app.use(express.json())
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}))

// routes
app.use('/api/faucet', faucetRoutes)
app.use('/api/discord', discordRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/refund', refundRoutes)

// health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

export default app 
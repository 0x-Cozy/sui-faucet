# Sui Faucet DApp

A comprehensive Sui blockchain faucet application with web frontend, Discord bot integration, and admin dashboard.

## 🌐 Live Demos

- **Main Faucet**: [https://first-movers-faucet.vercel.app](https://first-movers-faucet.vercel.app)
- **Admin Dashboard**: [https://first-movers-001.vercel.app](https://first-movers-001.vercel.app)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Redis (Upstash Redis recommended)
- Discord Bot Token
- hCaptcha credentials

## 📁 Project Structure

```
airdrop/
├── faucet/          # Web frontend (React + TypeScript)
├── backend/         # Backend API (Node.js + Express)
├── admin/           # Admin dashboard (React + TypeScript)
├── discord/         # Discord bot (Discord.js + TypeScript)
└── docs.md          # Complete feature documentation
```

## 🔧 Backend Setup

### 1. Environment Configuration

Create `.env` file in `backend/`:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Redis (Upstash Redis)
REDIS_URL="redis://user:password@host:port"

# JWT
JWT_SECRET="your-jwt-secret"
ADMIN_TOKEN="dev_admin_token"

# Discord Bot
DISCORD_BOT_TOKEN="your-discord-bot-token"
DISCORD_CLIENT_ID="your-discord-client-id"
API_KEY="your-api-key-for-discord-bot"

# hCaptcha
HCAPTCHA_SITE_KEY="your-hcaptcha-site-key"
HCAPTCHA_SECRET_KEY="your-hcaptcha-secret-key"

# CORS
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=43200000  # 12 hours
RATE_LIMIT_MAX_REQUESTS=1       # 1 request per 12 hours
RATE_LIMIT_BLOCK_DURATION_MS=43200000
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 4. Start Backend

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

**Backend will run on:** `http://localhost:3001`

## 🌐 Frontend Setup

### 1. Environment Configuration

Create `.env` file in `faucet/`:

```env
VITE_BACKEND_URL="http://localhost:3001"
VITE_HCAPTCHA_SITE_KEY="your-hcaptcha-site-key"
```

### 2. Install Dependencies

```bash
cd faucet
npm install
```

### 3. Start Frontend

```bash
npm run dev
```

**Frontend will run on:** `http://localhost:3000`

## 📊 Admin Dashboard Setup

### 1. Environment Configuration

Create `.env` file in `admin/`:

```env
VITE_BACKEND_URL="http://localhost:3001"
```

### 2. Install Dependencies

```bash
cd admin
npm install
```

### 3. Start Admin Dashboard

```bash
npm run dev
```

**Admin Dashboard will run on:** `http://localhost:3002`

### 4. Admin Login

- **Username:** `admin`
- **Password:** `dev_admin_token`

## 🤖 Discord Bot Setup

### 1. Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and create a bot
4. Copy the bot token

### 2. Environment Configuration

Create `.env` file in `discord/`:

```env
DISCORD_BOT_TOKEN="your-discord-bot-token"
DISCORD_CLIENT_ID="your-discord-client-id"
BACKEND_URL="http://localhost:3001"
API_KEY="your-api-key-for-discord-bot"
```

### 3. Install Dependencies

```bash
cd discord
npm install
```

### 4. Deploy Bot Commands

```bash
npm run deploy-commands
```

### 5. Start Discord Bot

```bash
npm run dev
```

### 6. Add Bot to Server

1. Go to your Discord application's OAuth2 section
2. Add these scopes: `bot`, `applications.commands`
3. Add these permissions: `Send Messages`, `Use Slash Commands`, `Embed Links`
4. Use the generated invite link to add bot to your server

## 🔐 Security Configuration

### API Key Setup

1. Generate a secure API key for Discord bot access
2. Add to backend `.env`: `API_KEY="your-secure-api-key"`
3. Add to discord `.env`: `API_KEY="your-secure-api-key"`

### CORS Configuration

Update `CORS_ORIGIN` in backend `.env` to match your frontend URL:

```env
# Development
CORS_ORIGIN="http://localhost:3000"

# Production
CORS_ORIGIN="https://yourdomain.com"
```

### Rate Limiting

Current configuration: **1 request per 12 hours**

To modify, update these environment variables:

```env
RATE_LIMIT_WINDOW_MS=43200000      # 12 hours in milliseconds
RATE_LIMIT_MAX_REQUESTS=1           # Maximum requests per window
RATE_LIMIT_BLOCK_DURATION_MS=43200000  # Block duration
```

## 🚀 Production Deployment

### Backend Deployment

1. **Build the application:**
   ```bash
   cd backend
   npm run build
   ```

2. **Set production environment variables:**
   - Use production database URL
   - Use production Redis URL
   - Set secure JWT secret
   - Configure production CORS origin

3. **Start the server:**
   ```bash
   npm start
   ```

### Frontend Deployment

1. **Build the application:**
   ```bash
   cd faucet
   npm run build
   ```

2. **Deploy the `dist/` folder** to your hosting service

### Admin Dashboard Deployment

1. **Build the application:**
   ```bash
   cd admin
   npm run build
   ```

2. **Deploy the `dist/` folder** to your hosting service

### Discord Bot Deployment

1. **Deploy commands:**
   ```bash
   cd discord
   npm run deploy-commands
   ```

2. **Deploy bot to hosting service** (Railway, Heroku, etc.)



### Health Checks

```bash
# Backend health
curl http://localhost:3001/health

# Admin stats (requires JWT token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3001/api/admin/stats
```

## 📚 Additional Documentation

- **Complete Features**: See `docs.md` for detailed feature documentation
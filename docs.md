# Complete Feature Documentation

## 🎯 Overview
A comprehensive Sui blockchain faucet application with web frontend, Discord bot integration, and admin dashboard. Built with React, Node.js, TypeScript, and PostgreSQL.

## 🌐 Live Demos

- **Main Faucet**: [https://first-movers-faucet.vercel.app](https://first-movers-faucet.vercel.app)
- **Admin Dashboard**: [https://first-movers-001.vercel.app](https://first-movers-001.vercel.app)
- **Discord Bot Screenshots**
![Discord bot in action](https://i.ibb.co/JFmvMq6X/81192379-e2be-4e91-be91-cafc4328e28a.png)

![Discord bot in action](https://i.ibb.co/ynxVzgH1/77bcbd3d-7d9b-4e5b-ab4e-9f2ee11e5da1.png)

## 🌐 Web Frontend Features

### **Wallet Integration & Authentication**
- **Google OAuth with Enoki**: Seamless Google account integration using @mysten/enoki for zkLogin
- **Sui Name Service (SNS) Support**: Users can input SUI domain names (e.g., `sui.sui`) which are automatically resolved to wallet addresses
- **Address Validation**: Real-time validation of wallet addresses with proper format checking
- **Multi-Wallet Support**: Connect multiple wallets and switch between them seamlessly

### **Token Distribution System**
- **Configurable Amounts**: Slider-based amount selection ranging from 0.1 to 1.0 SUI in 0.1 increments
- **hCaptcha Integration**: Bot protection with hCaptcha verification before token distribution
- **Transaction Tracking**: Real-time transaction status with digest display
- **Success/Failure Alerts**: Auto-clearing notifications with transaction details

### **Rate Limiting & Security**
- **IP-Based Rate Limiting**: 1 request per 12 hours per IP address
- **Wallet-Based Rate Limiting**: 1 request per 12 hours per wallet address
- **Redis Caching**: Fast rate limit checks using Upstash Redis
- **CORS Protection**: Frontend-only access to public endpoints

### **User Experience Features**
- **Mobile Responsive Design**: Optimized for all screen sizes
- **Dark Theme**: Modern dark UI with Sui branding
- **Loading States**: Skeleton loaders and progress indicators
- **Copy-to-Clipboard**: One-click copying of wallet addresses and transaction hashes
- **Auto-Clearing Alerts**: Success/failure messages automatically disappear

### **Refund System**
- **Copy Method**: Simple copy-to-clipboard for refund address
- **Transaction History**: Track all refund requests in admin dashboard
- **No Approval Workflow**: Direct refund processing

### **Navigation & Layout**
- **Dynamic Footer**: "NEW HERE?" and "CONNECT" buttons for screens >740px height
- **Responsive Navigation**: Adapts to mobile and desktop layouts
- **Component Separation**: SUI drop and refund content in separate components

## 🤖 Discord Bot Features

### **Slash Commands**
- **`/faucet <amount> <wallet_address>`**: Request SUI tokens with amount and wallet validation
- **`/balance <wallet_address>`**: Check wallet balance using public SUI API
- **`/status`**: Check bot status (active/paused)
- **`/help`**: Display available commands and usage
- **`/roles`**: View current admin/mod role configuration
- **`/setup <admin_role> <mod_role>`**: Configure admin and moderator roles
- **`/admin <action>`**: Admin-only commands (pause/unpause bot, view stats)
- **`/mod <action>`**: Moderator commands (view history, manage restrictions)

### **Role-Based Access Control**
- **Dynamic Role Configuration**: Per-server admin and moderator role setup
- **Database Storage**: Role configurations stored in PostgreSQL
- **Permission Validation**: Real-time role checking for command execution
- **Admin Commands**: Bot pause/unpause, system status
- **Mod Commands**: User history, restriction management

### **Rate Limiting & Security**
- **Discord User ID + Wallet Rate Limiting**: Unified with frontend limits
- **API Key Authentication**: Secure backend access for Discord bot
- **IP Tracking**: Discord user IP logging for analytics
- **Transaction Logging**: Complete audit trail of all requests

### **Rich Embeds & Notifications**
- **Success Embeds**: Transaction details with hash and amount
- **Error Embeds**: Detailed error messages with troubleshooting tips
- **Status Embeds**: Bot status with uptime and statistics
- **Help Embeds**: Command documentation with examples

## 🔧 Backend Features

### **API Endpoints**
- **Public Endpoints**:
  - `POST /api/faucet/request`: Token distribution with captcha verification
  - `GET /api/faucet/balance/:address`: Public wallet balance checking
- **Discord Endpoints** (API Key Protected):
  - `POST /api/discord/faucet`: Discord bot token requests
  - `GET /api/discord/balance/:address`: Discord balance checking
- **Admin Endpoints** (JWT Protected):
  - `POST /api/admin/login`: Admin authentication
  - `GET /api/admin/stats`: System statistics
  - `GET /api/admin/transactions/*`: Transaction history
  - `POST /api/admin/bot/pause|unpause`: Bot control
  - `POST /api/admin/restrictions/*`: User/IP/wallet restrictions

### **Database Management**
- **PostgreSQL Integration**: Scalable database with full ACID compliance
- **Prisma ORM**: Type-safe database operations
- **Request History**: Complete audit trail of all faucet requests
- **Rate Limit Storage**: Redis-based rate limiting with persistence
- **Admin Logs**: Administrative action tracking

### **Security Features**
- **JWT Authentication**: Secure admin dashboard access
- **API Key Protection**: Discord bot endpoint security
- **CORS Configuration**: Frontend-only access control
- **IP Extraction**: Proper proxy handling for accurate IP detection
- **hCaptcha Verification**: Bot protection with server-side validation

### **Rate Limiting System**
- **Multi-Dimensional Rate Limiting**: IP, wallet, and Discord user-based limits
- **Configurable Windows**: 12-hour windows with 1 request maximum
- **Redis Storage**: Fast rate limit checks with Upstash Redis
- **Block Duration**: 12-hour blocks for rate limit violations

### **Transaction Processing**
- **Sui SDK Integration**: Native Sui transaction building
- **Gas Estimation**: Automatic gas calculation and budgeting
- **Error Handling**: Comprehensive error catching and logging
- **Dry Run Support**: Transaction validation before execution

## 📊 Admin Dashboard Features

### **Authentication System**
- **JWT-Based Login**: Secure admin authentication
- **Token Persistence**: Automatic login state management
- **Session Management**: Proper token storage and cleanup

### **Dashboard Overview**
- **Real-Time Statistics**: Total requests, success rates, unique users
- **Bot Status Monitoring**: Active/paused status with control buttons
- **Recent Activity**: Latest transactions with details
- **System Health**: Backend status and performance metrics

### **Transaction Management**
- **Transaction History**: Complete audit trail of all requests
- **Filtering Options**: By source (frontend/discord), time range, status
- **Detailed Views**: Transaction hashes, amounts, user details
- **Export Capabilities**: Data export for analysis

### **Analytics & Reporting**
- **Comprehensive Statistics**: User counts, token distribution, success rates
- **Source Analytics**: Frontend vs Discord usage patterns
- **Time-Based Analysis**: Request patterns and trends
- **Performance Metrics**: Response times and error rates

### **System Administration**
- **Bot Control**: Pause/unpause Discord bot functionality
- **Rate Limit Management**: View and adjust rate limiting settings
- **User Restrictions**: Block IPs, wallets, and Discord users
- **System Logs**: Administrative action tracking

## 🔐 Security & Compliance

### **Data Protection**
- **Encrypted Storage**: Sensitive data encryption at rest
- **Secure Connections**: SSL/TLS for all database connections
- **Token Security**: JWT tokens with proper expiration
- **API Key Management**: Secure Discord bot authentication

### **Audit & Logging**
- **Complete Audit Trail**: All actions logged with timestamps
- **Error Tracking**: Comprehensive error logging and monitoring
- **Performance Monitoring**: Response time and throughput tracking
- **Security Events**: Authentication and authorization logging

## 🚀 Deployment & Infrastructure

### **Environment Configuration**
- **Environment Variables**: Secure configuration management
- **Database URLs**: PostgreSQL connection strings
- **API Keys**: Discord bot and hCaptcha credentials
- **Redis Configuration**: Upstash Redis connection settings

### **Build & Deployment**
- **TypeScript Compilation**: Full type safety and optimization
- **Prisma Generation**: Database client generation
- **Environment-Specific Builds**: Development and production configurations
- **Health Checks**: Automated system monitoring

---

## 📋 Available Commands

### **Discord Bot Commands**

| Command | Usage | Description |
|---------|-------|-------------|
| `/faucet` | `/faucet 0.1 0x...` | Request SUI tokens |
| `/balance` | `/balance 0x...` | Check wallet balance |
| `/status` | `/status` | Check bot status |
| `/help` | `/help` | Show available commands |
| `/roles` | `/roles` | View role configuration |
| `/setup` | `/setup @Admin @Mod` | Configure roles |
| `/admin` | `/admin status` | Admin commands |
| `/mod` | `/mod history` | Moderator commands |

### **Admin Dashboard Features**

- **Dashboard**: Overview statistics and recent activity
- **Transactions**: Complete transaction history with filtering
- **Analytics**: User statistics and performance metrics
- **Settings**: Bot control and system configuration

## 🤖 Discord Bot Configuration

### **Bot Setup Instructions**

Once the bot is in your server, use these commands:

```bash
# Setup admin and mod roles
/setup @AdminRole @ModRole

# Check current roles
/roles

# Test admin commands (requires admin role)
/admin status

# Test mod commands (requires mod role)
/mod history
```



---

*This documentation covers all major features and capabilities of the faucet dapp. Each section provides detailed information about functionality, security, and user experience considerations.* 
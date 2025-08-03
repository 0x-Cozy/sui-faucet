# Sui Faucet Discord Bot

Discord.js bot for the Sui blockchain faucet with slash commands, role-based access control, and rich embeds.

## 🚀 Quick Setup

```bash
npm install
cp .env.example .env
# edit .env with your configuration
npm run deploy-commands
npm run dev
```

## 🔧 Development

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run deploy-commands  # Deploy slash commands to Discord
```

## 🤖 Bot Commands

### **User Commands**
- `/faucet <amount> <wallet_address>` - Request SUI tokens
- `/balance <wallet_address>` - Check wallet balance
- `/status` - Check bot status
- `/help` - Show available commands

### **Administrative Commands**
- `/roles` - View current role configuration
- `/setup <admin_role> <mod_role>` - Configure admin and moderator roles
- `/admin <action>` - Admin-only commands (pause/unpause, stats)
- `/mod <action>` - Moderator commands (history, restrictions)

## 🔐 Environment Variables

```env
DISCORD_BOT_TOKEN="your-discord-bot-token"
DISCORD_CLIENT_ID="your-discord-client-id"
BACKEND_URL="http://localhost:3001"
API_KEY="your-api-key-for-discord-bot"
```

## 🛠️ Bot Setup

### **1. Create Discord Application**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and create a bot
4. Copy the bot token and client ID

### **2. Add Bot to Server**
1. Go to OAuth2 section in your Discord application
2. Add scopes: `bot`, `applications.commands`
3. Add permissions: `Send Messages`, `Use Slash Commands`, `Embed Links`
4. Use the generated invite link to add bot to your server

### **3. Deploy Commands**
```bash
npm run deploy-commands
```

### **4. Configure Roles**
```bash
# Setup admin and mod roles
/setup @AdminRole @ModRole

# Check current roles
/roles
```

## 🔒 Security Features

- **API Key Authentication**: Secure backend access
- **Role-Based Access Control**: Dynamic admin/mod role configuration
- **Rate Limiting**: Discord user + wallet rate limiting
- **Permission Validation**: Real-time role checking

## 📊 Rate Limiting

- **Unified Limits**: Same rate limits as frontend (1 request per 12 hours)
- **Discord User + Wallet**: Combined rate limiting per user and wallet
- **Redis Storage**: Fast rate limit checks

## 🎨 Rich Embeds

### **Success Embeds**
- Transaction details with hash
- Amount and recipient information
- Timestamp and status

### **Error Embeds**
- Detailed error messages
- Troubleshooting tips
- Rate limit information

### **Status Embeds**
- Bot status (active/paused)
- Uptime and statistics
- System health information

## 🚀 Production Deployment

1. Set production environment variables
2. Deploy commands: `npm run deploy-commands`
3. Deploy bot to hosting service (Railway, Heroku, etc.)
4. Ensure backend is accessible

## 📚 Documentation

See the main `README.md` and `docs.md` for complete documentation. 
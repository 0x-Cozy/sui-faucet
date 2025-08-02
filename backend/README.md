# FM Faucet Backend

Backend API for the SUI testnet faucet with rate limiting and IP-based restrictions.

## setup

```bash
npm install
cp env.example .env
# edit .env with your config
npm run db:generate
npm run db:push
npm run dev
```

## api endpoints

- `POST /api/faucet/request` - request tokens
- `GET /api/faucet/status` - check faucet status
- `GET /api/admin/stats` - admin stats (auth required)
- `GET /api/admin/balance` - faucet balance (auth required)
- `GET /api/admin/network` - network info
- `GET /health` - health check

## environment variables

see `env.example` for required variables 
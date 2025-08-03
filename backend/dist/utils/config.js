"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
//TODO
dotenv_1.default.config();
exports.config = {
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
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '43200000'), // 12 hours (12 * 60 * 60 * 1000)
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1'), // 1 request per 12 hours
        blockDurationMs: parseInt(process.env.RATE_LIMIT_BLOCK_DURATION_MS || '43200000') // 12 hours block duration
    },
    redis: {
        url: process.env.UPSTASH_REDIS_REST_URL || 'redis://localhost:6379',
        token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'default_secret'
    },
    database: {
        url: process.env.DATABASE_URL || 'postgresql://first_move_user:nafPU0DKOGSvPIRbflpd6cm7A92vNG9Z@dpg-d27ad1muk2gs73dqpi80-a.oregon-postgres.render.com/first_move'
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
        origin: '*'
    }
};
//# sourceMappingURL=config.js.map
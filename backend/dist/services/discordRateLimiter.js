"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiscordRateLimitInfo = exports.consumeDiscordRateLimit = exports.checkDiscordRateLimit = void 0;
const redis_1 = require("@upstash/redis");
const config_1 = require("../utils/config");
const redis = new redis_1.Redis({
    url: config_1.config.redis.url,
    token: config_1.config.redis.token,
});
const checkDiscordRateLimit = async (discordUserId, walletAddress) => {
    try {
        const now = Date.now();
        const windowMs = config_1.config.rateLimit.windowMs;
        const maxRequests = config_1.config.rateLimit.maxRequests;
        const blockDurationMs = config_1.config.rateLimit.blockDurationMs;
        // create unique keys for this user and wallet combination
        const requestKey = `discord:requests:${discordUserId}:${walletAddress}`;
        const blockKey = `discord:blocked:${discordUserId}:${walletAddress}`;
        // check if user is currently blocked
        const isBlocked = await redis.get(blockKey);
        if (isBlocked) {
            const blockExpiry = await redis.ttl(blockKey);
            return {
                remaining: 0,
                resetTime: now + (blockExpiry * 1000),
                blocked: true
            };
        }
        const requests = await redis.get(requestKey) || 0;
        const requestCount = parseInt(requests.toString());
        if (requestCount >= maxRequests) {
            await redis.setex(blockKey, Math.floor(blockDurationMs / 1000), '1');
            return {
                remaining: 0,
                resetTime: now + blockDurationMs,
                blocked: true
            };
        }
        const remaining = Math.max(0, maxRequests - requestCount);
        const resetTime = now + windowMs;
        return {
            remaining,
            resetTime,
            blocked: false
        };
    }
    catch (error) {
        console.error('Discord rate limit check failed:', error);
        return {
            remaining: 1,
            resetTime: Date.now() + config_1.config.rateLimit.windowMs,
            blocked: false
        };
    }
};
exports.checkDiscordRateLimit = checkDiscordRateLimit;
const consumeDiscordRateLimit = async (discordUserId, walletAddress) => {
    try {
        const windowMs = config_1.config.rateLimit.windowMs;
        const requestKey = `discord:requests:${discordUserId}:${walletAddress}`;
        await redis.incr(requestKey);
        await redis.expire(requestKey, Math.floor(windowMs / 1000));
    }
    catch (error) {
        console.error('Discord rate limit consumption failed:', error);
    }
};
exports.consumeDiscordRateLimit = consumeDiscordRateLimit;
const getDiscordRateLimitInfo = async (discordUserId, walletAddress) => {
    return (0, exports.checkDiscordRateLimit)(discordUserId, walletAddress);
};
exports.getDiscordRateLimitInfo = getDiscordRateLimitInfo;
//# sourceMappingURL=discordRateLimiter.js.map
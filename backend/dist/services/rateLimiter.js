"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearRateLimits = exports.getRateLimitInfo = exports.consumeRateLimit = exports.checkRateLimit = void 0;
const redis_1 = require("@upstash/redis");
const config_1 = require("../utils/config");
const logger_1 = require("./logger");
// initupstash redis client
const redis = new redis_1.Redis({
    url: config_1.config.redis.url,
    token: config_1.config.redis.token
});
const checkRateLimit = async (ip, walletAddress) => {
    try {
        const ipKey = `ratelimit:ip:${ip}`;
        const walletKey = `ratelimit:wallet:${walletAddress}`;
        // get current counts and ttls
        const [ipCount, walletCount, ipTtl, walletTtl] = await Promise.all([
            redis.get(ipKey),
            redis.get(walletKey),
            redis.ttl(ipKey),
            redis.ttl(walletKey)
        ]);
        const ipCountNum = Number(ipCount) || 0;
        const walletCountNum = Number(walletCount) || 0;
        console.log(`limit check - IP: ${ip}, Wallet: ${walletAddress}`);
        console.log(`counts - ip: ${ipCountNum}, Wallet: ${walletCountNum}`);
        console.log(`TTLs ip: ${ipTtl}, wallet: ${walletTtl}`);
        console.log(`Max requests: ${config_1.config.rateLimit.maxRequests}`);
        const ipRemaining = Math.max(0, config_1.config.rateLimit.maxRequests - ipCountNum);
        const walletRemaining = Math.max(0, config_1.config.rateLimit.maxRequests - walletCountNum);
        const remaining = Math.min(ipRemaining, walletRemaining);
        const blocked = ipCountNum >= config_1.config.rateLimit.maxRequests || walletCountNum >= config_1.config.rateLimit.maxRequests;
        const resetTime = Math.max(ipTtl || 0, walletTtl || 0) * 1000;
        console.log(`Blocked: ${blocked}, Reset time: ${resetTime}ms`);
        if (blocked) {
            (0, logger_1.logRateLimit)(ip, walletAddress, true);
        }
        return {
            remaining,
            resetTime,
            blocked
        };
    }
    catch (error) {
        console.error('rate limit check failed:', error);
        return {
            remaining: 0,
            resetTime: 0,
            blocked: true
        };
    }
};
exports.checkRateLimit = checkRateLimit;
const consumeRateLimit = async (ip, walletAddress) => {
    try {
        const ipKey = `ratelimit:ip:${ip}`;
        const walletKey = `ratelimit:wallet:${walletAddress}`;
        console.log(`Rate limiting - ip: ${ip}, wallet: ${walletAddress}`);
        // for atomic operations
        const pipeline = redis.pipeline();
        pipeline.incr(ipKey);
        pipeline.incr(walletKey);
        // get current values to check limits
        pipeline.get(ipKey);
        pipeline.get(walletKey);
        // get ttls to set expiry if needed
        pipeline.ttl(ipKey);
        pipeline.ttl(walletKey);
        const results = await pipeline.exec();
        if (!results) {
            throw new Error('redis pipeline failed');
        }
        const [ipCount, walletCount, ipCurrent, walletCurrent, ipTtl, walletTtl] = results;
        // set expiry if key doesn't have one
        if (ipTtl === -1) {
            await redis.expire(ipKey, config_1.config.rateLimit.windowMs / 1000);
        }
        if (walletTtl === -1) {
            await redis.expire(walletKey, config_1.config.rateLimit.windowMs / 1000);
        }
        // check if exceeded (using current values after increment)
        const ipCountNum = Number(ipCurrent) || 0;
        const walletCountNum = Number(walletCurrent) || 0;
        if (ipCountNum > config_1.config.rateLimit.maxRequests || walletCountNum > config_1.config.rateLimit.maxRequests) {
            console.log(`rate limit exceeded! ip: ${ipCountNum}, wallet: ${walletCountNum}`);
            throw new Error('rate limit exceeded');
        }
    }
    catch (error) {
        console.error('rate limit consume failed:', error);
        throw error;
    }
};
exports.consumeRateLimit = consumeRateLimit;
const getRateLimitInfo = async (ip, walletAddress) => {
    return await (0, exports.checkRateLimit)(ip, walletAddress);
};
exports.getRateLimitInfo = getRateLimitInfo;
// for testing
const clearRateLimits = async (ip, walletAddress) => {
    try {
        if (ip) {
            await redis.del(`ratelimit:ip:${ip}`);
        }
        if (walletAddress) {
            await redis.del(`ratelimit:wallet:${walletAddress}`);
        }
        if (!ip && !walletAddress) {
            const keys = await redis.keys('ratelimit:*');
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        }
    }
    catch (error) {
        console.error('clear rate limits failed:', error);
    }
};
exports.clearRateLimits = clearRateLimits;
//# sourceMappingURL=rateLimiter.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWalletRestricted = exports.unrestrictWallet = exports.restrictWallet = exports.isIPRestricted = exports.unrestrictIP = exports.restrictIP = exports.isDiscordUserRestricted = exports.unrestrictDiscordUser = exports.restrictDiscordUser = void 0;
const redis_1 = require("@upstash/redis");
const config_1 = require("../utils/config");
const logger_1 = __importDefault(require("./logger"));
const redis = new redis_1.Redis({
    url: config_1.config.redis.url,
    token: config_1.config.redis.token
});
const DISCORD_RESTRICTION_KEY = 'restriction:discord:';
const IP_RESTRICTION_KEY = 'restriction:ip:';
const WALLET_RESTRICTION_KEY = 'restriction:wallet:';
const restrictDiscordUser = async (discordUserId, reason, restrictedBy, duration // in seconds, undefined = permanent
) => {
    try {
        const now = new Date();
        const expiresAt = duration ? new Date(now.getTime() + duration * 1000) : undefined;
        const restrictionData = {
            reason,
            restrictedBy,
            restrictedAt: now.toISOString(),
            expiresAt: expiresAt?.toISOString()
        };
        const key = `${DISCORD_RESTRICTION_KEY}${discordUserId}`;
        if (duration) {
            await redis.setex(key, duration, JSON.stringify(restrictionData));
        }
        else {
            await redis.set(key, JSON.stringify(restrictionData));
        }
        logger_1.default.info(`Discord user ${discordUserId} restricted by ${restrictedBy} for reason: ${reason}`);
        return true;
    }
    catch (error) {
        logger_1.default.error('Failed to restrict Discord user:', error);
        return false;
    }
};
exports.restrictDiscordUser = restrictDiscordUser;
const unrestrictDiscordUser = async (discordUserId) => {
    try {
        const key = `${DISCORD_RESTRICTION_KEY}${discordUserId}`;
        await redis.del(key);
        logger_1.default.info(`Discord user ${discordUserId} unrestricted`);
        return true;
    }
    catch (error) {
        logger_1.default.error('Failed to unrestrict Discord user:', error);
        return false;
    }
};
exports.unrestrictDiscordUser = unrestrictDiscordUser;
const isDiscordUserRestricted = async (discordUserId) => {
    try {
        const key = `${DISCORD_RESTRICTION_KEY}${discordUserId}`;
        const restrictionData = await redis.get(key);
        if (!restrictionData) {
            return { isRestricted: false };
        }
        //  handle both string and object responses from redis
        let data;
        if (typeof restrictionData === 'string') {
            data = JSON.parse(restrictionData);
        }
        else if (typeof restrictionData === 'object' && restrictionData !== null) {
            data = restrictionData;
        }
        else {
            return { isRestricted: false };
        }
        return {
            isRestricted: true,
            reason: data.reason,
            restrictedBy: data.restrictedBy,
            restrictedAt: new Date(data.restrictedAt),
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined
        };
    }
    catch (error) {
        logger_1.default.error('Failed to check Discord user restriction:', error);
        return { isRestricted: false };
    }
};
exports.isDiscordUserRestricted = isDiscordUserRestricted;
const restrictIP = async (ip, reason, restrictedBy, duration) => {
    try {
        const now = new Date();
        const expiresAt = duration ? new Date(now.getTime() + duration * 1000) : undefined;
        const restrictionData = {
            reason,
            restrictedBy,
            restrictedAt: now.toISOString(),
            expiresAt: expiresAt?.toISOString()
        };
        const key = `${IP_RESTRICTION_KEY}${ip}`;
        if (duration) {
            await redis.setex(key, duration, JSON.stringify(restrictionData));
        }
        else {
            await redis.set(key, JSON.stringify(restrictionData));
        }
        logger_1.default.info(`IP ${ip} restricted by ${restrictedBy} for reason: ${reason}`);
        return true;
    }
    catch (error) {
        logger_1.default.error('Failed to restrict IP:', error);
        return false;
    }
};
exports.restrictIP = restrictIP;
const unrestrictIP = async (ip) => {
    try {
        const key = `${IP_RESTRICTION_KEY}${ip}`;
        await redis.del(key);
        logger_1.default.info(`IP ${ip} unrestricted`);
        return true;
    }
    catch (error) {
        logger_1.default.error('Failed to unrestrict IP:', error);
        return false;
    }
};
exports.unrestrictIP = unrestrictIP;
const isIPRestricted = async (ip) => {
    try {
        const key = `${IP_RESTRICTION_KEY}${ip}`;
        const restrictionData = await redis.get(key);
        if (!restrictionData) {
            return { isRestricted: false };
        }
        let data;
        if (typeof restrictionData === 'string') {
            data = JSON.parse(restrictionData);
        }
        else if (typeof restrictionData === 'object' && restrictionData !== null) {
            data = restrictionData;
        }
        else {
            return { isRestricted: false };
        }
        return {
            isRestricted: true,
            reason: data.reason,
            restrictedBy: data.restrictedBy,
            restrictedAt: new Date(data.restrictedAt),
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined
        };
    }
    catch (error) {
        logger_1.default.error('Failed to check IP restriction:', error);
        return { isRestricted: false };
    }
};
exports.isIPRestricted = isIPRestricted;
const restrictWallet = async (walletAddress, reason, restrictedBy, duration) => {
    try {
        const now = new Date();
        const expiresAt = duration ? new Date(now.getTime() + duration * 1000) : undefined;
        const restrictionData = {
            reason,
            restrictedBy,
            restrictedAt: now.toISOString(),
            expiresAt: expiresAt?.toISOString()
        };
        const key = `${WALLET_RESTRICTION_KEY}${walletAddress}`;
        if (duration) {
            await redis.setex(key, duration, JSON.stringify(restrictionData));
        }
        else {
            await redis.set(key, JSON.stringify(restrictionData));
        }
        logger_1.default.info(`Wallet ${walletAddress} restricted by ${restrictedBy} for reason: ${reason}`);
        return true;
    }
    catch (error) {
        logger_1.default.error('Failed to restrict wallet:', error);
        return false;
    }
};
exports.restrictWallet = restrictWallet;
const unrestrictWallet = async (walletAddress) => {
    try {
        const key = `${WALLET_RESTRICTION_KEY}${walletAddress}`;
        await redis.del(key);
        logger_1.default.info(`Wallet ${walletAddress} unrestricted`);
        return true;
    }
    catch (error) {
        logger_1.default.error('Failed to unrestrict wallet:', error);
        return false;
    }
};
exports.unrestrictWallet = unrestrictWallet;
const isWalletRestricted = async (walletAddress) => {
    try {
        const key = `${WALLET_RESTRICTION_KEY}${walletAddress}`;
        const restrictionData = await redis.get(key);
        if (!restrictionData) {
            return { isRestricted: false };
        }
        let data;
        if (typeof restrictionData === 'string') {
            data = JSON.parse(restrictionData);
        }
        else if (typeof restrictionData === 'object' && restrictionData !== null) {
            data = restrictionData;
        }
        else {
            return { isRestricted: false };
        }
        return {
            isRestricted: true,
            reason: data.reason,
            restrictedBy: data.restrictedBy,
            restrictedAt: new Date(data.restrictedAt),
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined
        };
    }
    catch (error) {
        logger_1.default.error('Failed to check wallet restriction:', error);
        return { isRestricted: false };
    }
};
exports.isWalletRestricted = isWalletRestricted;
//# sourceMappingURL=restrictionService.js.map
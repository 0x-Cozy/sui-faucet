"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBotPaused = exports.unpauseBot = exports.pauseBot = exports.getBotStatus = void 0;
const redis_1 = require("@upstash/redis");
const config_1 = require("../utils/config");
const logger_1 = __importDefault(require("./logger"));
const redis = new redis_1.Redis({
    url: config_1.config.redis.url,
    token: config_1.config.redis.token
});
const BOT_STATUS_KEY = 'bot:status';
const BOT_PAUSE_REASON_KEY = 'bot:pause_reason';
const BOT_PAUSE_BY_KEY = 'bot:pause_by';
const BOT_PAUSE_TIME_KEY = 'bot:pause_time';
const getBotStatus = async () => {
    try {
        const [isPaused, pauseReason, pausedBy, pausedAt] = await Promise.all([
            redis.get(BOT_STATUS_KEY),
            redis.get(BOT_PAUSE_REASON_KEY),
            redis.get(BOT_PAUSE_BY_KEY),
            redis.get(BOT_PAUSE_TIME_KEY)
        ]);
        return {
            isPaused: isPaused === true || isPaused === 'true',
            pauseReason: pauseReason || undefined,
            pausedBy: pausedBy || undefined,
            pausedAt: pausedAt ? new Date(pausedAt) : undefined
        };
    }
    catch (error) {
        logger_1.default.error('Failed to get bot status:', error);
        return { isPaused: false };
    }
};
exports.getBotStatus = getBotStatus;
const pauseBot = async (reason, pausedBy) => {
    try {
        const now = new Date();
        await Promise.all([
            redis.set(BOT_STATUS_KEY, 'true'),
            redis.set(BOT_PAUSE_REASON_KEY, reason),
            redis.set(BOT_PAUSE_BY_KEY, pausedBy),
            redis.set(BOT_PAUSE_TIME_KEY, now.toISOString())
        ]);
        logger_1.default.info(`Bot paused by ${pausedBy} for reason: ${reason}`);
        return true;
    }
    catch (error) {
        logger_1.default.error('Failed to pause bot:', error);
        return false;
    }
};
exports.pauseBot = pauseBot;
const unpauseBot = async (unpausedBy) => {
    try {
        await Promise.all([
            redis.del(BOT_STATUS_KEY),
            redis.del(BOT_PAUSE_REASON_KEY),
            redis.del(BOT_PAUSE_BY_KEY),
            redis.del(BOT_PAUSE_TIME_KEY)
        ]);
        logger_1.default.info(`Bot unpaused by ${unpausedBy}`);
        return true;
    }
    catch (error) {
        logger_1.default.error('Failed to unpause bot:', error);
        return false;
    }
};
exports.unpauseBot = unpauseBot;
const isBotPaused = async () => {
    try {
        const status = await (0, exports.getBotStatus)();
        return status.isPaused;
    }
    catch (error) {
        logger_1.default.error('Failed to check bot pause status:', error);
        return false;
    }
};
exports.isBotPaused = isBotPaused;
//# sourceMappingURL=botStateService.js.map
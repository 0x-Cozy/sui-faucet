"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logRateLimit = exports.logError = exports.logFaucetRequest = void 0;
const winston_1 = __importDefault(require("winston"));
const config_1 = require("../utils/config");
const logger = winston_1.default.createLogger({
    level: config_1.config.server.nodeEnv === 'production' ? 'info' : 'debug',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'logs/combined.log' })
    ]
});
if (config_1.config.server.nodeEnv !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple()
    }));
}
const logFaucetRequest = (entry) => {
    logger.info('faucet request', {
        timestamp: entry.timestamp,
        ip: entry.ip,
        walletAddress: entry.walletAddress,
        action: entry.action,
        success: entry.success,
        error: entry.error,
        txHash: entry.txHash,
        amount: entry.amount
    });
};
exports.logFaucetRequest = logFaucetRequest;
const logError = (error, context) => {
    logger.error('error occurred', {
        message: error.message,
        stack: error.stack,
        context
    });
};
exports.logError = logError;
const logRateLimit = (ip, walletAddress, blocked) => {
    logger.warn('rate limit triggered', {
        ip,
        walletAddress,
        blocked,
        timestamp: new Date()
    });
};
exports.logRateLimit = logRateLimit;
exports.default = logger;
//# sourceMappingURL=logger.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateWallet_1 = require("../middleware/validateWallet");
const rateLimiter_1 = require("../services/rateLimiter");
const suiService_1 = require("../services/suiService");
const captchaService_1 = require("../services/captchaService");
const historyService_1 = require("../services/historyService");
const logger_1 = require("../services/logger");
const router = (0, express_1.Router)();
router.post('/request', validateWallet_1.validateWallet, async (req, res) => {
    //get real IP
    const ip = req.ip ||
        req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        'unknown';
    // if array of IPs
    const realIP = Array.isArray(ip) ? ip[0] : ip;
    let walletAddress = '';
    let amount = 0;
    try {
        const { walletAddress: reqWalletAddress, amount: reqAmount, captchaToken } = req.body;
        walletAddress = reqWalletAddress;
        amount = reqAmount;
        // verify captcha if token provided
        if (captchaToken) {
            const captchaResult = await (0, captchaService_1.verifyCaptcha)(captchaToken, realIP);
            if (!captchaResult.success) {
                const response = {
                    success: false,
                    error: captchaResult.error || 'Captcha verification failed'
                };
                // log failed request
                await (0, historyService_1.logRequest)({
                    walletAddress,
                    amount,
                    source: 'frontend',
                    ip: realIP,
                    success: false,
                    error: 'captcha verification failed'
                });
                (0, logger_1.logFaucetRequest)({
                    timestamp: new Date(),
                    ip: realIP,
                    walletAddress,
                    action: 'faucet_request',
                    success: false,
                    error: 'captcha verification failed'
                });
                return res.status(400).json(response);
            }
        }
        // check rate limits
        const rateLimitInfo = await (0, rateLimiter_1.checkRateLimit)(realIP, walletAddress);
        if (rateLimitInfo.blocked) {
            const response = {
                success: false,
                error: 'Rate limit exceeded. Please try again later.'
            };
            await (0, historyService_1.logRequest)({
                walletAddress,
                amount,
                source: 'frontend',
                ip: realIP,
                success: false,
                error: 'rate limit exceeded',
                rateLimitInfo
            });
            (0, logger_1.logFaucetRequest)({
                timestamp: new Date(),
                ip: realIP,
                walletAddress,
                action: 'faucet_request',
                success: false,
                error: 'rate limit exceeded'
            });
            return res.status(429).json(response);
        }
        // consume rate limit
        await (0, rateLimiter_1.consumeRateLimit)(realIP, walletAddress);
        // send tokens
        const txHash = await (0, suiService_1.sendTokens)(walletAddress, amount);
        const response = {
            success: true,
            txHash,
            message: `${amount} SUI sent successfully`
        };
        await (0, historyService_1.logRequest)({
            walletAddress,
            amount,
            source: 'frontend',
            ip: realIP,
            txHash,
            success: true,
            rateLimitInfo
        });
        (0, logger_1.logFaucetRequest)({
            timestamp: new Date(),
            ip: realIP,
            walletAddress,
            action: 'faucet_request',
            success: true,
            txHash,
            amount
        });
        res.json(response);
    }
    catch (error) {
        console.error('faucet request failed:', error);
        const response = {
            success: false,
            error: error instanceof Error ? error.message : 'transaction failed'
        };
        // log failed request
        await (0, historyService_1.logRequest)({
            walletAddress,
            amount,
            source: 'frontend',
            ip: realIP,
            success: false,
            error: response.error
        });
        (0, logger_1.logFaucetRequest)({
            timestamp: new Date(),
            ip: realIP,
            walletAddress,
            action: 'faucet_request',
            success: false,
            error: response.error
        });
        res.status(500).json(response);
    }
});
router.get('/balance/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const validation = (0, suiService_1.validateWalletAddress)(address);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                error: validation.error
            });
        }
        const balance = await (0, suiService_1.getUserBalance)(address);
        res.json({
            success: true,
            balance: balance
        });
    }
    catch (error) {
        console.error('balance check failed:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'balance check failed'
        });
    }
});
router.get('/status', async (req, res) => {
    try {
        const { walletAddress } = req.query;
        if (walletAddress && typeof walletAddress === 'string') {
            const validation = (0, suiService_1.validateWalletAddress)(walletAddress);
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    error: validation.error
                });
            }
            const rateLimitInfo = await (0, rateLimiter_1.checkRateLimit)(req.ip || 'unknown', walletAddress);
            return res.json({
                success: true,
                walletValid: true,
                rateLimit: rateLimitInfo
            });
        }
        res.json({
            success: true,
            message: 'faucet is operational'
        });
    }
    catch (error) {
        console.error('status check failed:', error);
        res.status(500).json({
            success: false,
            error: 'status check failed'
        });
    }
});
exports.default = router;
//# sourceMappingURL=faucet.js.map
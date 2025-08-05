"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiKeyAuth_1 = require("../middleware/apiKeyAuth");
const apiKeyService_1 = require("../services/apiKeyService");
const rateLimiter_1 = require("../services/rateLimiter");
const suiService_1 = require("../services/suiService");
const historyService_1 = require("../services/historyService");
const router = (0, express_1.Router)();
// api faucet request (no captcha)
router.post('/v1/faucet/request', apiKeyAuth_1.apiKeyAuth, async (req, res) => {
    const ip = req.ip ||
        req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        'unknown';
    const realIP = Array.isArray(ip) ? ip[0] : ip;
    try {
        const { walletAddress, amount } = req.body;
        const app = req.apiApp;
        if (!walletAddress || !amount) {
            await (0, apiKeyService_1.logApiUsage)(app.id, '/v1/faucet/request', realIP, false, 'missing parameters');
            return res.status(400).json({
                success: false,
                error: 'wallet address and amount required'
            });
        }
        // check rate limits (same as frontend)
        const rateLimitInfo = await (0, rateLimiter_1.checkRateLimit)(realIP, walletAddress);
        if (rateLimitInfo.blocked) {
            await (0, apiKeyService_1.logApiUsage)(app.id, '/v1/faucet/request', realIP, false, 'rate limit exceeded');
            return res.status(429).json({
                success: false,
                error: 'rate limit exceeded'
            });
        }
        // consume rate limit
        await (0, rateLimiter_1.consumeRateLimit)(realIP, walletAddress);
        // send tokens (same as frontend)
        const txHash = await (0, suiService_1.sendTokens)(walletAddress, amount);
        // log successful request
        await (0, historyService_1.logRequest)({
            walletAddress,
            amount,
            source: 'api',
            ip: realIP,
            success: true,
            txHash
        });
        await (0, apiKeyService_1.logApiUsage)(app.id, '/v1/faucet/request', realIP, true);
        res.json({
            success: true,
            data: {
                txHash,
                message: `${amount} SUI sent successfully`
            }
        });
    }
    catch (error) {
        console.error('api faucet request error:', error);
        const app = req.apiApp;
        await (0, apiKeyService_1.logApiUsage)(app.id, '/v1/faucet/request', realIP, false, error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'failed to process faucet request'
        });
    }
});
// api balance check
router.get('/v1/faucet/balance/:address', apiKeyAuth_1.apiKeyAuth, async (req, res) => {
    const ip = req.ip ||
        req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        'unknown';
    const realIP = Array.isArray(ip) ? ip[0] : ip;
    try {
        const { address } = req.params;
        const app = req.apiApp;
        const balance = await (0, suiService_1.getUserBalance)(address);
        await (0, apiKeyService_1.logApiUsage)(app.id, '/v1/faucet/balance', realIP, true);
        res.json({
            success: true,
            data: { balance }
        });
    }
    catch (error) {
        console.error('api balance check error:', error);
        const app = req.apiApp;
        await (0, apiKeyService_1.logApiUsage)(app.id, '/v1/faucet/balance', realIP, false, error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'failed to check balance'
        });
    }
});
exports.default = router;
//# sourceMappingURL=apiFaucet.js.map
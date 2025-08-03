"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const discordRateLimiter_1 = require("../services/discordRateLimiter");
const suiService_1 = require("../services/suiService");
const historyService_1 = require("../services/historyService");
const discordRoleService_1 = require("../services/discordRoleService");
const router = (0, express_1.Router)();
router.use(auth_1.apiKeyAuth);
// Fucet request endpoint
router.post('/faucet/request', async (req, res) => {
    try {
        const { walletAddress, amount, discordUserId } = req.body;
        if (!walletAddress || !amount || !discordUserId) {
            return res.status(400).json({
                success: false,
                error: 'missing required fields'
            });
        }
        const discordUserIdStr = String(discordUserId);
        const discordRateLimitInfo = await (0, discordRateLimiter_1.checkDiscordRateLimit)(discordUserIdStr, walletAddress);
        if (discordRateLimitInfo.blocked) {
            await (0, historyService_1.logRequest)({
                walletAddress,
                amount,
                source: 'discord',
                discordUserId: discordUserIdStr,
                ip: 'discord-bot',
                success: false,
                error: 'discord rate limit exceeded',
                rateLimitInfo: discordRateLimitInfo
            });
            return res.status(429).json({
                success: false,
                error: 'rate limit exceeded',
                rateLimit: discordRateLimitInfo
            });
        }
        await (0, discordRateLimiter_1.consumeDiscordRateLimit)(discordUserIdStr, walletAddress);
        const txHash = await (0, suiService_1.sendTokens)(walletAddress, amount);
        await (0, historyService_1.logRequest)({
            walletAddress,
            amount,
            source: 'discord',
            discordUserId: discordUserIdStr,
            ip: 'discord-bot',
            txHash,
            success: true
        });
        res.json({
            success: true,
            message: 'tokens sent successfully',
            txHash,
            amount
        });
    }
    catch (error) {
        console.error('discord faucet request failed:', error);
        await (0, historyService_1.logRequest)({
            walletAddress: req.body.walletAddress,
            amount: req.body.amount,
            source: 'discord',
            discordUserId: String(req.body.discordUserId),
            ip: 'discord-bot',
            success: false,
            error: error instanceof Error ? error.message : 'transaction failed'
        });
        res.status(500).json({
            success: false,
            error: 'internal server error'
        });
    }
});
// Balance check endpoint
router.get('/faucet/balance/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const balance = await (0, suiService_1.getUserBalance)(address);
        res.json({
            success: true,
            balance
        });
    }
    catch (error) {
        console.error('balance check failed:', error);
        res.status(500).json({
            success: false,
            error: 'failed to get balance'
        });
    }
});
// Status endpoint
router.get('/faucet/status', async (req, res) => {
    try {
        const { discordUserId } = req.query;
        if (discordUserId) {
            const discordUserIdStr = String(discordUserId);
            const walletAddress = req.query.walletAddress;
            if (walletAddress) {
                const discordRateLimitInfo = await (0, discordRateLimiter_1.checkDiscordRateLimit)(discordUserIdStr, walletAddress);
                res.json({
                    success: true,
                    discordRateLimit: discordRateLimitInfo,
                    walletValid: true
                });
            }
            else {
                // Discord-only status
                const discordRateLimitInfo = await (0, discordRateLimiter_1.checkDiscordRateLimit)(discordUserIdStr, '');
                res.json({
                    success: true,
                    discordRateLimit: discordRateLimitInfo,
                    walletValid: true
                });
            }
        }
        else {
            // General status
            res.json({
                success: true,
                message: 'faucet is operational',
                walletValid: true
            });
        }
    }
    catch (error) {
        console.error('status check failed:', error);
        res.status(500).json({
            success: false,
            error: 'failed to get status'
        });
    }
});
router.get('/roles/:guildId', async (req, res) => {
    try {
        const { guildId } = req.params;
        const config = await (0, discordRoleService_1.getRoleConfig)(guildId);
        if (config) {
            res.json({
                success: true,
                config
            });
        }
        else {
            res.status(404).json({
                success: false,
                error: 'role configuration not found'
            });
        }
    }
    catch (error) {
        console.error('Failed to get role config:', error);
        res.status(500).json({
            success: false,
            error: 'failed to get role configuration'
        });
    }
});
router.post('/roles/:guildId', async (req, res) => {
    try {
        const { guildId } = req.params;
        const { adminRoleId, modRoleId } = req.body;
        const success = await (0, discordRoleService_1.setRoleConfig)(guildId, adminRoleId, modRoleId);
        if (success) {
            res.json({
                success: true,
                message: 'role configuration updated successfully'
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: 'failed to update role configuration'
            });
        }
    }
    catch (error) {
        console.error('Failed to set role config:', error);
        res.status(500).json({
            success: false,
            error: 'failed to update role configuration'
        });
    }
});
exports.default = router;
//# sourceMappingURL=discord.js.map
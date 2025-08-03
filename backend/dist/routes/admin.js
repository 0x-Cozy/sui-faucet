"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const historyService_1 = require("../services/historyService");
const adminHistoryService_1 = require("../services/adminHistoryService");
const botStateService_1 = require("../services/botStateService");
const restrictionService_1 = require("../services/restrictionService");
const config_1 = require("../utils/config");
const router = (0, express_1.Router)();
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (username === 'admin' && password === config_1.config.admin.token) {
            const token = (0, auth_1.generateAdminToken)(username);
            res.json({
                success: true,
                token,
                user: {
                    id: 'admin',
                    username,
                    role: 'admin'
                }
            });
        }
        else {
            res.status(401).json({
                success: false,
                error: 'invalid credentials'
            });
        }
    }
    catch (error) {
        console.error('Admin login failed:', error);
        res.status(500).json({
            success: false,
            error: 'login failed'
        });
    }
});
router.use(auth_1.adminAuth);
router.get('/stats', async (req, res) => {
    try {
        const stats = await (0, historyService_1.getBotStats)();
        res.json({
            success: true,
            stats
        });
    }
    catch (error) {
        console.error('Failed to get bot stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get bot statistics'
        });
    }
});
// admin transaction routes
router.get('/transactions/recent', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const source = req.query.source;
        const recentActivity = await (0, adminHistoryService_1.getAdminRecentActivity)(limit, source);
        res.json({
            success: true,
            recentActivity
        });
    }
    catch (error) {
        console.error('Failed to get admin recent activity:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get admin recent activity'
        });
    }
});
router.get('/transactions/user/:discordUserId', async (req, res) => {
    try {
        const { discordUserId } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const history = await (0, adminHistoryService_1.getAdminUserHistory)(discordUserId, limit);
        res.json({
            success: true,
            history
        });
    }
    catch (error) {
        console.error('Failed to get admin user history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get admin user history'
        });
    }
});
router.get('/transactions/wallet/:walletAddress', async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const history = await (0, adminHistoryService_1.getAdminWalletHistory)(walletAddress, limit);
        res.json({
            success: true,
            history
        });
    }
    catch (error) {
        console.error('Failed to get admin wallet history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get admin wallet history'
        });
    }
});
router.get('/transactions/stats', async (req, res) => {
    try {
        const stats = await (0, adminHistoryService_1.getAdminTransactionStats)();
        res.json({
            success: true,
            stats
        });
    }
    catch (error) {
        console.error('Failed to get admin transaction stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get admin transaction statistics'
        });
    }
});
// existing discord bot routes (keeping for discord bot compatibility)
router.get('/user/:discordUserId', async (req, res) => {
    try {
        const { discordUserId } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const history = await (0, historyService_1.getUserHistory)(discordUserId, limit);
        res.json({
            success: true,
            history
        });
    }
    catch (error) {
        console.error('Failed to get user history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get user history'
        });
    }
});
router.get('/wallet/:walletAddress', async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const history = await (0, historyService_1.getWalletHistory)(walletAddress, limit);
        res.json({
            success: true,
            history
        });
    }
    catch (error) {
        console.error('Failed to get wallet history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get wallet history'
        });
    }
});
router.get('/recent', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const source = req.query.source;
        const recentActivity = await (0, historyService_1.getRecentActivity)(limit, source);
        res.json({
            success: true,
            recentActivity
        });
    }
    catch (error) {
        console.error('Failed to get recent activity:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get recent activity'
        });
    }
});
// bot state management
router.get('/bot/status', async (req, res) => {
    try {
        const status = await (0, botStateService_1.getBotStatus)();
        res.json({
            success: true,
            status
        });
    }
    catch (error) {
        console.error('Failed to get bot status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get bot status'
        });
    }
});
router.post('/bot/pause', async (req, res) => {
    try {
        const { reason = 'No reason provided' } = req.body;
        const pausedBy = req.admin?.username || 'unknown';
        const success = await (0, botStateService_1.pauseBot)(reason, pausedBy);
        if (success) {
            res.json({
                success: true,
                message: 'Bot paused successfully'
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: 'Failed to pause bot'
            });
        }
    }
    catch (error) {
        console.error('Failed to pause bot:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to pause bot'
        });
    }
});
router.post('/bot/unpause', async (req, res) => {
    try {
        const unpausedBy = req.admin?.username || 'unknown';
        const success = await (0, botStateService_1.unpauseBot)(unpausedBy);
        if (success) {
            res.json({
                success: true,
                message: 'Bot unpaused successfully'
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: 'Failed to unpause bot'
            });
        }
    }
    catch (error) {
        console.error('Failed to unpause bot:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to unpause bot'
        });
    }
});
// restriction management
router.post('/restrict/discord', async (req, res) => {
    try {
        const { discordUserId, reason, duration } = req.body;
        const restrictedBy = req.admin?.username || 'unknown';
        if (!discordUserId || !reason) {
            return res.status(400).json({
                success: false,
                error: 'discordUserId and reason are required'
            });
        }
        const success = await (0, restrictionService_1.restrictDiscordUser)(discordUserId, reason, restrictedBy, duration);
        if (success) {
            res.json({
                success: true,
                message: 'Discord user restricted successfully'
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: 'Failed to restrict Discord user'
            });
        }
    }
    catch (error) {
        console.error('Failed to restrict Discord user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to restrict Discord user'
        });
    }
});
router.post('/unrestrict/discord', async (req, res) => {
    try {
        const { discordUserId } = req.body;
        const unrestrictedBy = req.admin?.username || 'unknown';
        if (!discordUserId) {
            return res.status(400).json({
                success: false,
                error: 'discordUserId is required'
            });
        }
        const success = await (0, restrictionService_1.unrestrictDiscordUser)(discordUserId);
        if (success) {
            res.json({
                success: true,
                message: 'Discord user unrestricted successfully'
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: 'Failed to unrestrict Discord user'
            });
        }
    }
    catch (error) {
        console.error('Failed to unrestrict Discord user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to unrestrict Discord user'
        });
    }
});
router.get('/restrict/discord/:discordUserId', async (req, res) => {
    try {
        const { discordUserId } = req.params;
        const restrictionInfo = await (0, restrictionService_1.isDiscordUserRestricted)(discordUserId);
        res.json({
            success: true,
            restrictionInfo
        });
    }
    catch (error) {
        console.error('Failed to get Discord user restriction:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get Discord user restriction'
        });
    }
});
router.post('/restrict/ip', async (req, res) => {
    try {
        const { ip, reason, duration } = req.body;
        const restrictedBy = req.admin?.username || 'unknown';
        if (!ip || !reason) {
            return res.status(400).json({
                success: false,
                error: 'ip and reason are required'
            });
        }
        const success = await (0, restrictionService_1.restrictIP)(ip, reason, restrictedBy, duration);
        if (success) {
            res.json({
                success: true,
                message: 'IP restricted successfully'
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: 'Failed to restrict IP'
            });
        }
    }
    catch (error) {
        console.error('Failed to restrict IP:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to restrict IP'
        });
    }
});
router.post('/unrestrict/ip', async (req, res) => {
    try {
        const { ip } = req.body;
        const unrestrictedBy = req.admin?.username || 'unknown';
        if (!ip) {
            return res.status(400).json({
                success: false,
                error: 'ip is required'
            });
        }
        const success = await (0, restrictionService_1.unrestrictIP)(ip);
        if (success) {
            res.json({
                success: true,
                message: 'IP unrestricted successfully'
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: 'Failed to unrestrict IP'
            });
        }
    }
    catch (error) {
        console.error('Failed to unrestrict IP:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to unrestrict IP'
        });
    }
});
router.get('/restrict/ip/:ip', async (req, res) => {
    try {
        const { ip } = req.params;
        const restrictionInfo = await (0, restrictionService_1.isIPRestricted)(ip);
        res.json({
            success: true,
            restrictionInfo
        });
    }
    catch (error) {
        console.error('Failed to get IP restriction:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get IP restriction'
        });
    }
});
router.post('/restrict/wallet', async (req, res) => {
    try {
        const { walletAddress, reason, duration } = req.body;
        const restrictedBy = req.admin?.username || 'unknown';
        if (!walletAddress || !reason) {
            return res.status(400).json({
                success: false,
                error: 'walletAddress and reason are required'
            });
        }
        const success = await (0, restrictionService_1.restrictWallet)(walletAddress, reason, restrictedBy, duration);
        if (success) {
            res.json({
                success: true,
                message: 'Wallet restricted successfully'
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: 'Failed to restrict wallet'
            });
        }
    }
    catch (error) {
        console.error('Failed to restrict wallet:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to restrict wallet'
        });
    }
});
router.post('/unrestrict/wallet', async (req, res) => {
    try {
        const { walletAddress } = req.body;
        const unrestrictedBy = req.admin?.username || 'unknown';
        if (!walletAddress) {
            return res.status(400).json({
                success: false,
                error: 'walletAddress is required'
            });
        }
        const success = await (0, restrictionService_1.unrestrictWallet)(walletAddress);
        if (success) {
            res.json({
                success: true,
                message: 'Wallet unrestricted successfully'
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: 'Failed to unrestrict wallet'
            });
        }
    }
    catch (error) {
        console.error('Failed to unrestrict wallet:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to unrestrict wallet'
        });
    }
});
router.get('/restrict/wallet/:walletAddress', async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const restrictionInfo = await (0, restrictionService_1.isWalletRestricted)(walletAddress);
        res.json({
            success: true,
            restrictionInfo
        });
    }
    catch (error) {
        console.error('Failed to get wallet restriction:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get wallet restriction'
        });
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map
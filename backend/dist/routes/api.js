"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiKeyService_1 = require("../services/apiKeyService");
const router = (0, express_1.Router)();
// create new api app
router.post('/apps/create', async (req, res) => {
    try {
        const { walletAddress, name, description } = req.body;
        if (!walletAddress || !name) {
            return res.status(400).json({
                success: false,
                error: 'wallet address and name required'
            });
        }
        const app = await (0, apiKeyService_1.createApiApp)(walletAddress, name, description);
        res.json({
            success: true,
            data: app
        });
    }
    catch (error) {
        console.error('create api app error:', error);
        res.status(500).json({
            success: false,
            error: 'failed to create api app'
        });
    }
});
// get user's api apps
router.get('/apps/list/:walletAddress', async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const apps = await (0, apiKeyService_1.getUserApps)(walletAddress);
        res.json({
            success: true,
            data: apps
        });
    }
    catch (error) {
        console.error('get user apps error:', error);
        res.status(500).json({
            success: false,
            error: 'failed to get user apps'
        });
    }
});
// delete api app
router.delete('/apps/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { walletAddress } = req.body;
        if (!walletAddress) {
            return res.status(400).json({
                success: false,
                error: 'wallet address required'
            });
        }
        const result = await (0, apiKeyService_1.deleteApiApp)(id, walletAddress);
        if (result.count === 0) {
            return res.status(404).json({
                success: false,
                error: 'app not found'
            });
        }
        res.json({
            success: true,
            message: 'app deleted successfully'
        });
    }
    catch (error) {
        console.error('delete api app error:', error);
        res.status(500).json({
            success: false,
            error: 'failed to delete api app'
        });
    }
});
// get app usage statistics
router.get('/apps/:id/stats', async (req, res) => {
    try {
        const { id } = req.params;
        const stats = await (0, apiKeyService_1.getAppStats)(id);
        res.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        console.error('get app stats error:', error);
        res.status(500).json({
            success: false,
            error: 'failed to get app stats'
        });
    }
});
exports.default = router;
//# sourceMappingURL=api.js.map
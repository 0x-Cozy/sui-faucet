"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const refundService_1 = require("../services/refundService");
const suiService_1 = require("../services/suiService");
const router = (0, express_1.Router)();
// Log a refund (public endpoint)
router.post('/log', async (req, res) => {
    try {
        const { walletAddress, amount, refundedBy, txHash } = req.body;
        if (!walletAddress || !amount || !refundedBy) {
            return res.status(400).json({
                success: false,
                error: 'wallet address, amount, and refundedBy are required'
            });
        }
        // Validate wallet address
        const validation = (0, suiService_1.validateWalletAddress)(walletAddress);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                error: validation.error
            });
        }
        // Validate amount
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'amount must be a positive number'
            });
        }
        const refundRecord = await (0, refundService_1.logRefund)({
            walletAddress,
            amount,
            refundedBy,
            txHash
        });
        if (refundRecord) {
            res.json({
                success: true,
                message: 'refund logged successfully',
                refundId: refundRecord.id
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: 'failed to log refund'
            });
        }
    }
    catch (error) {
        console.error('Failed to log refund:', error);
        res.status(500).json({
            success: false,
            error: 'internal server error'
        });
    }
});
// Get refunds by wallet address
router.get('/wallet/:walletAddress', async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const refunds = await (0, refundService_1.getRefundsByWallet)(walletAddress);
        res.json({
            success: true,
            refunds
        });
    }
    catch (error) {
        console.error('Failed to get refunds by wallet:', error);
        res.status(500).json({
            success: false,
            error: 'internal server error'
        });
    }
});
router.get('/user/:refundedBy', async (req, res) => {
    try {
        const { refundedBy } = req.params;
        const refunds = await (0, refundService_1.getRefundsByUser)(refundedBy);
        res.json({
            success: true,
            refunds
        });
    }
    catch (error) {
        console.error('Failed to get refunds by user:', error);
        res.status(500).json({
            success: false,
            error: 'internal server error'
        });
    }
});
// Admin routes
router.use(auth_1.adminAuth);
router.get('/stats', async (req, res) => {
    try {
        const stats = await (0, refundService_1.getRefundStats)();
        res.json({
            success: true,
            stats
        });
    }
    catch (error) {
        console.error('Failed to get refund stats:', error);
        res.status(500).json({
            success: false,
            error: 'internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=refund.js.map
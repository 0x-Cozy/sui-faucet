"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWallet = void 0;
const suiService_1 = require("../services/suiService");
const validateWallet = (req, res, next) => {
    const { walletAddress } = req.body;
    if (!walletAddress) {
        res.status(400).json({
            success: false,
            error: 'wallet address is required'
        });
        return;
    }
    const validation = (0, suiService_1.validateWalletAddress)(walletAddress);
    if (!validation.isValid) {
        res.status(400).json({
            success: false,
            error: validation.error || 'invalid wallet address'
        });
        return;
    }
    next();
};
exports.validateWallet = validateWallet;
//# sourceMappingURL=validateWallet.js.map
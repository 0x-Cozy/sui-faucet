"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestHistory = void 0;
const mongoose_1 = require("mongoose");
const RequestHistorySchema = new mongoose_1.Schema({
    walletAddress: {
        type: String,
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true
    },
    source: {
        type: String,
        enum: ['frontend', 'discord'],
        required: true
    },
    discordUserId: {
        type: String,
        required: false,
        index: true
    },
    ip: {
        type: String,
        required: false
    },
    txHash: {
        type: String,
        required: false
    },
    success: {
        type: Boolean,
        required: true
    },
    error: {
        type: String,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    rateLimitInfo: {
        remaining: Number,
        resetTime: Number,
        blocked: Boolean
    }
});
//index for better query performance
RequestHistorySchema.index({ walletAddress: 1, timestamp: -1 });
RequestHistorySchema.index({ discordUserId: 1, timestamp: -1 });
RequestHistorySchema.index({ source: 1, timestamp: -1 });
RequestHistorySchema.index({ success: 1, timestamp: -1 });
exports.RequestHistory = (0, mongoose_1.model)('RequestHistory', RequestHistorySchema);
//# sourceMappingURL=RequestHistory.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefundStats = exports.getRefundsByUser = exports.getRefundsByWallet = exports.logRefund = void 0;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("./logger"));
const prisma = new client_1.PrismaClient();
const logRefund = async (data) => {
    try {
        const refundRecord = await prisma.refundRequest.create({
            data: {
                walletAddress: data.walletAddress,
                amount: data.amount,
                refundedBy: data.refundedBy,
                txHash: data.txHash
            }
        });
        logger_1.default.info(`Refund logged: ${refundRecord.id} for ${data.walletAddress} by ${data.refundedBy}`);
        return refundRecord;
    }
    catch (error) {
        logger_1.default.error('Failed to log refund:', error);
        return null;
    }
};
exports.logRefund = logRefund;
const getRefundsByWallet = async (walletAddress) => {
    try {
        const refunds = await prisma.refundRequest.findMany({
            where: { walletAddress },
            orderBy: { createdAt: 'desc' }
        });
        return refunds;
    }
    catch (error) {
        logger_1.default.error('Failed to get refunds by wallet:', error);
        return [];
    }
};
exports.getRefundsByWallet = getRefundsByWallet;
const getRefundsByUser = async (refundedBy) => {
    try {
        const refunds = await prisma.refundRequest.findMany({
            where: { refundedBy },
            orderBy: { createdAt: 'desc' }
        });
        return refunds;
    }
    catch (error) {
        logger_1.default.error('Failed to get refunds by user:', error);
        return [];
    }
};
exports.getRefundsByUser = getRefundsByUser;
const getRefundStats = async () => {
    try {
        const [totalRefunds, totalAmount, uniqueWallets, uniqueUsers] = await Promise.all([
            prisma.refundRequest.count(),
            prisma.refundRequest.aggregate({
                _sum: { amount: true }
            }),
            prisma.refundRequest.groupBy({
                by: ['walletAddress'],
                _count: { walletAddress: true }
            }),
            prisma.refundRequest.groupBy({
                by: ['refundedBy'],
                _count: { refundedBy: true }
            })
        ]);
        return {
            totalRefunds,
            totalAmount: totalAmount._sum.amount || 0,
            uniqueWallets: uniqueWallets.length,
            uniqueUsers: uniqueUsers.length
        };
    }
    catch (error) {
        logger_1.default.error('Failed to get refund stats:', error);
        return {
            totalRefunds: 0,
            totalAmount: 0,
            uniqueWallets: 0,
            uniqueUsers: 0
        };
    }
};
exports.getRefundStats = getRefundStats;
//# sourceMappingURL=refundService.js.map
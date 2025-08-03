"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminTransactionStats = exports.getAdminRecentActivity = exports.getAdminWalletHistory = exports.getAdminUserHistory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAdminUserHistory = async (discordUserId, limit = 10) => {
    try {
        const history = await prisma.requestHistory.findMany({
            where: {
                discordUserId: discordUserId
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        });
        return history.map(record => ({
            ...record,
            rateLimitInfo: record.rateLimitInfo ? JSON.parse(record.rateLimitInfo) : null
        }));
    }
    catch (error) {
        console.error('Failed to get admin user history:', error);
        return [];
    }
};
exports.getAdminUserHistory = getAdminUserHistory;
const getAdminWalletHistory = async (walletAddress, limit = 10) => {
    try {
        const history = await prisma.requestHistory.findMany({
            where: {
                walletAddress: walletAddress
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        });
        return history.map(record => ({
            ...record,
            rateLimitInfo: record.rateLimitInfo ? JSON.parse(record.rateLimitInfo) : null
        }));
    }
    catch (error) {
        console.error('Failed to get admin wallet history:', error);
        return [];
    }
};
exports.getAdminWalletHistory = getAdminWalletHistory;
const getAdminRecentActivity = async (limit = 20, source) => {
    try {
        const whereClause = {};
        if (source && ['frontend', 'discord'].includes(source)) {
            whereClause.source = source;
        }
        const recentActivity = await prisma.requestHistory.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            take: limit,
            select: {
                walletAddress: true,
                amount: true,
                source: true,
                success: true,
                createdAt: true,
                discordUserId: true,
                txHash: true,
                ip: true,
                error: true
            }
        });
        return recentActivity;
    }
    catch (error) {
        console.error('Failed to get admin recent activity:', error);
        return [];
    }
};
exports.getAdminRecentActivity = getAdminRecentActivity;
const getAdminTransactionStats = async () => {
    try {
        const [totalTransactions, successfulTransactions, failedTransactions, uniqueWallets, uniqueDiscordUsers] = await Promise.all([
            prisma.requestHistory.count(),
            prisma.requestHistory.count({ where: { success: true } }),
            prisma.requestHistory.count({ where: { success: false } }),
            prisma.requestHistory.groupBy({
                by: ['walletAddress'],
                _count: { walletAddress: true }
            }),
            prisma.requestHistory.groupBy({
                by: ['discordUserId'],
                where: { discordUserId: { not: null } },
                _count: { discordUserId: true }
            })
        ]);
        const totalTokensSent = await prisma.requestHistory.aggregate({
            where: { success: true },
            _sum: { amount: true }
        });
        const recentTransactions = await prisma.requestHistory.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                walletAddress: true,
                amount: true,
                source: true,
                success: true,
                createdAt: true,
                txHash: true
            }
        });
        return {
            totalTransactions,
            successfulTransactions,
            failedTransactions,
            uniqueWallets: uniqueWallets.length,
            uniqueDiscordUsers: uniqueDiscordUsers.length,
            totalTokensSent: totalTokensSent._sum.amount || 0,
            recentTransactions
        };
    }
    catch (error) {
        console.error('Failed to get admin transaction stats:', error);
        return {
            totalTransactions: 0,
            successfulTransactions: 0,
            failedTransactions: 0,
            uniqueWallets: 0,
            uniqueDiscordUsers: 0,
            totalTokensSent: 0,
            recentTransactions: []
        };
    }
};
exports.getAdminTransactionStats = getAdminTransactionStats;
//# sourceMappingURL=adminHistoryService.js.map
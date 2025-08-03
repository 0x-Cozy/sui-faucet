"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentActivity = exports.getRestrictedUsers = exports.getBotStats = exports.getWalletHistory = exports.getUserHistory = exports.logRequest = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const logRequest = async (data) => {
    try {
        await prisma.requestHistory.create({
            data: {
                walletAddress: data.walletAddress,
                amount: data.amount,
                source: data.source,
                discordUserId: data.discordUserId,
                ip: data.ip,
                txHash: data.txHash,
                success: data.success,
                error: data.error,
                rateLimitInfo: data.rateLimitInfo ? JSON.stringify(data.rateLimitInfo) : null
            }
        });
    }
    catch (error) {
        console.error('Failed to log request history:', error);
    }
};
exports.logRequest = logRequest;
const getUserHistory = async (discordUserId, limit = 10) => {
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
        console.error('Failed to get user history:', error);
        return [];
    }
};
exports.getUserHistory = getUserHistory;
const getWalletHistory = async (walletAddress, limit = 10) => {
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
        console.error('Failed to get wallet history:', error);
        return [];
    }
};
exports.getWalletHistory = getWalletHistory;
const getBotStats = async () => {
    try {
        const [totalRequests, successfulRequests, failedRequests, uniqueWallets, uniqueDiscordUsers] = await Promise.all([
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
        const recentActivity = await prisma.requestHistory.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                walletAddress: true,
                amount: true,
                source: true,
                success: true,
                createdAt: true
            }
        });
        return {
            totalRequests,
            successfulRequests,
            failedRequests,
            uniqueWallets: uniqueWallets.length,
            uniqueDiscordUsers: uniqueDiscordUsers.length,
            totalTokensSent: totalTokensSent._sum.amount || 0,
            recentActivity
        };
    }
    catch (error) {
        console.error('Failed to get bot stats:', error);
        return {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            uniqueWallets: 0,
            uniqueDiscordUsers: 0,
            totalTokensSent: 0,
            recentActivity: []
        };
    }
};
exports.getBotStats = getBotStats;
const getRestrictedUsers = async () => {
    try {
        const failedUsers = await prisma.requestHistory.groupBy({
            by: ['discordUserId'],
            where: {
                discordUserId: { not: null },
                success: false,
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // last 24 hours
                }
            },
            _count: { id: true },
            having: {
                id: {
                    _count: {
                        gte: 3 // 3 or more failed requests
                    }
                }
            }
        });
        return failedUsers.map(user => user.discordUserId);
    }
    catch (error) {
        console.error('Failed to get restricted users:', error);
        return [];
    }
};
exports.getRestrictedUsers = getRestrictedUsers;
const getRecentActivity = async (limit = 20, source) => {
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
                txHash: true
            }
        });
        return recentActivity;
    }
    catch (error) {
        console.error('Failed to get recent activity:', error);
        return [];
    }
};
exports.getRecentActivity = getRecentActivity;
//# sourceMappingURL=historyService.js.map
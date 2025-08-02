import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AdminTransactionData {
  walletAddress: string;
  amount: number;
  source: 'frontend' | 'discord';
  discordUserId?: string;
  ip?: string;
  txHash?: string;
  success: boolean;
  error?: string;
  rateLimitInfo?: {
    remaining: number;
    resetTime: number;
    blocked: boolean;
  };
}

export const getAdminUserHistory = async (discordUserId: string, limit: number = 10): Promise<any[]> => {
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
  } catch (error) {
    console.error('Failed to get admin user history:', error);
    return [];
  }
};

export const getAdminWalletHistory = async (walletAddress: string, limit: number = 10): Promise<any[]> => {
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
  } catch (error) {
    console.error('Failed to get admin wallet history:', error);
    return [];
  }
};

export const getAdminRecentActivity = async (limit: number = 20, source?: string): Promise<any[]> => {
  try {
    const whereClause: any = {};
    
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
  } catch (error) {
    console.error('Failed to get admin recent activity:', error);
    return [];
  }
};

export const getAdminTransactionStats = async (): Promise<any> => {
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
  } catch (error) {
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
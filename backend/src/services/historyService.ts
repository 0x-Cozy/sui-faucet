import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface RequestHistoryData {
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

export const logRequest = async (data: RequestHistoryData): Promise<void> => {
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
  } catch (error) {
    console.error('Failed to log request history:', error);
  }
};

export const getUserHistory = async (discordUserId: string, limit: number = 10): Promise<any[]> => {
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
    console.error('Failed to get user history:', error);
    return [];
  }
};

export const getWalletHistory = async (walletAddress: string, limit: number = 10): Promise<any[]> => {
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
    console.error('Failed to get wallet history:', error);
    return [];
  }
};

export const getBotStats = async (): Promise<any> => {
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
  } catch (error) {
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

export const getRestrictedUsers = async (): Promise<string[]> => {
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

    return failedUsers.map(user => user.discordUserId!);
  } catch (error) {
    console.error('Failed to get restricted users:', error);
    return [];
  }
};

export const getRecentActivity = async (limit: number = 20, source?: string): Promise<any[]> => {
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
        txHash: true
      }
    });

    return recentActivity;
  } catch (error) {
    console.error('Failed to get recent activity:', error);
    return [];
  }
}; 
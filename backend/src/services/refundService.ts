import { PrismaClient } from '@prisma/client';
import logger from './logger';

const prisma = new PrismaClient();

export interface RefundData {
  walletAddress: string;
  amount: number;
  refundedBy: string;
  txHash?: string;
}

export interface RefundRecord {
  id: string;
  walletAddress: string;
  amount: number;
  refundedBy: string;
  txHash: string | null;
  createdAt: Date;
}

export const logRefund = async (data: RefundData): Promise<RefundRecord | null> => {
  try {
    const refundRecord = await prisma.refundRequest.create({
      data: {
        walletAddress: data.walletAddress,
        amount: data.amount,
        refundedBy: data.refundedBy,
        txHash: data.txHash
      }
    });

    logger.info(`Refund logged: ${refundRecord.id} for ${data.walletAddress} by ${data.refundedBy}`);
    return refundRecord;
  } catch (error) {
    logger.error('Failed to log refund:', error);
    return null;
  }
};

export const getRefundsByWallet = async (walletAddress: string): Promise<RefundRecord[]> => {
  try {
    const refunds = await prisma.refundRequest.findMany({
      where: { walletAddress },
      orderBy: { createdAt: 'desc' }
    });

    return refunds;
  } catch (error) {
    logger.error('Failed to get refunds by wallet:', error);
    return [];
  }
};

export const getRefundsByUser = async (refundedBy: string): Promise<RefundRecord[]> => {
  try {
    const refunds = await prisma.refundRequest.findMany({
      where: { refundedBy },
      orderBy: { createdAt: 'desc' }
    });

    return refunds;
  } catch (error) {
    logger.error('Failed to get refunds by user:', error);
    return [];
  }
};

export const getRefundStats = async (): Promise<any> => {
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
  } catch (error) {
    logger.error('Failed to get refund stats:', error);
    return {
      totalRefunds: 0,
      totalAmount: 0,
      uniqueWallets: 0,
      uniqueUsers: 0
    };
  }
}; 
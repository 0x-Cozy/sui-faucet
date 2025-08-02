import { Redis } from '@upstash/redis';
import { config } from '../utils/config';
import logger from './logger';

const redis = new Redis({
  url: config.redis.url,
  token: config.redis.token
});

const DISCORD_RESTRICTION_KEY = 'restriction:discord:';
const IP_RESTRICTION_KEY = 'restriction:ip:';
const WALLET_RESTRICTION_KEY = 'restriction:wallet:';

export interface RestrictionInfo {
  isRestricted: boolean;
  reason?: string;
  restrictedBy?: string;
  restrictedAt?: Date;
  expiresAt?: Date;
}

export const restrictDiscordUser = async (
  discordUserId: string,
  reason: string,
  restrictedBy: string,
  duration?: number // in seconds, undefined = permanent
): Promise<boolean> => {
  try {
    const now = new Date();
    const expiresAt = duration ? new Date(now.getTime() + duration * 1000) : undefined;
    
    const restrictionData = {
      reason,
      restrictedBy,
      restrictedAt: now.toISOString(),
      expiresAt: expiresAt?.toISOString()
    };

    const key = `${DISCORD_RESTRICTION_KEY}${discordUserId}`;
    
    if (duration) {
      await redis.setex(key, duration, JSON.stringify(restrictionData));
    } else {
      await redis.set(key, JSON.stringify(restrictionData));
    }

    logger.info(`Discord user ${discordUserId} restricted by ${restrictedBy} for reason: ${reason}`);
    return true;
  } catch (error) {
    logger.error('Failed to restrict Discord user:', error);
    return false;
  }
};

export const unrestrictDiscordUser = async (discordUserId: string): Promise<boolean> => {
  try {
    const key = `${DISCORD_RESTRICTION_KEY}${discordUserId}`;
    await redis.del(key);
    
    logger.info(`Discord user ${discordUserId} unrestricted`);
    return true;
  } catch (error) {
    logger.error('Failed to unrestrict Discord user:', error);
    return false;
  }
};

export const isDiscordUserRestricted = async (discordUserId: string): Promise<RestrictionInfo> => {
  try {
    const key = `${DISCORD_RESTRICTION_KEY}${discordUserId}`;
    const restrictionData = await redis.get(key);
    
    if (!restrictionData) {
      return { isRestricted: false };
    }

    //  handle both string and object responses from redis
    let data;
    if (typeof restrictionData === 'string') {
      data = JSON.parse(restrictionData);
    } else if (typeof restrictionData === 'object' && restrictionData !== null) {
      data = restrictionData;
    } else {
      return { isRestricted: false };
    }

    return {
      isRestricted: true,
      reason: data.reason,
      restrictedBy: data.restrictedBy,
      restrictedAt: new Date(data.restrictedAt),
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined
    };
  } catch (error) {
    logger.error('Failed to check Discord user restriction:', error);
    return { isRestricted: false };
  }
};

export const restrictIP = async (
  ip: string,
  reason: string,
  restrictedBy: string,
  duration?: number
): Promise<boolean> => {
  try {
    const now = new Date();
    const expiresAt = duration ? new Date(now.getTime() + duration * 1000) : undefined;
    
    const restrictionData = {
      reason,
      restrictedBy,
      restrictedAt: now.toISOString(),
      expiresAt: expiresAt?.toISOString()
    };

    const key = `${IP_RESTRICTION_KEY}${ip}`;
    
    if (duration) {
      await redis.setex(key, duration, JSON.stringify(restrictionData));
    } else {
      await redis.set(key, JSON.stringify(restrictionData));
    }

    logger.info(`IP ${ip} restricted by ${restrictedBy} for reason: ${reason}`);
    return true;
  } catch (error) {
    logger.error('Failed to restrict IP:', error);
    return false;
  }
};

export const unrestrictIP = async (ip: string): Promise<boolean> => {
  try {
    const key = `${IP_RESTRICTION_KEY}${ip}`;
    await redis.del(key);
    
    logger.info(`IP ${ip} unrestricted`);
    return true;
  } catch (error) {
    logger.error('Failed to unrestrict IP:', error);
    return false;
  }
};

export const isIPRestricted = async (ip: string): Promise<RestrictionInfo> => {
  try {
    const key = `${IP_RESTRICTION_KEY}${ip}`;
    const restrictionData = await redis.get(key);
    
    if (!restrictionData) {
      return { isRestricted: false };
    }

    let data;
    if (typeof restrictionData === 'string') {
      data = JSON.parse(restrictionData);
    } else if (typeof restrictionData === 'object' && restrictionData !== null) {
      data = restrictionData;
    } else {
      return { isRestricted: false };
    }

    return {
      isRestricted: true,
      reason: data.reason,
      restrictedBy: data.restrictedBy,
      restrictedAt: new Date(data.restrictedAt),
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined
    };
  } catch (error) {
    logger.error('Failed to check IP restriction:', error);
    return { isRestricted: false };
  }
};

export const restrictWallet = async (
  walletAddress: string,
  reason: string,
  restrictedBy: string,
  duration?: number
): Promise<boolean> => {
  try {
    const now = new Date();
    const expiresAt = duration ? new Date(now.getTime() + duration * 1000) : undefined;
    
    const restrictionData = {
      reason,
      restrictedBy,
      restrictedAt: now.toISOString(),
      expiresAt: expiresAt?.toISOString()
    };

    const key = `${WALLET_RESTRICTION_KEY}${walletAddress}`;
    
    if (duration) {
      await redis.setex(key, duration, JSON.stringify(restrictionData));
    } else {
      await redis.set(key, JSON.stringify(restrictionData));
    }

    logger.info(`Wallet ${walletAddress} restricted by ${restrictedBy} for reason: ${reason}`);
    return true;
  } catch (error) {
    logger.error('Failed to restrict wallet:', error);
    return false;
  }
};

export const unrestrictWallet = async (walletAddress: string): Promise<boolean> => {
  try {
    const key = `${WALLET_RESTRICTION_KEY}${walletAddress}`;
    await redis.del(key);
    
    logger.info(`Wallet ${walletAddress} unrestricted`);
    return true;
  } catch (error) {
    logger.error('Failed to unrestrict wallet:', error);
    return false;
  }
};

export const isWalletRestricted = async (walletAddress: string): Promise<RestrictionInfo> => {
  try {
    const key = `${WALLET_RESTRICTION_KEY}${walletAddress}`;
    const restrictionData = await redis.get(key);
    
    if (!restrictionData) {
      return { isRestricted: false };
    }

    let data;
    if (typeof restrictionData === 'string') {
      data = JSON.parse(restrictionData);
    } else if (typeof restrictionData === 'object' && restrictionData !== null) {
      data = restrictionData;
    } else {
      return { isRestricted: false };
    }

    return {
      isRestricted: true,
      reason: data.reason,
      restrictedBy: data.restrictedBy,
      restrictedAt: new Date(data.restrictedAt),
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined
    };
  } catch (error) {
    logger.error('Failed to check wallet restriction:', error);
    return { isRestricted: false };
  }
}; 
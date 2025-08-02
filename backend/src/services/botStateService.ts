import { Redis } from '@upstash/redis';
import { config } from '../utils/config';
import logger from './logger';

const redis = new Redis({
  url: config.redis.url,
  token: config.redis.token
});

const BOT_STATUS_KEY = 'bot:status';
const BOT_PAUSE_REASON_KEY = 'bot:pause_reason';
const BOT_PAUSE_BY_KEY = 'bot:pause_by';
const BOT_PAUSE_TIME_KEY = 'bot:pause_time';

export interface BotStatus {
  isPaused: boolean;
  pauseReason?: string;
  pausedBy?: string;
  pausedAt?: Date;
}

export const getBotStatus = async (): Promise<BotStatus> => {
  try {
    const [isPaused, pauseReason, pausedBy, pausedAt] = await Promise.all([
      redis.get(BOT_STATUS_KEY),
      redis.get(BOT_PAUSE_REASON_KEY),
      redis.get(BOT_PAUSE_BY_KEY),
      redis.get(BOT_PAUSE_TIME_KEY)
    ]);

    return {
      isPaused: isPaused === true || isPaused === 'true',
      pauseReason: pauseReason as string || undefined,
      pausedBy: pausedBy as string || undefined,
      pausedAt: pausedAt ? new Date(pausedAt as string) : undefined
    };
  } catch (error) {
    logger.error('Failed to get bot status:', error);
    return { isPaused: false };
  }
};

export const pauseBot = async (reason: string, pausedBy: string): Promise<boolean> => {
  try {
    const now = new Date();
    
    await Promise.all([
      redis.set(BOT_STATUS_KEY, 'true'),
      redis.set(BOT_PAUSE_REASON_KEY, reason),
      redis.set(BOT_PAUSE_BY_KEY, pausedBy),
      redis.set(BOT_PAUSE_TIME_KEY, now.toISOString())
    ]);

    logger.info(`Bot paused by ${pausedBy} for reason: ${reason}`);
    return true;
  } catch (error) {
    logger.error('Failed to pause bot:', error);
    return false;
  }
};

export const unpauseBot = async (unpausedBy: string): Promise<boolean> => {
  try {
    await Promise.all([
      redis.del(BOT_STATUS_KEY),
      redis.del(BOT_PAUSE_REASON_KEY),
      redis.del(BOT_PAUSE_BY_KEY),
      redis.del(BOT_PAUSE_TIME_KEY)
    ]);

    logger.info(`Bot unpaused by ${unpausedBy}`);
    return true;
  } catch (error) {
    logger.error('Failed to unpause bot:', error);
    return false;
  }
};

export const isBotPaused = async (): Promise<boolean> => {
  try {
    const status = await getBotStatus();
    return status.isPaused;
  } catch (error) {
    logger.error('Failed to check bot pause status:', error);
    return false;
  }
}; 
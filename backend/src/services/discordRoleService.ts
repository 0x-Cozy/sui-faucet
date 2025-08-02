import { PrismaClient } from '@prisma/client';
import logger from './logger';

const prisma = new PrismaClient();

export interface DiscordRoleConfig {
  guildId: string;
  adminRoleId?: string;
  modRoleId?: string;
}

export const getRoleConfig = async (guildId: string): Promise<DiscordRoleConfig | null> => {
  try {
    const config = await prisma.discordRoleConfig.findUnique({
      where: { guildId }
    });

    if (!config) {
      return null;
    }

    return {
      guildId: config.guildId,
      adminRoleId: config.adminRoleId || undefined,
      modRoleId: config.modRoleId || undefined
    };
  } catch (error) {
    logger.error('Failed to get Discord role config:', error);
    return null;
  }
};

export const setRoleConfig = async (guildId: string, adminRoleId?: string, modRoleId?: string): Promise<boolean> => {
  try {
    await prisma.discordRoleConfig.upsert({
      where: { guildId },
      update: {
        adminRoleId,
        modRoleId,
        updatedAt: new Date()
      },
      create: {
        guildId,
        adminRoleId,
        modRoleId
      }
    });

    logger.info(`Discord role config updated for guild ${guildId}: admin=${adminRoleId}, mod=${modRoleId}`);
    return true;
  } catch (error) {
    logger.error('Failed to set Discord role config:', error);
    return false;
  }
};

export const deleteRoleConfig = async (guildId: string): Promise<boolean> => {
  try {
    await prisma.discordRoleConfig.delete({
      where: { guildId }
    });

    logger.info(`Discord role config deleted for guild ${guildId}`);
    return true;
  } catch (error) {
    logger.error('Failed to delete Discord role config:', error);
    return false;
  }
}; 
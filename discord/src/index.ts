import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
import { config } from 'dotenv';
import { logger } from './utils/logger';
import { BackendAPI } from './services/api';

import { faucetCommand } from './commands/faucet';
import { balanceCommand } from './commands/balance';
import { statusCommand } from './commands/status';
import { helpCommand } from './commands/help';
import { data as setupData, execute as setupExecute } from './commands/setup';
import { data as adminData, execute as adminExecute } from './commands/admin';
import { data as modData, execute as modExecute } from './commands/mod';
import { rolesCommand } from './commands/roles';
import { Command } from './types';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

const commands = new Collection<string, Command>();

commands.set(faucetCommand.data.name, faucetCommand);
commands.set(balanceCommand.data.name, balanceCommand);
commands.set(statusCommand.data.name, statusCommand);
commands.set(helpCommand.data.name, helpCommand);
commands.set(rolesCommand.data.name, rolesCommand);

commands.set(setupData.name, { data: setupData, execute: setupExecute });
commands.set(adminData.name, { data: adminData, execute: adminExecute });
commands.set(modData.name, { data: modData, execute: modExecute });

// bot pause check function
const isBotPaused = async (): Promise<boolean> => {
  try {
    const api = new BackendAPI(
      process.env.BACKEND_URL || 'http://localhost:3001',
      process.env.API_KEY
    );
    const statusResponse = await api.getBotStatus();
    return statusResponse.success && statusResponse.status?.isPaused;
  } catch (error) {
    logger.error('Failed to check bot pause status:', error);
    return false; //default to not paused if check fails
  }
};

// User restriction check function
const isUserRestricted = async (discordUserId: string): Promise<boolean> => {
  try {
    const api = new BackendAPI(
      process.env.BACKEND_URL || 'http://localhost:3001',
      process.env.API_KEY
    );
    const restrictionResponse = await api.getDiscordUserRestriction(discordUserId);
    return restrictionResponse.success && restrictionResponse.restrictionInfo?.isRestricted;
  } catch (error) {
    logger.error('Failed to check user restriction status:', error);
    return false; //default to not restricted if check fails
  }
};


client.once(Events.ClientReady, () => {
  logger.info(`bot logged in as ${client.user?.tag}`);
  logger.info(`Bot is in ${client.guilds.cache.size} guilds`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) {
    logger.warn(`Unknown command: ${interaction.commandName}`);
    return;
  }

  try {
    // check if bot is paused (skip for admin commands)
    if (!['admin', 'setup'].includes(interaction.commandName)) {
      const paused = await isBotPaused();
      if (paused) {
        await interaction.reply({
          content: '⏸️ The bot is currently paused by an administrator. Please try again later.',
          ephemeral: true
        });
        return;
      }
    }

    if (!['admin', 'setup', 'mod'].includes(interaction.commandName)) {
      const restricted = await isUserRestricted(interaction.user.id);
      if (restricted) {
        await interaction.reply({
          content: '🚫 You are currently restricted from using this bot. Please contact a moderator.',
          ephemeral: true
        });
        return;
      }
    }

    // check permissions
    if (command.permissions) {
      const member = interaction.member;
      if (!member) {
        await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
        return;
      }

      const hasPermission = command.permissions.every(permission =>
        typeof member.permissions === 'string'
          ? member.permissions.includes(permission.toString())
          : member.permissions.has(permission as any)
      );

      if (!hasPermission) {
        await interaction.reply({ 
          content: '❌ You do not have permission to use this command.', 
          ephemeral: true 
        });
        return;
      }
    }

    // Execute command
    await command.execute(interaction);
  } catch (error) {
    logger.error(`Error executing command ${interaction.commandName}:`, error);
    
    const errorMessage = '❌ An error occurred while executing this command. Please try again.';
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, ephemeral: true });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
});

// Event: Client Error
client.on(Events.Error, (error) => {
  logger.error('Discord client error:', error);
});

client.on(Events.Warn, (warning) => {
  logger.warn('Discord client warning:', warning);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

const token = process.env.DISCORD_TOKEN;
if (!token) {
  logger.error('DISCORD_TOKEN is not set in environment variables');
  process.exit(1);
}

// login
client.login(token); 
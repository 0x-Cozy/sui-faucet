import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { logger } from './utils/logger';
import { faucetCommand } from './commands/faucet';
import { balanceCommand } from './commands/balance';
import { statusCommand } from './commands/status';
import { helpCommand } from './commands/help';
import { data as setupCommand } from './commands/setup';
import { data as adminCommand } from './commands/admin';
import { data as modCommand } from './commands/mod';

config();

const commands = [
  faucetCommand.data.toJSON(),
  balanceCommand.data.toJSON(),
  statusCommand.data.toJSON(),
  helpCommand.data.toJSON(),
  setupCommand.toJSON(),
  adminCommand.toJSON(),
  modCommand.toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    logger.info('Started refreshing application (/) commands.');

    const clientId = process.env.DISCORD_CLIENT_ID;
    const guildId = process.env.DISCORD_GUILD_ID;

    if (!clientId) {
      throw new Error('DISCORD_CLIENT_ID is not set');
    }

    if (guildId) {
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );
      logger.info(`Successfully reloaded application (/) commands for guild ${guildId}.`);
    } else {
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
      );
      logger.info('Successfully reloaded application (/) commands globally.');
    }
  } catch (error) {
    logger.error('Error deploying commands:', error);
  }
})(); 
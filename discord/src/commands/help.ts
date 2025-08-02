import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction,
  PermissionFlagsBits
} from 'discord.js';
import { Command } from '../types';
import { EmbedUtils } from '../utils/embeds';
import { logger } from '../utils/logger';

export const helpCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show available commands and usage'),

  permissions: [PermissionFlagsBits.SendMessages],

  execute: async (interaction: ChatInputCommandInteraction) => {
    try {
      const helpEmbed = EmbedUtils.createHelpEmbed();
      await interaction.reply({ embeds: [helpEmbed], ephemeral: true });

      logger.info(`Help command used - User: ${interaction.user.id}`);

    } catch (error) {
      logger.error('Error in help command:', error);
      
      const errorEmbed = EmbedUtils.createErrorEmbed({
        title: '❌ Command Error',
        description: 'An unexpected error occurred. Please try again later.',
        footer: { text: 'If this persists, contact an administrator.' }
      });
      
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
}; 
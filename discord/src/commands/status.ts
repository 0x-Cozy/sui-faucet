import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction,
  PermissionFlagsBits
} from 'discord.js';
import { Command } from '../types';
import { BackendAPI } from '../services/api';
import { EmbedUtils } from '../utils/embeds';
import { logger } from '../utils/logger';

export const statusCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Check faucet status and rate limits'),

  permissions: [PermissionFlagsBits.SendMessages],
  cooldown: 15000,

  execute: async (interaction: ChatInputCommandInteraction) => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const discordUserId = interaction.user.id;
      const api = new BackendAPI(
        process.env.BACKEND_URL || 'http://localhost:3001',
        process.env.API_KEY
      );

      const response = await api.getStatus();

      if (response.success) {
        const userStatusResponse = await api.getStatusWithUser(discordUserId);
        
        const statusEmbed = EmbedUtils.createStatusEmbed(response, userStatusResponse);
        await interaction.editReply({ embeds: [statusEmbed] });

        logger.info(`Status check successful - User: ${discordUserId}`);
      } else {
        const errorEmbed = EmbedUtils.createErrorEmbed({
          title: '❌ Status Check Failed',
          description: response.error || 'Unable to retrieve faucet status',
          footer: { text: 'The faucet may be temporarily unavailable.' }
        });
        await interaction.editReply({ embeds: [errorEmbed] });

        logger.warn(`Status check failed - User: ${discordUserId}, Error: ${response.error}`);
      }

    } catch (error) {
      logger.error('Error in status command:', error);
      
      const errorEmbed = EmbedUtils.createErrorEmbed({
        title: '❌ Command Error',
        description: 'An unexpected error occurred. Please try again later.',
        footer: { text: 'If this persists, contact an administrator.' }
      });
      
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
}; 
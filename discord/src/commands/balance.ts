import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction,
  PermissionFlagsBits
} from 'discord.js';
import { Command } from '../types';
import { BackendAPI } from '../services/api';
import { ValidationUtils } from '../utils/validation';
import { EmbedUtils } from '../utils/embeds';
import { logger } from '../utils/logger';

export const balanceCommand: Command = {
  //@ts-ignore
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check SUI wallet balance')
    .addStringOption(option =>
      option
        .setName('address')
        .setDescription('Sui wallet address')
        .setRequired(true)
    ),

  permissions: [PermissionFlagsBits.SendMessages],
  cooldown: 30000,

  execute: async (interaction: ChatInputCommandInteraction) => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const address = interaction.options.getString('address', true);

      if (!ValidationUtils.isValidSuiAddress(address)) {
        const errorEmbed = EmbedUtils.createErrorEmbed({
          title: '❌ Invalid Address',
          description: 'Please provide a valid Sui wallet address.',
          fields: [
            { name: 'Provided Address', value: `\`${address}\``, inline: false }
          ]
        });
        await interaction.editReply({ embeds: [errorEmbed] });
        return;
      }

      const api = new BackendAPI(
        process.env.BACKEND_URL || 'http://localhost:3001',
        process.env.API_KEY
      );

      const response = await api.getBalance(address.trim());

      if (response.success && response.balance) {
        const balanceEmbed = EmbedUtils.createBalanceEmbed(
          ValidationUtils.formatAddress(address),
          response.balance
        );
        await interaction.editReply({ embeds: [balanceEmbed] });

        logger.info(`Balance check successful - User: ${interaction.user.id}, Address: ${address}`);
      } else {
        const errorEmbed = EmbedUtils.createErrorEmbed({
          title: '❌ Balance Check Failed',
          description: response.error || 'Unable to retrieve balance',
          fields: [
            { name: 'Address', value: ValidationUtils.formatAddress(address), inline: true }
          ]
        });
        await interaction.editReply({ embeds: [errorEmbed] });

        logger.warn(`Balance check failed - User: ${interaction.user.id}, Address: ${address}, Error: ${response.error}`);
      }

    } catch (error) {
      logger.error('Error in balance command:', error);
      
      const errorEmbed = EmbedUtils.createErrorEmbed({
        title: '❌ Command Error',
        description: 'An unexpected error occurred. Please try again later.',
        footer: { text: 'If this persists, contact an administrator.' }
      });
      
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
}; 
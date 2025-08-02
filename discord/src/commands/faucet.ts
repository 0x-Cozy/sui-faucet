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

export const faucetCommand: Command = {
  //@ts-ignore
  data: new SlashCommandBuilder()
    .setName('faucet')
    .setDescription('Request SUI tokens from the faucet')
    .addStringOption(option =>
      option
        .setName('address')
        .setDescription('Sui wallet address')
        .setRequired(true)
    )
    .addNumberOption(option =>
      option
        .setName('amount')
        .setDescription('Amount of SUI to request (0.1-1.0)')
        .setRequired(true)
        .setMinValue(0.1)
        .setMaxValue(1.0)
    ),

  permissions: [PermissionFlagsBits.SendMessages],
  cooldown: 60000,

  execute: async (interaction: ChatInputCommandInteraction) => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const address = interaction.options.getString('address', true);
      const amount = interaction.options.getNumber('amount', true);
      const discordUserId = interaction.user.id;

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

      if (!ValidationUtils.isValidSuiAmount(amount)) {
        const errorEmbed = EmbedUtils.createErrorEmbed({
          title: '❌ Invalid Amount',
          description: 'Amount must be between 0.1 and 1.0 SUI in 0.1 increments.',
          fields: [
            { name: 'Provided Amount', value: `${amount} SUI`, inline: false }
          ]
        });
        await interaction.editReply({ embeds: [errorEmbed] });
        return;
      }

      const api = new BackendAPI(
        process.env.BACKEND_URL || 'http://localhost:3001',
        process.env.API_KEY
      );

      const response = await api.requestFaucet({
        walletAddress: address.trim(),
        amount: amount,
        discordUserId: discordUserId
      });

      if (response.success) {
        const successEmbed = EmbedUtils.createFaucetSuccessEmbed(
          ValidationUtils.formatAddress(address),
          amount,
          response.txHash
        );
        await interaction.editReply({ embeds: [successEmbed] });

        logger.info(`Faucet request successful - User: ${discordUserId}, Address: ${address}, Amount: ${amount}`);
      } else {
        const errorEmbed = EmbedUtils.createErrorEmbed({
          title: '❌ Faucet Request Failed',
          description: response.error || 'Unknown error occurred',
          fields: [
            { name: 'Address', value: ValidationUtils.formatAddress(address), inline: true },
            { name: 'Amount', value: `${amount} SUI`, inline: true }
          ]
        });
        await interaction.editReply({ embeds: [errorEmbed] });

        logger.warn(`Faucet request failed - User: ${discordUserId}, Address: ${address}, Error: ${response.error}`);
      }

    } catch (error) {
      logger.error('Error in faucet command:', error);
      
      const errorEmbed = EmbedUtils.createErrorEmbed({
        title: '❌ Command Error',
        description: 'An unexpected error occurred. Please try again later.',
        footer: { text: 'If this persists, contact an administrator.' }
      });
      
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
}; 
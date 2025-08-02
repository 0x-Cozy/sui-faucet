import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction,
  PermissionFlagsBits
} from 'discord.js';
import { Command } from '../types';
import { EmbedUtils } from '../utils/embeds';
import { logger } from '../utils/logger';

export const rolesCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('roles')
    .setDescription('Show role IDs for bot configuration'),

  permissions: [PermissionFlagsBits.SendMessages],

  execute: async (interaction: ChatInputCommandInteraction) => {
    try {
      const guild = interaction.guild;
      if (!guild) {
        await interaction.reply({ content: '❌ This command can only be used in a server.', ephemeral: true });
        return;
      }

      const roles = guild.roles.cache
        .filter(role => role.name !== '@everyone')
        .map(role => `**${role.name}**: \`${role.id}\``)
        .join('\n');

      const embed = EmbedUtils.createInfoEmbed({
        title: '🎭 Server Roles',
        description: 'Role IDs for bot configuration:',
        fields: [
          { name: 'Available Roles', value: roles || 'No roles found', inline: false }
        ],
        footer: { text: 'Copy the role ID you want to use for admin commands' }
      });

      await interaction.reply({ embeds: [embed], ephemeral: true });
      logger.info(`Roles command used - User: ${interaction.user.id}`);

    } catch (error) {
      logger.error('Error in roles command:', error);
      
      const errorEmbed = EmbedUtils.createErrorEmbed({
        title: '❌ Command Error',
        description: 'An unexpected error occurred. Please try again later.',
        footer: { text: 'If this persists, contact an administrator.' }
      });
      
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
}; 
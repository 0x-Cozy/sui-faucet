import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { BackendAPI } from '../services/api';
import { EmbedUtils } from '../utils/embeds';
import { logger } from '../utils/logger';

export const data = new SlashCommandBuilder()
  .setName('mod')
  .setDescription('Moderator commands for user management')
  .addSubcommand(subcommand =>
    subcommand
      .setName('restrict')
      .setDescription('Restrict a Discord user from using the bot')
      .addUserOption(option =>
        option
          .setName('user')
          .setDescription('The user to restrict')
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName('reason')
          .setDescription('Reason for restriction')
          .setRequired(true)
      )
      .addIntegerOption(option =>
        option
          .setName('duration')
          .setDescription('Duration in hours (0 for permanent)')
          .setRequired(false)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('unrestrict')
      .setDescription('Remove restriction from a Discord user')
      .addUserOption(option =>
        option
          .setName('user')
          .setDescription('The user to unrestrict')
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('history')
      .setDescription('View user history')
      .addUserOption(option =>
        option
          .setName('user')
          .setDescription('The user to check')
          .setRequired(true)
      )
  );

export const execute = async (interaction: any) => {
  try {
    const guild = interaction.guild;
    if (!guild) {
      await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
      return;
    }

    const member = interaction.member;
    if (!member) {
      await interaction.reply({ content: 'Unable to get member information.', ephemeral: true });
      return;
    }

    const api = new BackendAPI(
      process.env.BACKEND_URL || 'http://localhost:3001',
      process.env.API_KEY
    );

    let roleConfig;
    try {
      const configResponse = await api.getRoleConfig(guild.id);
      roleConfig = configResponse.success ? configResponse.config : null;
    } catch (error) {
      logger.error('Failed to get role config:', error);
      await interaction.reply({ content: '❌ Failed to verify permissions.', ephemeral: true });
      return;
    }

    if (!roleConfig || !roleConfig.modRoleId || !member || !('roles' in member) || !('cache' in member.roles) || !member.roles.cache.has(roleConfig.modRoleId)) {
      await interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'restrict': {
        const user = interaction.options.getUser('user', true);
        const reason = interaction.options.getString('reason', true);
        const duration = interaction.options.getInteger('duration') || 0; // 0 = permanent

        try {
          const durationSeconds = duration > 0 ? duration * 3600 : undefined; // Convert hours to seconds
          const response = await api.restrictDiscordUser(user.id, reason, durationSeconds);
          
          if (response.success) {
            const embed = new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle('🚫 User Restricted')
              .setDescription(`**${user.username}** has been restricted from using the bot.`)
              .addFields(
                { name: 'Reason', value: reason, inline: true },
                { name: 'Duration', value: duration > 0 ? `${duration} hours` : 'Permanent', inline: true },
                { name: 'Restricted By', value: interaction.user.username, inline: true }
              )
              .setTimestamp();

            await interaction.reply({ embeds: [embed] });
          } else {
            await interaction.reply({ content: '❌ Failed to restrict user.', ephemeral: true });
          }
        } catch (error) {
          logger.error('Failed to restrict user:', error);
          await interaction.reply({ content: '❌ Failed to restrict user.', ephemeral: true });
        }
        break;
      }

      case 'unrestrict': {
        const user = interaction.options.getUser('user', true);

        try {
          const response = await api.unrestrictDiscordUser(user.id);
          
          if (response.success) {
            const embed = new EmbedBuilder()
              .setColor(0x00ff00)
              .setTitle('✅ User Unrestricted')
              .setDescription(`**${user.username}** can now use the bot again.`)
              .addFields(
                { name: 'Unrestricted By', value: interaction.user.username, inline: true }
              )
              .setTimestamp();

            await interaction.reply({ embeds: [embed] });
          } else {
            await interaction.reply({ content: '❌ Failed to unrestrict user.', ephemeral: true });
          }
        } catch (error) {
          logger.error('Failed to unrestrict user:', error);
          await interaction.reply({ content: '❌ Failed to unrestrict user.', ephemeral: true });
        }
        break;
      }

      case 'history': {
        const user = interaction.options.getUser('user', true);

        try {
          const response = await api.getUserHistory(user.id);
          
          if (response.success && response.history) {
            const history = response.history;
            
            if (history.length === 0) {
              const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('📊 User History')
                .setDescription(`**${user.username}** has no faucet history.`)
                .setTimestamp();

              await interaction.reply({ embeds: [embed] });
            } else {
              const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('📊 User History')
                .setDescription(`**${user.username}**'s faucet activity:`)
                .setTimestamp();

              // Show last 10 entries
              const recentHistory = history.slice(0, 10);
              let historyText = '';
              
              recentHistory.forEach((entry: any, index: number) => {
                const date = new Date(entry.createdAt).toLocaleDateString();
                const time = new Date(entry.createdAt).toLocaleTimeString();
                const status = entry.success ? '✅' : '❌';
                const amount = entry.amount || 'N/A';
                
                historyText += `${index + 1}. ${status} ${amount} SUI - ${date} ${time}\n`;
              });

              if (history.length > 10) {
                historyText += `\n... and ${history.length - 10} more entries`;
              }

              embed.addFields({ name: 'Recent Activity', value: historyText || 'No recent activity' });
              await interaction.reply({ embeds: [embed] });
            }
          } else {
            await interaction.reply({ content: '❌ Failed to get user history.', ephemeral: true });
          }
        } catch (error) {
          logger.error('Failed to get user history:', error);
          await interaction.reply({ content: '❌ Failed to get user history.', ephemeral: true });
        }
        break;
      }

      default:
        await interaction.reply({ content: '❌ Unknown subcommand.', ephemeral: true });
    }
  } catch (error) {
    logger.error('Error in mod command:', error);
    await interaction.reply({ content: '❌ An error occurred while executing this command.', ephemeral: true });
  }
}; 
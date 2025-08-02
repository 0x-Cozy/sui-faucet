import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { BackendAPI } from '../services/api';
import { EmbedUtils } from '../utils/embeds';
import { logger } from '../utils/logger';

export const data = new SlashCommandBuilder()
  .setName('admin')
  .setDescription('Admin bot management commands')
  .addSubcommand(subcommand =>
    subcommand
      .setName('status')
      .setDescription('Get detailed bot statistics')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('pause')
      .setDescription('Pause the bot (admin only)')
      .addStringOption(option =>
        option
          .setName('reason')
          .setDescription('Reason for pausing the bot')
          .setRequired(false)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('unpause')
      .setDescription('Unpause the bot (admin only)')
  );

export const execute = async (interaction: any) => {
  try {
    const guild = interaction.guild;
    if (!guild) {
      await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
      return;
    }

    const api = new BackendAPI(
      process.env.BACKEND_URL || 'http://localhost:3001',
      process.env.API_KEY
    );

    // Get role configuration from backend
    let roleConfig;
    try {
      const configResponse = await api.getRoleConfig(guild.id);
      roleConfig = configResponse.success ? configResponse.config : null;
    } catch (error) {
      logger.error('Failed to get role config:', error);
      roleConfig = null;
    }

    if (!roleConfig || !roleConfig.adminRoleId) {
      await interaction.reply({ 
        content: '❌ Bot roles not configured. Server owner should run `/setup` first.', 
        ephemeral: true 
      });
      return;
    }

    const member = await guild.members.fetch(interaction.user.id);
    
    if (!member || !('roles' in member) || !('cache' in member.roles) || !member.roles.cache.has(roleConfig.adminRoleId)) {
      await interaction.reply({ 
        content: '❌ You do not have permission to use admin commands. Contact a server administrator.', 
        ephemeral: true 
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'status':
        await interaction.deferReply();
        
        try {
          const statsResponse = await api.getBotStats();
          
          if (statsResponse.success && statsResponse.stats) {
            const stats = statsResponse.stats;
            const embed = new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle('📊 Bot Statistics')
              .setDescription('Detailed bot performance metrics')
              .addFields(
                { name: 'Total Requests', value: `${stats.totalRequests}`, inline: true },
                { name: 'Successful Requests', value: `${stats.successfulRequests}`, inline: true },
                { name: 'Failed Requests', value: `${stats.failedRequests}`, inline: true },
                { name: 'Unique Wallets', value: `${stats.uniqueWallets}`, inline: true },
                { name: 'Unique Discord Users', value: `${stats.uniqueDiscordUsers}`, inline: true },
                { name: 'Total Tokens Sent', value: `${stats.totalTokensSent} SUI`, inline: true }
              )
              .setTimestamp();

            // Add recent activity if available
            if (stats.recentActivity && stats.recentActivity.length > 0) {
              const recentActivityText = stats.recentActivity
                .slice(0, 5)
                .map((activity: any) => {
                  const status = activity.success ? '✅' : '❌';
                  const source = activity.source === 'discord' ? '🤖' : '🌐';
                  return `${status} ${source} ${activity.walletAddress.slice(0, 8)}... (${activity.amount} SUI)`;
                })
                .join('\n');
              
              embed.addFields({
                name: 'Recent Activity',
                value: recentActivityText || 'No recent activity',
                inline: false
              });
            }

            await interaction.editReply({ embeds: [embed] });
          } else {
            await interaction.editReply({ 
              content: '❌ Failed to fetch bot statistics. Please try again later.',
              ephemeral: true 
            });
          }
        } catch (error) {
          logger.error('Failed to get bot stats:', error);
          await interaction.editReply({ 
            content: '❌ Failed to fetch bot statistics. Please try again later.',
            ephemeral: true 
          });
        }
        break;

      case 'pause':
        await interaction.deferReply();
        
        try {
          const reason = interaction.options.getString('reason') || 'No reason provided';
          const pausedBy = `${interaction.user.username} (${interaction.user.id})`;
          
          const pauseResponse = await api.pauseBot(reason, pausedBy);
          
          if (pauseResponse.success) {
            const embed = new EmbedBuilder()
              .setColor(0xff9900)
              .setTitle('⏸️ Bot Paused')
              .setDescription('The bot has been paused successfully.')
              .addFields(
                { name: 'Paused By', value: interaction.user.username, inline: true },
                { name: 'Reason', value: reason, inline: true },
                { name: 'Time', value: new Date().toLocaleString(), inline: true }
              )
              .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
          } else {
            await interaction.editReply({ 
              content: '❌ Failed to pause the bot. Please try again later.',
              ephemeral: true 
            });
          }
        } catch (error) {
          logger.error('Failed to pause bot:', error);
          await interaction.editReply({ 
            content: '❌ Failed to pause the bot. Please try again later.',
            ephemeral: true 
          });
        }
        break;

      case 'unpause':
        await interaction.deferReply();
        
        try {
          const unpausedBy = `${interaction.user.username} (${interaction.user.id})`;
          
          const unpauseResponse = await api.unpauseBot(unpausedBy);
          
          if (unpauseResponse.success) {
            const embed = new EmbedBuilder()
              .setColor(0x00ff00)
              .setTitle('▶️ Bot Resumed')
              .setDescription('The bot has been unpaused successfully.')
              .addFields(
                { name: 'Unpaused By', value: interaction.user.username, inline: true },
                { name: 'Time', value: new Date().toLocaleString(), inline: true }
              )
              .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
          } else {
            await interaction.editReply({ 
              content: '❌ Failed to unpause the bot. Please try again later.',
              ephemeral: true 
            });
          }
        } catch (error) {
          logger.error('Failed to unpause bot:', error);
          await interaction.editReply({ 
            content: '❌ Failed to unpause the bot. Please try again later.',
            ephemeral: true 
          });
        }
        break;

      default:
        await interaction.reply({ 
          content: '❌ Unknown subcommand. Use `/admin status`, `/admin pause`, or `/admin unpause`.',
          ephemeral: true 
        });
    }
  } catch (error) {
    logger.error('Admin command error:', error);
    await interaction.reply({ 
      content: '❌ An error occurred while processing the admin command. Please try again.',
      ephemeral: true 
    });
  }
}; 
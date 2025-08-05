import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { BackendAPI } from '../services/api';
import { logger } from '../utils/logger';

export const data = new SlashCommandBuilder()
  .setName('setup')
  .setDescription('Configure bot roles (Server Owner/Manager Only)')
  .addRoleOption(option =>
    option
      .setName('admin_role')
      .setDescription('Role that can use admin commands')
      .setRequired(true)
  )
  .addRoleOption(option =>
    option
      .setName('mod_role')
      .setDescription('Role that can use moderator commands')
      .setRequired(true)
  );

export const execute = async (interaction: any) => {
  try {
    const guild = interaction.guild;
    if (!guild) {
      await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
      return;
    }

    // Check if user is server owner or has manage permission
    const member = await guild.members.fetch(interaction.user.id);
    const isOwner = guild.ownerId === interaction.user.id;
    const hasManageServer = member && 'permissions' in member &&
      (typeof member.permissions === 'string'
        ? member.permissions.includes(PermissionFlagsBits.ManageGuild.toString())
        : member.permissions.has(PermissionFlagsBits.ManageGuild as any));

    if (!isOwner && !hasManageServer) {
      await interaction.reply({ 
        content: '❌ You need to be the server owner or have "Manage Server" permission to configure bot roles.', 
        ephemeral: true 
      });
      return;
    }

    const adminRole = interaction.options.getRole('admin_role', true);
    const modRole = interaction.options.getRole('mod_role', true);

    if (!adminRole || !modRole) {
      await interaction.reply({ 
        content: '❌ Both admin and mod roles are required.', 
        ephemeral: true 
      });
      return;
    }

    if (adminRole.id === modRole.id) {
      await interaction.reply({ 
        content: '❌ Admin and mod roles must be different.', 
        ephemeral: true 
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const api = new BackendAPI(
      process.env.BACKEND_URL || 'http://localhost:3001',
      process.env.API_KEY
    );

    try {
      const response = await api.setRoleConfig(guild.id, adminRole.id, modRole.id);

      if (response.success) {
        const embed = new EmbedBuilder()
          .setColor(0x00ff00)
          .setTitle('✅ Bot Configuration Updated')
          .setDescription('Bot roles have been configured successfully.')
          .addFields(
            { name: 'Admin Role', value: `${adminRole.name} (${adminRole.id})`, inline: true },
            { name: 'Mod Role', value: `${modRole.name} (${modRole.id})`, inline: true },
            { name: 'Server', value: guild.name, inline: true }
          )
          .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
        logger.info(`Bot roles configured for guild ${guild.id} by ${interaction.user.id}`);
      } else {
        await interaction.editReply({ 
          content: '❌ Failed to update bot configuration. Please try again later.'
        });
      }
    } catch (error) {
      logger.error('Failed to set role config:', error);
      await interaction.editReply({ 
        content: '❌ Failed to update bot configuration. Please try again later.'
      });
    }
  } catch (error) {
    logger.error('Setup command error:', error);
    try {
      await interaction.editReply({ 
        content: '❌ An error occurred while configuring the bot. Please try again.'
      });
    } catch (replyError) {
      logger.error('Failed to send error reply:', replyError);
    }
  }
}; 
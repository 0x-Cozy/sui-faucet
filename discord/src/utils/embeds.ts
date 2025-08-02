import { EmbedBuilder, ColorResolvable } from 'discord.js';
import { EmbedOptions } from '../types';

export class EmbedUtils {
  static createSuccessEmbed(options: EmbedOptions): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor(0x00ff00 as ColorResolvable)
      .setTitle(options.title || '✅ Success')
      .setDescription(options.description || 'Operation completed successfully')
      .setTimestamp();

    if (options.fields) {
      embed.addFields(options.fields);
    }

    if (options.footer) {
      embed.setFooter(options.footer);
    }

    return embed;
  }

  static createErrorEmbed(options: EmbedOptions): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor(0xff0000 as ColorResolvable)
      .setTitle(options.title || '❌ Error')
      .setDescription(options.description || 'An error occurred')
      .setTimestamp();

    if (options.fields) {
      embed.addFields(options.fields);
    }

    if (options.footer) {
      embed.setFooter(options.footer);
    }

    return embed;
  }

  static createInfoEmbed(options: EmbedOptions): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor(0x0099ff as ColorResolvable)
      .setTitle(options.title || 'ℹ️ Information')
      .setDescription(options.description || '')
      .setTimestamp();

    if (options.fields) {
      embed.addFields(options.fields);
    }

    if (options.footer) {
      embed.setFooter(options.footer);
    }

    return embed;
  }

  static createWarningEmbed(options: EmbedOptions): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor(0xffff00 as ColorResolvable)
      .setTitle(options.title || '⚠️ Warning')
      .setDescription(options.description || '')
      .setTimestamp();

    if (options.fields) {
      embed.addFields(options.fields);
    }

    if (options.footer) {
      embed.setFooter(options.footer);
    }

    return embed;
  }

  static createFaucetSuccessEmbed(address: string, amount: number, txHash?: string): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor(0x00ff00 as ColorResolvable)
      .setTitle('🎉 Faucet Request Successful')
      .setDescription(`Successfully sent **${amount} SUI** to the wallet`)
      .addFields(
        { name: 'Wallet Address', value: `\`${address}\``, inline: true },
        { name: 'Amount', value: `**${amount} SUI**`, inline: true }
      )
      .setTimestamp();

    if (txHash) {
      embed.addFields({
        name: 'Transaction Hash',
        value: `[${txHash.slice(0, 8)}...${txHash.slice(-8)}](https://suiscan.xyz/testnet/tx/${txHash})`,
        inline: false
      });
    }

    return embed;
  }

  static createBalanceEmbed(address: string, balance: string): EmbedBuilder {
    const balanceNum = parseInt(balance) / 1000000000;
    
    return new EmbedBuilder()
      .setColor(0x0099ff as ColorResolvable)
      .setTitle('💰 Wallet Balance')
      .setDescription(`Balance information for the wallet`)
      .addFields(
        { name: 'Wallet Address', value: `\`${address}\``, inline: true },
        { name: 'Balance', value: `**${balanceNum.toFixed(4)} SUI**`, inline: true }
      )
      .setTimestamp();
  }

  static createStatusEmbed(status: any, userStatus?: any): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor(0x0099ff as ColorResolvable)
      .setTitle('📊 Faucet Status')
      .setDescription('Current faucet status and rate limits')
      .setTimestamp();

    // handle different response structures
    if (status.message) {
      embed.addFields(
        { name: 'Status', value: '🟢 Online', inline: true },
        { name: 'Message', value: status.message, inline: true }
      );
    } else if (status.rateLimit) {
      const rateLimit = status.rateLimit;
      embed.addFields(
        { name: 'Status', value: '🟢 Online', inline: true },
        { name: 'Wallet Valid', value: status.walletValid ? '✅ Yes' : '❌ No', inline: true },
        { name: 'Remaining Requests', value: `${rateLimit.remaining || 'Unknown'}`, inline: true },
        { name: 'Blocked', value: rateLimit.blocked ? '🚫 Yes' : '✅ No', inline: true }
      );
    } else {
      embed.addFields(
        { name: 'Status', value: '🟢 Online', inline: true },
        { name: 'Message', value: 'Faucet is operational', inline: true }
      );
    }

    if (userStatus && userStatus.success && userStatus.rateLimit) {
      const userRateLimit = userStatus.rateLimit;
      embed.addFields(
        { name: 'Your Rate Limit', value: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', inline: false },
        { name: 'Your Remaining Requests', value: `${userRateLimit.remaining || 'Unknown'}`, inline: true },
        { name: 'You Are Blocked', value: userRateLimit.blocked ? '🚫 Yes' : '✅ No', inline: true },
        { name: 'Reset Time', value: userRateLimit.resetTime ? `<t:${Math.floor(userRateLimit.resetTime / 1000)}:R>` : 'Unknown', inline: true }
      );
    }

    return embed;
  }

  static createHelpEmbed(): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(0x0099ff as ColorResolvable)
      .setTitle('🤖 SUI Faucet Bot Help')
      .setDescription('Available commands for the SUI Faucet Discord bot')
      .addFields(
        { name: '/faucet', value: 'Request SUI tokens from the faucet\nUsage: `/faucet address:0x... amount:0.5`', inline: false },
        { name: '/balance', value: 'Check wallet balance\nUsage: `/balance address:0x...`', inline: false },
        { name: '/status', value: 'Check faucet status and rate limits', inline: false },
        { name: '/help', value: 'Show this help message', inline: false },
        { name: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', value: '**Admin & Mod Commands**', inline: false },
        { name: '/setup', value: 'Configure bot roles (Bot Owner Only)', inline: false },
        { name: '/admin', value: 'Admin bot management (pause/unpause/status)', inline: false },
        { name: '/mod', value: 'Moderator user management (restrict/unrestrict/history)', inline: false }
      )
      .setFooter({ text: 'SUI Faucet Bot v1.0' })
      .setTimestamp();
  }
} 
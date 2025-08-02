import { SlashCommandBuilder, PermissionResolvable } from 'discord.js';

export interface Command {
  data: SlashCommandBuilder | any;
  permissions?: PermissionResolvable[];
  cooldown?: number;
  execute: (interaction: any) => Promise<void>;
}

export interface BotConfig {
  token: string;
  clientId: string;
  guildId?: string;
  backendUrl: string;
  backendApiKey: string;
  adminRoleId: string;
  logLevel: string;
  environment: string;
}

export interface UserProfile {
  discordId: string;
  username: string;
  discriminator: string;
  avatar?: string;
  joinedAt: Date;
  lastSeen: Date;
}

export interface FaucetRequest {
  walletAddress: string;
  amount: number;
  discordUserId: string | bigint;
}

export interface FaucetResponse {
  success: boolean;
  message?: string;
  txHash?: string;
  error?: string;
}

export interface BalanceResponse {
  success: boolean;
  balance?: string;
  error?: string;
}

export interface StatusResponse {
  success: boolean;
  message?: string;
  rateLimit?: any;
  discordRateLimit?: any;
  walletRateLimit?: any;
  walletValid?: boolean;
  error?: string;
}

export interface EmbedOptions {
  title?: string;
  description?: string;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  footer?: {
    text: string;
    iconURL?: string;
  };
} 
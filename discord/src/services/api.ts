import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { FaucetRequest, FaucetResponse, BalanceResponse, StatusResponse } from '../types';
import { logger } from '../utils/logger';

export class BackendAPI {
  private client: AxiosInstance;
  private baseUrl: string;
  private apiKey: string | undefined;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'X-API-Key': apiKey })
      }
    });

    this.client.interceptors.request.use(
      (config) => {
        logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.info(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error('API Response Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  async requestFaucet(data: FaucetRequest): Promise<FaucetResponse> {
    try {
      const response: AxiosResponse<FaucetResponse> = await this.client.post('/api/discord/faucet/request', data);
      return response.data;
    } catch (error: any) {
      logger.error('Faucet request failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getBalance(address: string): Promise<BalanceResponse> {
    try {
      const response: AxiosResponse<BalanceResponse> = await this.client.get(`/api/discord/faucet/balance/${address}`);
      return response.data;
    } catch (error: any) {
      logger.error('Balance check failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getStatus(): Promise<StatusResponse> {
    try {
      const response: AxiosResponse<StatusResponse> = await this.client.get('/api/discord/faucet/status');
      return response.data;
    } catch (error: any) {
      logger.error('Status check failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getStatusWithUser(discordUserId: string | bigint): Promise<StatusResponse> {
    try {
      const response: AxiosResponse<StatusResponse> = await this.client.get(`/api/discord/faucet/status?discordUserId=${discordUserId}`);
      return response.data;
    } catch (error: any) {
      logger.error('User status check failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // Admin endpoints
  async getBotStats(): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.client.get('/api/admin/stats');
      return response.data;
    } catch (error: any) {
      logger.error('Bot stats failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getUserHistory(discordUserId: string | bigint): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.client.get(`/api/admin/user/${discordUserId}`);
      return response.data;
    } catch (error: any) {
      logger.error('User history failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getWalletHistory(walletAddress: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.client.get(`/api/admin/wallet/${walletAddress}`);
      return response.data;
    } catch (error: any) {
      logger.error('Wallet history failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getRecentActivity(limit?: number, source?: string): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (source) params.append('source', source);
      
      const response: AxiosResponse<any> = await this.client.get(`/api/admin/recent?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      logger.error('Recent activity failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // Bot state management
  async getBotStatus(): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.client.get('/api/discord/bot/status');
      return response.data;
    } catch (error: any) {
      logger.error('Bot status failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async pauseBot(reason: string, pausedBy: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.client.post('/api/discord/bot/pause', 
        { reason },
        { headers: { 'X-Admin-User': pausedBy } }
      );
      return response.data;
    } catch (error: any) {
      logger.error('Bot pause failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async unpauseBot(unpausedBy: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.client.post('/api/discord/bot/unpause',
        {},
        { headers: { 'X-Admin-User': unpausedBy } }
      );
      return response.data;
    } catch (error: any) {
      logger.error('Bot unpause failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getRoleConfig(guildId: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.client.get(`/api/discord/roles/${guildId}`);
      return response.data;
    } catch (error: any) {
      logger.error('Get role config failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async setRoleConfig(guildId: string, adminRoleId?: string, modRoleId?: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.client.post(`/api/discord/roles/${guildId}`, {
        adminRoleId,
        modRoleId
      });
      return response.data;
    } catch (error: any) {
      logger.error('Role config update failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // restriction
  async restrictDiscordUser(discordUserId: string, reason: string, duration?: number): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.client.post('/api/discord/restrict/discord', {
        discordUserId,
        reason,
        duration
      });
      return response.data;
    } catch (error: any) {
      logger.error('Discord user restriction failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async unrestrictDiscordUser(discordUserId: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.client.post('/api/discord/unrestrict/discord', {
        discordUserId
      });
      return response.data;
    } catch (error: any) {
      logger.error('Discord user unrestriction failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getDiscordUserRestriction(discordUserId: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.client.get(`/api/discord/restrict/discord/${discordUserId}`);
      return response.data;
    } catch (error: any) {
      logger.error('Discord user restriction check failed:', error.response?.data || error.message);
      throw error;
    }
  }
} 
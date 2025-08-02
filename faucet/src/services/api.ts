import { BACKEND_URL } from '../constants';

export interface FaucetRequest {
  walletAddress: string;
  amount: number;
  captchaToken?: string;
}

export interface FaucetResponse {
  success: boolean;
  txHash?: string;
  message?: string;
  error?: string;
}

export interface FaucetStatusResponse {
  success: boolean;
  walletValid?: boolean;
  rateLimit?: {
    remaining: number;
    resetTime: number;
    blocked: boolean;
  };
  message?: string;
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BACKEND_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async requestFaucet(data: FaucetRequest): Promise<FaucetResponse> {
    return this.request<FaucetResponse>('/faucet/request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getFaucetStatus(walletAddress?: string): Promise<FaucetStatusResponse> {
    const params = walletAddress ? `?walletAddress=${encodeURIComponent(walletAddress)}` : '';
    return this.request<FaucetStatusResponse>(`/faucet/status${params}`);
  }

  async checkHealth(): Promise<{ success: boolean; message: string; timestamp: string }> {
    return this.request<{ success: boolean; message: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService(); 
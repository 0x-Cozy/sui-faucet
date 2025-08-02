import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001'

let ADMIN_TOKEN = localStorage.getItem('admin_token') || ''

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface LoginResponse {
  success: boolean
  token?: string
  user?: {
    id: string
    username: string
    role: string
  }
  error?: string
}

interface FaucetStats {
  faucetBalance: number
  network: {
    network: string
    protocolVersion: string
    rpcUrl: string
  }
  timestamp: string
}

interface ComprehensiveStats {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  uniqueWallets: number
  uniqueDiscordUsers: number
  totalTokensSent: number
  faucetBalance: number
  network: {
    network: string
    protocolVersion: string
    rpcUrl: string
  }
  timestamp: string
}

interface RecentRequest {
  timestamp: string
  ip: string
  walletAddress: string
  action: string
  success: boolean
  txHash?: string
  amount?: number
  error?: string
}

interface FaucetControl {
  status: 'active' | 'paused'
  timestamp: string
}

interface User {
  walletAddress: string
  ip: string
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  totalTokensReceived: number
  firstSeen: Date
  lastSeen: Date
  isBanned: boolean
  banReason?: string
  banDate?: Date
}

interface UserHistory {
  walletAddress: string
  requests: RecentRequest[]
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  totalTokensReceived: number
  averageAmount: number
}

interface UserAnalytics {
  totalUsers: number
  activeUsers: number
  bannedUsers: number
  newUsersToday: number
  topUsers: User[]
  requestTrends: {
    date: string
    requests: number
    successful: number
    failed: number
  }[]
  tokenDistribution: {
    range: string
    count: number
  }[]
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface FaucetBalance {
  balance: number
  currency: string
  timestamp: string
}

interface NetworkInfo {
  network: string
  rpcUrl: string
  environment?: string
  isAdmin?: boolean
}

interface RateLimitInfo {
  remaining: number
  resetTime: number
  blocked: boolean
}

interface WalletRateLimit {
  walletAddress: string
  rateLimit: RateLimitInfo
}

interface FaucetRequest {
  timestamp: string
  ip: string
  walletAddress: string
  action: string
  success: boolean
  txHash?: string
  amount?: number
  error?: string
}

class ApiService {
  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    
    if (ADMIN_TOKEN) {
      headers['Authorization'] = `Bearer ${ADMIN_TOKEN}`
    }
    
    return headers
  }

  setAdminToken(token: string) {
    ADMIN_TOKEN = token
    localStorage.setItem('admin_token', token)
  }

  clearAdminToken() {
    ADMIN_TOKEN = ''
    localStorage.removeItem('admin_token')
  }

  isAuthenticated(): boolean {
    return !!ADMIN_TOKEN
  }

  private async request<T>(endpoint: string, options: any = {}): Promise<ApiResponse<T>> {
    try {
      const response = await axios({
        method: options.method || 'GET',
        url: `${API_BASE_URL}/api/admin${endpoint}`,
        headers: this.getHeaders(),
        data: options.data,
        params: options.params
      })

      return response.data
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.clearAdminToken()
      }
      
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Network error'
      }
    }
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/login`, {
        username,
        password
      })

      if (response.data.success && response.data.token) {
        this.setAdminToken(response.data.token)
      }

      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Login failed'
      }
    }
  }

  async checkHealth(): Promise<ApiResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`)
      return { success: true, data: response.data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async getStats(): Promise<ApiResponse<any>> {
    const response = await this.request<any>('/stats')
    
    // The backend returns { success: true, stats: {...} }
    // We need to map it to { success: true, data: {...} }
    if (response.success && (response as any).stats) {
      return {
        success: true,
        data: (response as any).stats
      }
    }
    return response
  }

  async getBalance(): Promise<ApiResponse<FaucetBalance>> {
    return this.request<FaucetBalance>('/balance')
  }

  async getNetworkInfo(): Promise<ApiResponse<NetworkInfo>> {
    return this.request<NetworkInfo>('/network')
  }

  async getRateLimit(walletAddress: string): Promise<ApiResponse<WalletRateLimit>> {
    return this.request<WalletRateLimit>(`/rate-limit/${walletAddress}`)
  }

  async getFaucetStatus(walletAddress: string): Promise<ApiResponse<{walletValid: boolean, rateLimit: RateLimitInfo}>> {
    return this.request<{walletValid: boolean, rateLimit: RateLimitInfo}>(`/faucet-status/${walletAddress}`)
  }

  async requestTokens(walletAddress: string, amount: number): Promise<ApiResponse<{txHash: string, message: string}>> {
    return this.request<{txHash: string, message: string}>('/request', {
      method: 'POST',
      data: { walletAddress, amount }
    })
  }

  async getComprehensiveStats(): Promise<ApiResponse<any>> {
    const response = await this.request<any>('/stats')
    
    // The backend returns { success: true, stats: {...} }
    // We need to map it to { success: true, data: {...} }
    if (response.success && (response as any).stats) {
      return {
        success: true,
        data: (response as any).stats
      }
    }
    return response
  }

  async getRecentRequests(limit: number = 10): Promise<ApiResponse<RecentRequest[]>> {
    return this.request<RecentRequest[]>(`/transactions/recent?limit=${limit}`)
  }

  async getAdminTransactions(limit: number = 20, source?: string): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams()
    params.append('limit', limit.toString())
    if (source) {
      params.append('source', source)
    }
    const response = await this.request<any>(`/transactions/recent?${params.toString()}`)
    
    // The backend returns { success: true, recentActivity: [...] }
    // We need to map it to { success: true, data: [...] }
    if (response.success && (response as any).recentActivity) {
      return {
        success: true,
        data: (response as any).recentActivity
      }
    }
    return response
  }

  async clearRateLimits(ip?: string, walletAddress?: string): Promise<ApiResponse<{message: string}>> {
    const params: any = {}
    if (ip) params.ip = ip
    if (walletAddress) params.walletAddress = walletAddress
    
    return this.request<{message: string}>('/clear-rate-limits', {
      method: 'POST',
      params
    })
  }

  async controlFaucet(action: 'pause' | 'resume'): Promise<ApiResponse<{message: string, data: FaucetControl}>> {
    return this.request<{message: string, data: FaucetControl}>(`/bot/${action}`, {
      method: 'POST',
      data: { reason: `Admin ${action} request` }
    })
  }

  async getUsers(page: number = 1, limit: number = 20, search: string = ''): Promise<ApiResponse<{users: User[], pagination: Pagination}>> {
    return this.request<{users: User[], pagination: Pagination}>(`/users?page=${page}&limit=${limit}&search=${search}`)
  }

  async getUserHistory(walletAddress: string): Promise<ApiResponse<UserHistory>> {
    return this.request<UserHistory>(`/transactions/wallet/${walletAddress}`)
  }

  async banUser(walletAddress: string, reason: string, duration?: number): Promise<ApiResponse<{message: string, data: any}>> {
    return this.request<{message: string, data: any}>('/restrict/wallet', {
      method: 'POST',
      data: { walletAddress, reason, duration }
    })
  }

  async unbanUser(walletAddress: string): Promise<ApiResponse<{message: string}>> {
    return this.request<{message: string}>('/unrestrict/wallet', {
      method: 'POST',
      data: { walletAddress }
    })
  }

  async getBotStatus(): Promise<ApiResponse<any>> {
    return this.request<any>('/bot/status')
  }

  async pauseBot(reason: string): Promise<ApiResponse<{message: string}>> {
    return this.request<{message: string}>('/bot/pause', {
      method: 'POST',
      data: { reason }
    })
  }

  async unpauseBot(): Promise<ApiResponse<{message: string}>> {
    return this.request<{message: string}>('/bot/unpause', {
      method: 'POST'
    })
  }

  async restrictDiscordUser(discordUserId: string, reason: string, duration?: number): Promise<ApiResponse<{message: string}>> {
    return this.request<{message: string}>('/restrict/discord', {
      method: 'POST',
      data: { discordUserId, reason, duration }
    })
  }

  async unrestrictDiscordUser(discordUserId: string): Promise<ApiResponse<{message: string}>> {
    return this.request<{message: string}>('/unrestrict/discord', {
      method: 'POST',
      data: { discordUserId }
    })
  }

  async getDiscordUserRestriction(discordUserId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/restrict/discord/${discordUserId}`)
  }

  async restrictIP(ip: string, reason: string, duration?: number): Promise<ApiResponse<{message: string}>> {
    return this.request<{message: string}>('/restrict/ip', {
      method: 'POST',
      data: { ip, reason, duration }
    })
  }

  async unrestrictIP(ip: string): Promise<ApiResponse<{message: string}>> {
    return this.request<{message: string}>('/unrestrict/ip', {
      method: 'POST',
      data: { ip }
    })
  }

  async getIPRestriction(ip: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/restrict/ip/${ip}`)
  }

  async restrictWallet(walletAddress: string, reason: string, duration?: number): Promise<ApiResponse<{message: string}>> {
    return this.request<{message: string}>('/restrict/wallet', {
      method: 'POST',
      data: { walletAddress, reason, duration }
    })
  }

  async unrestrictWallet(walletAddress: string): Promise<ApiResponse<{message: string}>> {
    return this.request<{message: string}>('/unrestrict/wallet', {
      method: 'POST',
      data: { walletAddress }
    })
  }

  async getWalletRestriction(walletAddress: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/restrict/wallet/${walletAddress}`)
  }
}

export const apiService = new ApiService()
export type { 
  FaucetStats, 
  FaucetBalance, 
  NetworkInfo, 
  RateLimitInfo, 
  WalletRateLimit, 
  FaucetRequest,
  ComprehensiveStats,
  RecentRequest,
  FaucetControl,
  User,
  UserHistory,
  UserAnalytics,
  Pagination
} 
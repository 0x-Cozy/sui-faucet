import { Request } from 'express';
export interface FaucetRequest {
    walletAddress: string;
    amount?: number;
    ip: string;
    userAgent?: string;
}
export interface FaucetResponse {
    success: boolean;
    txHash?: string;
    error?: string;
    message?: string;
}
export interface RateLimitInfo {
    remaining: number;
    resetTime: number;
    blocked: boolean;
}
export interface AdminStats {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    uniqueWallets: number;
    totalTokensSent: number;
}
export interface LogEntry {
    timestamp: Date;
    ip: string;
    walletAddress: string;
    action: string;
    success: boolean;
    error?: string;
    txHash?: string;
    amount?: number;
    discordUserId?: string | bigint;
}
export interface WalletValidation {
    isValid: boolean;
    error?: string;
}
export interface AuthenticatedRequest extends Request {
    isAdmin?: boolean;
}
export interface User {
    walletAddress: string;
    ip: string;
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    totalTokensReceived: number;
    firstSeen: Date;
    lastSeen: Date;
    isBanned: boolean;
    banReason?: string;
    banDate?: Date;
}
export interface UserAnalytics {
    totalUsers: number;
    activeUsers: number;
    bannedUsers: number;
    newUsersToday: number;
    topUsers: User[];
    requestTrends: {
        date: string;
        requests: number;
        successful: number;
        failed: number;
    }[];
    tokenDistribution: {
        range: string;
        count: number;
    }[];
}
export interface BanUserRequest {
    walletAddress: string;
    reason: string;
    duration?: number;
}
export interface UserHistory {
    walletAddress: string;
    requests: LogEntry[];
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    totalTokensReceived: number;
    averageAmount: number;
}
//# sourceMappingURL=index.d.ts.map
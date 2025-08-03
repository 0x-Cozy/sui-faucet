export interface RequestHistoryData {
    walletAddress: string;
    amount: number;
    source: 'frontend' | 'discord';
    discordUserId?: string;
    ip?: string;
    txHash?: string;
    success: boolean;
    error?: string;
    rateLimitInfo?: {
        remaining: number;
        resetTime: number;
        blocked: boolean;
    };
}
export declare const logRequest: (data: RequestHistoryData) => Promise<void>;
export declare const getUserHistory: (discordUserId: string, limit?: number) => Promise<any[]>;
export declare const getWalletHistory: (walletAddress: string, limit?: number) => Promise<any[]>;
export declare const getBotStats: () => Promise<any>;
export declare const getRestrictedUsers: () => Promise<string[]>;
export declare const getRecentActivity: (limit?: number, source?: string) => Promise<any[]>;
//# sourceMappingURL=historyService.d.ts.map
export interface AdminTransactionData {
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
export declare const getAdminUserHistory: (discordUserId: string, limit?: number) => Promise<any[]>;
export declare const getAdminWalletHistory: (walletAddress: string, limit?: number) => Promise<any[]>;
export declare const getAdminRecentActivity: (limit?: number, source?: string) => Promise<any[]>;
export declare const getAdminTransactionStats: () => Promise<any>;
//# sourceMappingURL=adminHistoryService.d.ts.map
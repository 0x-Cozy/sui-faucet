export interface DiscordRateLimitInfo {
    remaining: number;
    resetTime: number;
    blocked: boolean;
}
export declare const checkDiscordRateLimit: (discordUserId: string, walletAddress: string) => Promise<DiscordRateLimitInfo>;
export declare const consumeDiscordRateLimit: (discordUserId: string, walletAddress: string) => Promise<void>;
export declare const getDiscordRateLimitInfo: (discordUserId: string, walletAddress: string) => Promise<DiscordRateLimitInfo>;
//# sourceMappingURL=discordRateLimiter.d.ts.map
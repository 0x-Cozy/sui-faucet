export interface RestrictionInfo {
    isRestricted: boolean;
    reason?: string;
    restrictedBy?: string;
    restrictedAt?: Date;
    expiresAt?: Date;
}
export declare const restrictDiscordUser: (discordUserId: string, reason: string, restrictedBy: string, duration?: number) => Promise<boolean>;
export declare const unrestrictDiscordUser: (discordUserId: string) => Promise<boolean>;
export declare const isDiscordUserRestricted: (discordUserId: string) => Promise<RestrictionInfo>;
export declare const restrictIP: (ip: string, reason: string, restrictedBy: string, duration?: number) => Promise<boolean>;
export declare const unrestrictIP: (ip: string) => Promise<boolean>;
export declare const isIPRestricted: (ip: string) => Promise<RestrictionInfo>;
export declare const restrictWallet: (walletAddress: string, reason: string, restrictedBy: string, duration?: number) => Promise<boolean>;
export declare const unrestrictWallet: (walletAddress: string) => Promise<boolean>;
export declare const isWalletRestricted: (walletAddress: string) => Promise<RestrictionInfo>;
//# sourceMappingURL=restrictionService.d.ts.map
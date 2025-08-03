import { RateLimitInfo } from '../types';
export declare const checkRateLimit: (ip: string, walletAddress: string) => Promise<RateLimitInfo>;
export declare const consumeRateLimit: (ip: string, walletAddress: string) => Promise<void>;
export declare const getRateLimitInfo: (ip: string, walletAddress: string) => Promise<RateLimitInfo>;
export declare const clearRateLimits: (ip?: string, walletAddress?: string) => Promise<void>;
//# sourceMappingURL=rateLimiter.d.ts.map
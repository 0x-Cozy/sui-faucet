import { Document } from 'mongoose';
export interface IRequestHistory extends Document {
    walletAddress: string;
    amount: number;
    source: 'frontend' | 'discord';
    discordUserId?: string;
    ip?: string;
    txHash?: string;
    success: boolean;
    error?: string;
    timestamp: Date;
    rateLimitInfo?: {
        remaining: number;
        resetTime: number;
        blocked: boolean;
    };
}
export declare const RequestHistory: import("mongoose").Model<IRequestHistory, {}, {}, {}, Document<unknown, {}, IRequestHistory, {}, {}> & IRequestHistory & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=RequestHistory.d.ts.map
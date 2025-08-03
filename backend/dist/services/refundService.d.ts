export interface RefundData {
    walletAddress: string;
    amount: number;
    refundedBy: string;
    txHash?: string;
}
export interface RefundRecord {
    id: string;
    walletAddress: string;
    amount: number;
    refundedBy: string;
    txHash: string | null;
    createdAt: Date;
}
export declare const logRefund: (data: RefundData) => Promise<RefundRecord | null>;
export declare const getRefundsByWallet: (walletAddress: string) => Promise<RefundRecord[]>;
export declare const getRefundsByUser: (refundedBy: string) => Promise<RefundRecord[]>;
export declare const getRefundStats: () => Promise<any>;
//# sourceMappingURL=refundService.d.ts.map
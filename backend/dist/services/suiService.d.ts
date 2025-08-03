import { WalletValidation } from '../types';
export declare const validateWalletAddress: (address: string) => WalletValidation;
export declare const getUserBalance: (address: string) => Promise<string>;
export declare const sendTokens: (toAddress: string, amount?: number) => Promise<string>;
export declare const getFaucetBalance: () => Promise<number>;
export declare const getNetworkInfo: () => Promise<{
    network: string;
    protocolVersion: string;
    rpcUrl: string;
}>;
//# sourceMappingURL=suiService.d.ts.map
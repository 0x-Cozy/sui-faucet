export declare const generateApiKey: () => string;
export declare const validateApiKey: (apiKey: string) => Promise<{
    walletAddress: string;
    id: string;
    createdAt: Date;
    name: string;
    updatedAt: Date;
    description: string | null;
    apiKey: string;
    isActive: boolean;
} | null>;
export declare const createApiApp: (walletAddress: string, name: string, description?: string) => Promise<{
    walletAddress: string;
    id: string;
    createdAt: Date;
    name: string;
    updatedAt: Date;
    description: string | null;
    apiKey: string;
    isActive: boolean;
}>;
export declare const getUserApps: (walletAddress: string) => Promise<{
    walletAddress: string;
    id: string;
    createdAt: Date;
    name: string;
    updatedAt: Date;
    description: string | null;
    apiKey: string;
    isActive: boolean;
}[]>;
export declare const deleteApiApp: (id: string, walletAddress: string) => Promise<import(".prisma/client").Prisma.BatchPayload>;
export declare const logApiUsage: (appId: string, endpoint: string, ip: string, success: boolean, error?: string) => Promise<{
    success: boolean;
    error: string | null;
    id: string;
    ip: string | null;
    createdAt: Date;
    appId: string;
    endpoint: string;
}>;
export declare const getAppStats: (appId: string) => Promise<{
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    recentUsage: {
        success: boolean;
        error: string | null;
        id: string;
        ip: string | null;
        createdAt: Date;
        appId: string;
        endpoint: string;
    }[];
}>;
//# sourceMappingURL=apiKeyService.d.ts.map
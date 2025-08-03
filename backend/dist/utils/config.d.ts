export declare const config: {
    server: {
        port: string | number;
        nodeEnv: string;
    };
    sui: {
        network: string;
        rpcUrl: string;
        faucetMnemonic: string;
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
        blockDurationMs: number;
    };
    redis: {
        url: string;
        token: string;
    };
    jwt: {
        secret: string;
    };
    database: {
        url: string;
    };
    admin: {
        token: string;
    };
    api: {
        key: string;
    };
    captcha: {
        siteKey: string;
        secretKey: string;
    };
    cors: {
        origin: string;
    };
};
//# sourceMappingURL=config.d.ts.map
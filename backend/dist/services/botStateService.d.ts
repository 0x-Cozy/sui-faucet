export interface BotStatus {
    isPaused: boolean;
    pauseReason?: string;
    pausedBy?: string;
    pausedAt?: Date;
}
export declare const getBotStatus: () => Promise<BotStatus>;
export declare const pauseBot: (reason: string, pausedBy: string) => Promise<boolean>;
export declare const unpauseBot: (unpausedBy: string) => Promise<boolean>;
export declare const isBotPaused: () => Promise<boolean>;
//# sourceMappingURL=botStateService.d.ts.map
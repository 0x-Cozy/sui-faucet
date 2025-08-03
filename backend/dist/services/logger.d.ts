import winston from 'winston';
import { LogEntry } from '../types';
declare const logger: winston.Logger;
export declare const logFaucetRequest: (entry: LogEntry) => void;
export declare const logError: (error: Error, context?: any) => void;
export declare const logRateLimit: (ip: string, walletAddress: string, blocked: boolean) => void;
export default logger;
//# sourceMappingURL=logger.d.ts.map
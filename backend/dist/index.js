"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./utils/config");
const logger_1 = __importDefault(require("./services/logger"));
const startServer = async () => {
    try {
        const port = config_1.config.server.port;
        app_1.default.listen(port, () => {
            console.log(`sui faucet backend running on port ${port} ${config_1.config.server.nodeEnv} ${config_1.config.sui.network} ${config_1.config.sui.rpcUrl}`);
            logger_1.default.info('server started', {
                port,
                environment: config_1.config.server.nodeEnv,
                network: config_1.config.sui.network
            });
        });
    }
    catch (error) {
        console.error('failed to start server:', error);
        logger_1.default.error('server startup failed', { error });
        process.exit(1);
    }
};
process.on('SIGTERM', () => {
    console.log('received sigterm, shutting down gracefully');
    logger_1.default.info('server shutting down');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('received sigint, shutting down gracefully');
    logger_1.default.info('server shutting down');
    process.exit(0);
});
// handle exceptions
process.on('uncaughtException', (error) => {
    console.error('uncaught exception:', error);
    logger_1.default.error('uncaught exception', { error });
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('unhandled rejection at:', promise, 'reason:', reason);
    logger_1.default.error('unhandled rejection', { reason, promise });
    process.exit(1);
});
startServer();
//# sourceMappingURL=index.js.map
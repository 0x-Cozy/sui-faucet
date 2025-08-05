"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppStats = exports.logApiUsage = exports.deleteApiApp = exports.getUserApps = exports.createApiApp = exports.validateApiKey = exports.generateApiKey = void 0;
const crypto_1 = __importDefault(require("crypto"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const generateApiKey = () => {
    return `fm_${crypto_1.default.randomBytes(32).toString('hex')}`;
};
exports.generateApiKey = generateApiKey;
const validateApiKey = async (apiKey) => {
    const app = await prisma.apiApp.findUnique({
        where: {
            apiKey,
            isActive: true
        }
    });
    return app;
};
exports.validateApiKey = validateApiKey;
const createApiApp = async (walletAddress, name, description) => {
    const apiKey = (0, exports.generateApiKey)();
    const app = await prisma.apiApp.create({
        data: {
            walletAddress,
            name,
            description,
            apiKey
        }
    });
    return app;
};
exports.createApiApp = createApiApp;
const getUserApps = async (walletAddress) => {
    return await prisma.apiApp.findMany({
        where: { walletAddress },
        orderBy: { createdAt: 'desc' }
    });
};
exports.getUserApps = getUserApps;
const deleteApiApp = async (id, walletAddress) => {
    return await prisma.apiApp.deleteMany({
        where: {
            id,
            walletAddress
        }
    });
};
exports.deleteApiApp = deleteApiApp;
const logApiUsage = async (appId, endpoint, ip, success, error) => {
    return await prisma.apiUsage.create({
        data: {
            appId,
            endpoint,
            ip,
            success,
            error
        }
    });
};
exports.logApiUsage = logApiUsage;
const getAppStats = async (appId) => {
    const [totalRequests, successfulRequests, recentUsage] = await Promise.all([
        prisma.apiUsage.count({ where: { appId } }),
        prisma.apiUsage.count({ where: { appId, success: true } }),
        prisma.apiUsage.findMany({
            where: { appId },
            orderBy: { createdAt: 'desc' },
            take: 10
        })
    ]);
    return {
        totalRequests,
        successfulRequests,
        failedRequests: totalRequests - successfulRequests,
        recentUsage
    };
};
exports.getAppStats = getAppStats;
//# sourceMappingURL=apiKeyService.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyAuth = void 0;
const apiKeyService_1 = require("../services/apiKeyService");
const apiKeyAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'api key required'
        });
    }
    const apiKey = authHeader.substring(7);
    const app = await (0, apiKeyService_1.validateApiKey)(apiKey);
    if (!app) {
        return res.status(401).json({
            success: false,
            error: 'invalid api key'
        });
    }
    req.apiApp = app;
    next();
};
exports.apiKeyAuth = apiKeyAuth;
//# sourceMappingURL=apiKeyAuth.js.map
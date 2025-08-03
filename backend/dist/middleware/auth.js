"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdminToken = exports.optionalAuth = exports.apiKeyAuth = exports.adminAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../utils/config");
const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            error: 'authentication required'
        });
        return;
    }
    const token = authHeader.substring(7);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        if (decoded.role !== 'admin') {
            res.status(403).json({
                success: false,
                error: 'admin access required'
            });
            return;
        }
        ;
        req.admin = {
            id: decoded.id,
            username: decoded.username,
            role: decoded.role
        };
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            error: 'invalid token'
        });
    }
};
exports.adminAuth = adminAuth;
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== config_1.config.api.key) {
        res.status(401).json({
            success: false,
            error: 'invalid api key'
        });
        return;
    }
    next();
};
exports.apiKeyAuth = apiKeyAuth;
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
            req.isAdmin = decoded.role === 'admin';
        }
        catch (error) {
            req.isAdmin = false;
        }
    }
    else {
        req.isAdmin = false;
    }
    next();
};
exports.optionalAuth = optionalAuth;
const generateAdminToken = (username) => {
    return jsonwebtoken_1.default.sign({
        id: 'admin',
        username,
        role: 'admin'
    }, config_1.config.jwt.secret, { expiresIn: '24h' });
};
exports.generateAdminToken = generateAdminToken;
//# sourceMappingURL=auth.js.map
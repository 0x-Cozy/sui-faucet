"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCaptcha = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../utils/config");
const verifyCaptcha = async (token, ip) => {
    try {
        if (!config_1.config.captcha.secretKey) {
            console.warn('hCaptcha secret key not configured, skipping verification');
            return { success: true };
        }
        const response = await axios_1.default.post('https://hcaptcha.com/siteverify', {
            secret: config_1.config.captcha.secretKey,
            response: token,
            remoteip: ip
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const data = response.data;
        if (!data.success) {
            const errorCodes = data['error-codes'] || [];
            console.error('Captcha verification failed:', errorCodes);
            return {
                success: false,
                error: `Captcha verification failed: ${errorCodes.join(', ')}`
            };
        }
        // Remove hostname check since we don't have domain configured
        // The hCaptcha service will handle domain validation on their end
        //TODO
        return { success: true };
    }
    catch (error) {
        console.error('Captcha verification error:', error);
        return {
            success: false,
            error: 'Captcha verification service unavailable'
        };
    }
};
exports.verifyCaptcha = verifyCaptcha;
//# sourceMappingURL=captchaService.js.map
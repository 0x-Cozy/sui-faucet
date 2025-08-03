"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoleConfig = exports.setRoleConfig = exports.getRoleConfig = void 0;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("./logger"));
const prisma = new client_1.PrismaClient();
const getRoleConfig = async (guildId) => {
    try {
        const config = await prisma.discordRoleConfig.findUnique({
            where: { guildId }
        });
        if (!config) {
            return null;
        }
        return {
            guildId: config.guildId,
            adminRoleId: config.adminRoleId || undefined,
            modRoleId: config.modRoleId || undefined
        };
    }
    catch (error) {
        logger_1.default.error('Failed to get Discord role config:', error);
        return null;
    }
};
exports.getRoleConfig = getRoleConfig;
const setRoleConfig = async (guildId, adminRoleId, modRoleId) => {
    try {
        await prisma.discordRoleConfig.upsert({
            where: { guildId },
            update: {
                adminRoleId,
                modRoleId,
                updatedAt: new Date()
            },
            create: {
                guildId,
                adminRoleId,
                modRoleId
            }
        });
        logger_1.default.info(`Discord role config updated for guild ${guildId}: admin=${adminRoleId}, mod=${modRoleId}`);
        return true;
    }
    catch (error) {
        logger_1.default.error('Failed to set Discord role config:', error);
        return false;
    }
};
exports.setRoleConfig = setRoleConfig;
const deleteRoleConfig = async (guildId) => {
    try {
        await prisma.discordRoleConfig.delete({
            where: { guildId }
        });
        logger_1.default.info(`Discord role config deleted for guild ${guildId}`);
        return true;
    }
    catch (error) {
        logger_1.default.error('Failed to delete Discord role config:', error);
        return false;
    }
};
exports.deleteRoleConfig = deleteRoleConfig;
//# sourceMappingURL=discordRoleService.js.map
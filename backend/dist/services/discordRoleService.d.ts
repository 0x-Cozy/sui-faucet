export interface DiscordRoleConfig {
    guildId: string;
    adminRoleId?: string;
    modRoleId?: string;
}
export declare const getRoleConfig: (guildId: string) => Promise<DiscordRoleConfig | null>;
export declare const setRoleConfig: (guildId: string, adminRoleId?: string, modRoleId?: string) => Promise<boolean>;
export declare const deleteRoleConfig: (guildId: string) => Promise<boolean>;
//# sourceMappingURL=discordRoleService.d.ts.map
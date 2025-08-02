import { isValidSuiAddress } from '@mysten/sui/utils';

export class ValidationUtils {
  static isValidSuiAddress(address: string): boolean {
    return isValidSuiAddress(address.trim());
  }

  static isValidSuiAmount(amount: number): boolean {
    return amount >= 0.1 && amount <= 1.0 && amount % 0.1 === 0;
  }

  static formatSuiAmount(amount: number): string {
    return amount.toFixed(4);
  }

  static formatAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  static formatTxHash(txHash: string): string {
    if (!txHash) return '';
    return `${txHash.slice(0, 8)}...${txHash.slice(-8)}`;
  }

  static isValidDiscordId(id: string): boolean {
    return /^\d{17,19}$/.test(id);
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  static hasPermission(member: any, permission: string): boolean {
    return member?.permissions?.has(permission) || false;
  }

  static hasRole(member: any, roleId: string): boolean {
    return member?.roles?.cache?.has(roleId) || false;
  }
} 
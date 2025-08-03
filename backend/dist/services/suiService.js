"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNetworkInfo = exports.getFaucetBalance = exports.sendTokens = exports.getUserBalance = exports.validateWalletAddress = void 0;
const client_1 = require("@mysten/sui/client");
const ed25519_1 = require("@mysten/sui/keypairs/ed25519");
const transactions_1 = require("@mysten/sui/transactions");
const utils_1 = require("@mysten/sui/utils");
const config_1 = require("../utils/config");
const client = new client_1.SuiClient({ url: config_1.config.sui.rpcUrl });
let faucetKeypair = null;
const initializeFaucetKeypair = () => {
    if (!config_1.config.sui.faucetMnemonic) {
        throw new Error('faucet mnemonic not configured');
    }
    try {
        faucetKeypair = ed25519_1.Ed25519Keypair.deriveKeypair(config_1.config.sui.faucetMnemonic);
        const address = faucetKeypair.getPublicKey().toSuiAddress();
        console.log('faucet keypair initialized successfully');
        console.log(`faucet address: ${address}`);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'unknown error';
        console.error('failed to initialize faucet keypair:', errorMessage);
        throw error;
    }
};
const validateWalletAddress = (address) => {
    try {
        if (!(0, utils_1.isValidSuiAddress)(address)) {
            return { isValid: false, error: 'invalid sui address' };
        }
        return { isValid: true };
    }
    catch (error) {
        return { isValid: false, error: 'address validation failed' };
    }
};
exports.validateWalletAddress = validateWalletAddress;
const getUserBalance = async (address) => {
    try {
        const balance = await client.getBalance({
            owner: address,
            coinType: '0x2::sui::SUI'
        });
        return balance.totalBalance;
    }
    catch (error) {
        throw new Error(`failed to get balance for address ${address}: ${error}`);
    }
};
exports.getUserBalance = getUserBalance;
const sendTokens = async (toAddress, amount = 0.1) => {
    if (!faucetKeypair) {
        initializeFaucetKeypair();
    }
    if (!faucetKeypair) {
        throw new Error('faucet keypair not initialized');
    }
    const tx = new transactions_1.Transaction();
    const [coin] = tx.splitCoins(tx.gas, [amount * 1000000000]);
    tx.transferObjects([coin], toAddress);
    const result = await client.signAndExecuteTransaction({
        signer: faucetKeypair,
        transaction: tx,
        options: {
            showEffects: true,
            showObjectChanges: true
        }
    });
    if (result.effects?.status?.status !== 'success') {
        throw new Error(`transaction failed: ${result.effects?.status?.error}`);
    }
    return result.digest;
};
exports.sendTokens = sendTokens;
const getFaucetBalance = async () => {
    if (!faucetKeypair) {
        initializeFaucetKeypair();
    }
    if (!faucetKeypair) {
        throw new Error('faucet keypair not initialized');
    }
    const balance = await client.getBalance({
        owner: faucetKeypair.getPublicKey().toSuiAddress()
    });
    return Number(balance.totalBalance) / 1000000000;
};
exports.getFaucetBalance = getFaucetBalance;
const getNetworkInfo = async () => {
    try {
        const protocolConfig = await client.getProtocolConfig();
        return {
            network: config_1.config.sui.network,
            protocolVersion: protocolConfig.protocolVersion,
            rpcUrl: config_1.config.sui.rpcUrl
        };
    }
    catch (error) {
        console.error('failed to get network info:', error);
        return {
            network: config_1.config.sui.network,
            protocolVersion: 'unknown',
            rpcUrl: config_1.config.sui.rpcUrl
        };
    }
};
exports.getNetworkInfo = getNetworkInfo;
//# sourceMappingURL=suiService.js.map
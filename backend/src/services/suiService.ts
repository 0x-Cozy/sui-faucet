import { SuiClient } from '@mysten/sui/client'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { Transaction } from '@mysten/sui/transactions'
import { isValidSuiAddress } from '@mysten/sui/utils';
import { config } from '../utils/config'
import { WalletValidation } from '../types'

const client = new SuiClient({ url: config.sui.rpcUrl })

let faucetKeypair: Ed25519Keypair | null = null

const initializeFaucetKeypair = (): void => {
  if (!config.sui.faucetMnemonic) {
    throw new Error('faucet mnemonic not configured')
  }
  
  try {
    faucetKeypair = Ed25519Keypair.deriveKeypair(config.sui.faucetMnemonic)
    const address = faucetKeypair.getPublicKey().toSuiAddress()
    console.log('faucet keypair initialized successfully')
    console.log(`faucet address: ${address}`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'unknown error'
    console.error('failed to initialize faucet keypair:', errorMessage)
    throw error
  }
}

export const validateWalletAddress = (address: string): WalletValidation => {
  try {
    if (!isValidSuiAddress(address)) {
      return { isValid: false, error: 'invalid sui address' }
    }
    
    return { isValid: true }
  } catch (error) {
    return { isValid: false, error: 'address validation failed' }
  }
}

export const getUserBalance = async (address: string): Promise<string> => {
  try {
    const balance = await client.getBalance({
      owner: address,
      coinType: '0x2::sui::SUI'
    })
    
    return balance.totalBalance
  } catch (error) {
    throw new Error(`failed to get balance for address ${address}: ${error}`)
  }
}

export const sendTokens = async (toAddress: string, amount: number = 0.1): Promise<string> => {
  if (!faucetKeypair) {
    initializeFaucetKeypair()
  }
  
  if (!faucetKeypair) {
    throw new Error('faucet keypair not initialized')
  }
  
  const tx = new Transaction()
  const [coin] = tx.splitCoins(tx.gas, [amount * 1000000000])
  tx.transferObjects([coin], toAddress)
  
  const result = await client.signAndExecuteTransaction({
    signer: faucetKeypair,
    transaction: tx,
    options: {
      showEffects: true,
      showObjectChanges: true
    }
  })
  
  if (result.effects?.status?.status !== 'success') {
    throw new Error(`transaction failed: ${result.effects?.status?.error}`)
  }
  
  return result.digest
}

export const getFaucetBalance = async (): Promise<number> => {
  if (!faucetKeypair) {
    initializeFaucetKeypair()
  }
  
  if (!faucetKeypair) {
    throw new Error('faucet keypair not initialized')
  }
  
  const balance = await client.getBalance({
    owner: faucetKeypair.getPublicKey().toSuiAddress()
  })
  
  return Number(balance.totalBalance) / 1000000000
}

export const getNetworkInfo = async () => {
  try {
    const protocolConfig = await client.getProtocolConfig()
    return {
      network: config.sui.network,
      protocolVersion: protocolConfig.protocolVersion,
      rpcUrl: config.sui.rpcUrl
    }
  } catch (error) {
    console.error('failed to get network info:', error)
    return {
      network: config.sui.network,
      protocolVersion: 'unknown',
      rpcUrl: config.sui.rpcUrl
    }
  }
} 
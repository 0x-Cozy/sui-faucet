import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const generateApiKey = (): string => {
  return `fm_${crypto.randomBytes(32).toString('hex')}`
}

export const validateApiKey = async (apiKey: string) => {
  const app = await prisma.apiApp.findUnique({
    where: { 
      apiKey,
      isActive: true 
    }
  })
  return app
}

export const createApiApp = async (walletAddress: string, name: string, description?: string) => {
  const apiKey = generateApiKey()
  
  const app = await prisma.apiApp.create({
    data: {
      walletAddress,
      name,
      description,
      apiKey
    }
  })
  
  return app
}

export const getUserApps = async (walletAddress: string) => {
  return await prisma.apiApp.findMany({
    where: { walletAddress },
    orderBy: { createdAt: 'desc' }
  })
}

export const deleteApiApp = async (id: string, walletAddress: string) => {
  return await prisma.apiApp.deleteMany({
    where: { 
      id,
      walletAddress 
    }
  })
}

export const logApiUsage = async (appId: string, endpoint: string, ip: string, success: boolean, error?: string) => {
  return await prisma.apiUsage.create({
    data: {
      appId,
      endpoint,
      ip,
      success,
      error
    }
  })
}

export const getAppStats = async (appId: string) => {
  const [totalRequests, successfulRequests, recentUsage] = await Promise.all([
    prisma.apiUsage.count({ where: { appId } }),
    prisma.apiUsage.count({ where: { appId, success: true } }),
    prisma.apiUsage.findMany({
      where: { appId },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ])
  
  return {
    totalRequests,
    successfulRequests,
    failedRequests: totalRequests - successfulRequests,
    recentUsage
  }
} 
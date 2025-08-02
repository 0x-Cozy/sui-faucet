import { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import type { ComprehensiveStats } from '../services/api'
import { SkeletonCard, SkeletonChart } from './ui'

export default function Analytics() {
  const [stats, setStats] = useState<ComprehensiveStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const statsResponse = await apiService.getComprehensiveStats()
      
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data)
      } else {
        setError('Failed to load analytics')
      }
    } catch (err) {
      setError('Network error')
      console.error('Failed to fetch analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatBalance = (balance: number) => {
    return balance.toFixed(4)
  }

  const calculateSuccessRate = () => {
    if (!stats) return 0
    return stats.totalRequests > 0 ? (stats.successfulRequests / stats.totalRequests) * 100 : 0
  }

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex justify-between items-center">
          <div className="w-48 h-8 bg-sui-dark border-2 border-sui-border rounded-sm animate-pulse"></div>
          <div className="w-24 h-8 bg-sui-dark border-2 border-sui-border rounded-sm animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4 md:space-y-6">
        <h2 className="text-xl md:text-2xl font-bold text-sui-blue font-space-mono">ANALYTICS</h2>
        <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
          <p className="text-red-400 font-space-mono text-sm md:text-base">{error}</p>
          <button 
            onClick={fetchAnalytics}
            className="mt-2 bg-sui-blue text-sui-dark px-4 py-2 rounded-sm font-space-mono text-sm hover:bg-opacity-80 transition-all duration-200"
          >
            RETRY
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold text-sui-blue font-space-mono">ANALYTICS</h2>
        <button 
          onClick={fetchAnalytics}
          className="bg-sui-blue text-sui-dark px-3 py-2 rounded-sm font-space-mono text-sm hover:bg-opacity-80 transition-all duration-200"
        >
          REFRESH
        </button>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
              <h3 className="text-sm md:text-lg font-medium text-white font-space-mono">TOTAL REQUESTS</h3>
              <p className="text-2xl md:text-3xl font-bold text-sui-blue">
                {formatNumber(stats.totalRequests)}
              </p>
              <p className="text-xs md:text-sm text-white opacity-70 font-space-mono">
                All time requests
              </p>
            </div>
            
            <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
              <h3 className="text-sm md:text-lg font-medium text-white font-space-mono">SUCCESS RATE</h3>
              <p className="text-2xl md:text-3xl font-bold text-green-400">
                {calculateSuccessRate().toFixed(1)}%
              </p>
              <p className="text-xs md:text-sm text-white opacity-70 font-space-mono">
                {stats.successfulRequests} successful
              </p>
            </div>
            
            <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
              <h3 className="text-sm md:text-lg font-medium text-white font-space-mono">UNIQUE WALLETS</h3>
              <p className="text-2xl md:text-3xl font-bold text-purple-400">
                {formatNumber(stats.uniqueWallets)}
              </p>
              <p className="text-xs md:text-sm text-white opacity-70 font-space-mono">
                Distinct users served
              </p>
            </div>
            
            <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
              <h3 className="text-sm md:text-lg font-medium text-white font-space-mono">TOKENS DISTRIBUTED</h3>
              <p className="text-2xl md:text-3xl font-bold text-yellow-400">
                {formatNumber(stats.totalTokensSent)} SUI
              </p>
              <p className="text-xs md:text-sm text-white opacity-70 font-space-mono">
                Total distributed
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
              <h3 className="text-sm md:text-lg font-medium text-white font-space-mono mb-3 md:mb-4">REQUEST BREAKDOWN</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-space-mono text-sm">Successful Requests</span>
                  <span className="text-green-400 font-bold">{formatNumber(stats.successfulRequests)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-space-mono text-sm">Failed Requests</span>
                  <span className="text-red-400 font-bold">{formatNumber(stats.failedRequests)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-space-mono text-sm">Success Rate</span>
                  <span className="text-blue-400 font-bold">{calculateSuccessRate().toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
              <h3 className="text-sm md:text-lg font-medium text-white font-space-mono mb-3 md:mb-4">USER STATISTICS</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-space-mono text-sm">Unique Wallets</span>
                  <span className="text-sui-blue font-bold">{formatNumber(stats.uniqueWallets)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-space-mono text-sm">Discord Users</span>
                  <span className="text-green-400 font-bold">{formatNumber(stats.uniqueDiscordUsers)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-space-mono text-sm">Total Tokens Sent</span>
                  <span className="text-purple-400 font-bold">{formatBalance(stats.totalTokensSent)} SUI</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
            <h3 className="text-sm md:text-lg font-medium text-white font-space-mono mb-3 md:mb-4">PERFORMANCE METRICS</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{stats.successfulRequests}</p>
                <p className="text-xs text-white opacity-70 font-space-mono">SUCCESSFUL REQUESTS</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">{stats.failedRequests}</p>
                <p className="text-xs text-white opacity-70 font-space-mono">FAILED REQUESTS</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{stats.uniqueWallets}</p>
                <p className="text-xs text-white opacity-70 font-space-mono">UNIQUE USERS</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 
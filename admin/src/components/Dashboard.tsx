import { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import { SkeletonCard, SkeletonStatus } from './ui'

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [botStatus, setBotStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [statsResponse, botStatusResponse] = await Promise.all([
        apiService.getStats(),
        apiService.getBotStatus()
      ])

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data)
      }

      if (botStatusResponse.success && botStatusResponse.data) {
        setBotStatus(botStatusResponse.data)
      }

    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatBalance = (balance: number) => {
    return balance.toFixed(4)
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

        <SkeletonStatus />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4 md:space-y-6">
        <h2 className="text-xl md:text-2xl font-bold text-sui-blue font-space-mono">DASHBOARD OVERVIEW</h2>
        <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
          <p className="text-red-400 font-space-mono text-sm md:text-base">{error}</p>
          <button 
            onClick={fetchDashboardData}
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
        <h2 className="text-xl md:text-2xl font-bold text-sui-blue font-space-mono">DASHBOARD OVERVIEW</h2>
        <button 
          onClick={fetchDashboardData}
          className="bg-sui-blue text-sui-dark px-4 py-2 rounded-sm font-space-mono text-sm hover:bg-opacity-80 transition-all duration-200"
        >
          REFRESH
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
          <h3 className="text-sui-blue font-space-mono text-sm md:text-base font-bold mb-2">TOTAL REQUESTS</h3>
          <p className="text-white font-space-mono text-2xl md:text-3xl font-bold">
            {stats ? formatNumber(stats.totalRequests || 0) : '0'}
          </p>
        </div>
        
        <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
          <h3 className="text-sui-blue font-space-mono text-sm md:text-base font-bold mb-2">SUCCESSFUL REQUESTS</h3>
          <p className="text-white font-space-mono text-2xl md:text-3xl font-bold">
            {stats ? formatNumber(stats.successfulRequests || 0) : '0'}
          </p>
        </div>
        
        <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
          <h3 className="text-sui-blue font-space-mono text-sm md:text-base font-bold mb-2">UNIQUE WALLETS</h3>
          <p className="text-white font-space-mono text-2xl md:text-3xl font-bold">
            {stats ? formatNumber(stats.uniqueWallets || 0) : '0'}
          </p>
        </div>
        
        <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
          <h3 className="text-sui-blue font-space-mono text-sm md:text-base font-bold mb-2">TOTAL TOKENS SENT</h3>
          <p className="text-white font-space-mono text-2xl md:text-3xl font-bold">
            {stats ? formatBalance(stats.totalTokensSent || 0) : '0.0000'} SUI
          </p>
        </div>
      </div>

      {botStatus && (
        <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
          <h3 className="text-sui-blue font-space-mono text-sm md:text-base font-bold mb-4">BOT STATUS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-white font-space-mono text-sm">
                <span className="text-sui-blue">Status:</span> {botStatus.isPaused ? 'PAUSED' : 'ACTIVE'}
              </p>
              {botStatus.pausedBy && (
                <p className="text-white font-space-mono text-sm">
                  <span className="text-sui-blue">Paused by:</span> {botStatus.pausedBy}
                </p>
              )}
              {botStatus.pauseReason && (
                <p className="text-white font-space-mono text-sm">
                  <span className="text-sui-blue">Reason:</span> {botStatus.pauseReason}
                </p>
              )}
              {botStatus.pausedAt && (
                <p className="text-white font-space-mono text-sm">
                  <span className="text-sui-blue">Paused at:</span> {new Date(botStatus.pausedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {stats && stats.recentActivity && stats.recentActivity.length > 0 && (
        <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
          <h3 className="text-sui-blue font-space-mono text-sm md:text-base font-bold mb-4">RECENT ACTIVITY</h3>
          <div className="space-y-2">
            {stats.recentActivity.slice(0, 5).map((activity: any, index: number) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-white font-space-mono">
                  {activity.walletAddress.slice(0, 8)}...{activity.walletAddress.slice(-6)}
                </span>
                <span className={`font-space-mono ${activity.success ? 'text-green-400' : 'text-red-400'}`}>
                  {activity.success ? 'SUCCESS' : 'FAILED'}
                </span>
                <span className="text-white font-space-mono">
                  {activity.amount} SUI
                </span>
                <span className="text-white font-space-mono opacity-70">
                  {new Date(activity.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 
import { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import { SkeletonForm } from './ui'

export default function Settings() {
  const [walletAddress, setWalletAddress] = useState('')
  const [rateLimitInfo, setRateLimitInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [botStatus, setBotStatus] = useState<any>(null)
  const [controlLoading, setControlLoading] = useState(false)

  const fetchBotStatus = async () => {
    try {
      const response = await apiService.getBotStatus()
      if (response.success && response.data) {
        setBotStatus(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch bot status:', error)
    }
  }

  useEffect(() => {
    fetchBotStatus()
  }, [])

  const checkRateLimit = async () => {
    if (!walletAddress.trim()) {
      setMessage({ text: 'Please enter a wallet address', type: 'error' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await apiService.getRateLimit(walletAddress)
      
      if (response.success && response.data) {
        setRateLimitInfo(response.data.rateLimit)
        setMessage({ text: 'Rate limit info retrieved successfully', type: 'success' })
      } else {
        setMessage({ text: response.error || 'Failed to get rate limit info', type: 'error' })
      }
    } catch (error) {
      setMessage({ text: 'Network error', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (ms: number) => {
    if (ms <= 0) return 'Expired'
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  const controlFaucet = async (action: 'pause' | 'resume') => {
    setControlLoading(true)
    setMessage(null)

    try {
      const response = action === 'pause' 
        ? await apiService.pauseBot('Admin pause request')
        : await apiService.unpauseBot()
      
      if (response.success) {
        setMessage({ text: response.message || `Faucet ${action}d successfully`, type: 'success' })
        fetchBotStatus() // Refresh bot status
      } else {
        setMessage({ text: response.error || 'Failed to control faucet', type: 'error' })
      }
    } catch (error) {
      setMessage({ text: 'Network error', type: 'error' })
    } finally {
      setControlLoading(false)
    }
  }

  const clearRateLimits = async () => {
    if (!walletAddress.trim()) {
      setMessage({ text: 'Please enter a wallet address', type: 'error' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await apiService.clearRateLimits(undefined, walletAddress)
      
      if (response.success) {
        setMessage({ text: 'Rate limits cleared successfully', type: 'success' })
        setRateLimitInfo(null)
      } else {
        setMessage({ text: response.error || 'Failed to clear rate limits', type: 'error' })
      }
    } catch (error) {
      setMessage({ text: 'Network error', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="w-48 h-8 bg-sui-dark border-2 border-sui-border rounded-sm animate-pulse"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <SkeletonForm />
          <SkeletonForm />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-sui-blue font-space-mono">SETTINGS</h2>
      
      {message && (
        <div className={`p-4 rounded-sm font-space-mono text-sm ${
          message.type === 'success' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Bot Control */}
        <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
          <h3 className="text-sui-blue font-space-mono text-sm md:text-base font-bold mb-4">BOT CONTROL</h3>
          
          {botStatus && (
            <div className="mb-4">
              <p className="text-white font-space-mono text-sm mb-2">
                <span className="text-sui-blue">Status:</span> {botStatus.isPaused ? 'PAUSED' : 'ACTIVE'}
              </p>
              {botStatus.pauseReason && (
                <p className="text-white font-space-mono text-sm mb-2">
                  <span className="text-sui-blue">Reason:</span> {botStatus.pauseReason}
                </p>
              )}
            </div>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={() => controlFaucet('pause')}
              disabled={controlLoading || (botStatus?.isPaused)}
              className="bg-red-600 text-white px-4 py-2 rounded-sm font-space-mono text-sm hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
            >
              {controlLoading ? 'PAUSING...' : 'PAUSE BOT'}
            </button>
            
            <button
              onClick={() => controlFaucet('resume')}
              disabled={controlLoading || (!botStatus?.isPaused)}
              className="bg-green-600 text-white px-4 py-2 rounded-sm font-space-mono text-sm hover:bg-green-700 transition-all duration-200 disabled:opacity-50"
            >
              {controlLoading ? 'RESUMING...' : 'RESUME BOT'}
            </button>
          </div>
        </div>

        {/* Rate Limit Management */}
        <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
          <h3 className="text-sui-blue font-space-mono text-sm md:text-base font-bold mb-4">RATE LIMIT MANAGEMENT</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white font-space-mono text-sm mb-2">WALLET ADDRESS</label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter wallet address"
                className="w-full bg-sui-darker border-2 border-sui-border text-white px-3 py-2 rounded-sm font-space-mono text-sm focus:border-sui-blue focus:outline-none"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={checkRateLimit}
                disabled={loading || !walletAddress.trim()}
                className="bg-sui-blue text-sui-dark px-4 py-2 rounded-sm font-space-mono text-sm hover:bg-opacity-80 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'CHECKING...' : 'CHECK RATE LIMIT'}
              </button>
              
              <button
                onClick={clearRateLimits}
                disabled={loading || !walletAddress.trim()}
                className="bg-yellow-600 text-white px-4 py-2 rounded-sm font-space-mono text-sm hover:bg-yellow-700 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'CLEARING...' : 'CLEAR RATE LIMITS'}
              </button>
            </div>
            
            {rateLimitInfo && (
              <div className="bg-sui-darker border border-sui-border rounded-sm p-3">
                <h4 className="text-sui-blue font-space-mono text-sm font-bold mb-2">RATE LIMIT INFO</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-white font-space-mono">
                    <span className="text-sui-blue">Remaining:</span> {rateLimitInfo.remaining}
                  </p>
                  <p className="text-white font-space-mono">
                    <span className="text-sui-blue">Reset Time:</span> {formatTime(rateLimitInfo.resetTime)}
                  </p>
                  <p className="text-white font-space-mono">
                    <span className="text-sui-blue">Blocked:</span> {rateLimitInfo.blocked ? 'YES' : 'NO'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
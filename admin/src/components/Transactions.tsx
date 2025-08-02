import { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import { SkeletonTable } from './ui'

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [limit, setLimit] = useState(20)
  const [source, setSource] = useState<string>('')

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiService.getAdminTransactions(limit, source)
      
      if (response.success && response.data) {
        setTransactions(response.data)
      } else {
        setError(response.error || 'Failed to load transactions')
      }
    } catch (err) {
      setError('Network error')
      console.error('Failed to fetch transactions:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [limit, source])

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return new Date(date).toLocaleDateString()
  }

  const formatWallet = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex justify-between items-center">
          <div className="w-48 h-8 bg-sui-dark border-2 border-sui-border rounded-sm animate-pulse"></div>
          <div className="w-24 h-8 bg-sui-dark border-2 border-sui-border rounded-sm animate-pulse"></div>
        </div>
        <SkeletonTable />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4 md:space-y-6">
        <h2 className="text-xl md:text-2xl font-bold text-sui-blue font-space-mono">TRANSACTIONS</h2>
        <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
          <p className="text-red-400 font-space-mono text-sm md:text-base">{error}</p>
          <button 
            onClick={fetchTransactions}
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
        <h2 className="text-xl md:text-2xl font-bold text-sui-blue font-space-mono">TRANSACTIONS</h2>
        <div className="flex gap-2">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="bg-sui-dark border-2 border-sui-border text-white px-3 py-2 rounded-sm font-space-mono text-sm focus:border-sui-blue focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="bg-sui-dark border-2 border-sui-border text-white px-3 py-2 rounded-sm font-space-mono text-sm focus:border-sui-blue focus:outline-none"
          >
            <option value="">ALL SOURCES</option>
            <option value="frontend">FRONTEND</option>
            <option value="discord">DISCORD</option>
          </select>
          <button 
            onClick={fetchTransactions}
            className="bg-sui-blue text-sui-dark px-4 py-2 rounded-sm font-space-mono text-sm hover:bg-opacity-80 transition-all duration-200"
          >
            REFRESH
          </button>
        </div>
      </div>
      
      <div className="bg-sui-dark border-2 border-sui-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sui-border">
                <th className="text-left p-4 font-space-mono text-sm text-sui-blue">WALLET</th>
                <th className="text-left p-4 font-space-mono text-sm text-sui-blue">AMOUNT</th>
                <th className="text-left p-4 font-space-mono text-sm text-sui-blue">SOURCE</th>
                <th className="text-left p-4 font-space-mono text-sm text-sui-blue">STATUS</th>
                <th className="text-left p-4 font-space-mono text-sm text-sui-blue">TIME</th>
                <th className="text-left p-4 font-space-mono text-sm text-sui-blue">TX HASH</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index} className="border-b border-sui-border hover:bg-sui-darker">
                  <td className="p-4 font-space-mono text-sm text-white">
                    {formatWallet(tx.walletAddress)}
                  </td>
                  <td className="p-4 font-space-mono text-sm text-white">
                    {tx.amount} SUI
                  </td>
                  <td className="p-4 font-space-mono text-sm text-white">
                    {tx.source?.toUpperCase() || 'UNKNOWN'}
                  </td>
                  <td className="p-4 font-space-mono text-sm">
                    <span className={`px-2 py-1 rounded-sm text-xs ${
                      tx.success 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                    }`}>
                      {tx.success ? 'SUCCESS' : 'FAILED'}
                    </span>
                  </td>
                  <td className="p-4 font-space-mono text-sm text-white opacity-70">
                    {formatTime(new Date(tx.createdAt))}
                  </td>
                  <td className="p-4 font-space-mono text-sm text-white opacity-70">
                    {tx.txHash ? formatWallet(tx.txHash) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {transactions.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-white font-space-mono text-sm opacity-70">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  )
} 
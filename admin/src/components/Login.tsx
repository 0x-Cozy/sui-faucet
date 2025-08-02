import { useState } from 'react'
import { apiService } from '../services/api'

interface LoginProps {
  onLogin: (token: string) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await apiService.login(username, password)
      
      if (response.success && response.token) {
        onLogin(response.token)
      } else {
        setError(response.error || 'Invalid credentials')
      }
    } catch (error) {
      setError('Network error - check if backend is running')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen bg-sui-darker text-white font-orbitron flex items-center justify-center">
      <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-6 md:p-8 w-full max-w-md">
        <h1 className="text-2xl md:text-3xl font-bold text-sui-blue font-space-mono text-center mb-6">
          ADMIN LOGIN
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white font-space-mono text-sm mb-2">USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter username"
              className="w-full bg-sui-darker border-2 border-sui-border text-white px-3 py-2 rounded-sm font-space-mono text-sm focus:border-sui-blue focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-white font-space-mono text-sm mb-2">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter password"
              className="w-full bg-sui-darker border-2 border-sui-border text-white px-3 py-2 rounded-sm font-space-mono text-sm focus:border-sui-blue focus:outline-none"
            />
          </div>
          
          {error && (
            <div className="bg-red-600 text-white p-3 rounded-sm font-space-mono text-sm">
              {error}
            </div>
          )}
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-sui-blue text-sui-dark px-4 py-2 rounded-sm font-space-mono text-sm font-bold hover:bg-opacity-80 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'CONNECTING...' : 'LOGIN'}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-white opacity-70 font-space-mono">
            Default: USERNAME: admin PASSWORD: dev_admin_token
          </p>
        </div>
      </div>
    </div>
  )
} 
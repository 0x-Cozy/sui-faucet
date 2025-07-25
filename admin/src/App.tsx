import { useState, useEffect } from 'react'
import { FaBars, FaTimes, FaChartBar, FaUsers, FaExchangeAlt, FaCog, FaSignOutAlt } from 'react-icons/fa'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // body scroll lock on mobile when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-sui-darker text-white font-orbitron relative overflow-hidden">
      <header className="h-[100px] border-box flex justify-between items-center px-4 sm:px-8 md:px-12 pt-4 sm:pt-4 md:pt-0 relative z-10 border-b-2 border-sui-border">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="md:hidden bg-sui-dark border-2 border-sui-blue p-2 rounded-sm hover:bg-sui-blue hover:text-sui-dark transition-all duration-200 flex items-center justify-center"
          >
            <FaBars className="w-5 h-5" />
          </button>
          <h1 className="text-lg sm:text-xl md:text-[1.7rem] font-black text-sui-blue uppercase tracking-[1px] sm:tracking-[2px] md:tracking-[3px] font-space-mono">
            ADMIN DASHBOARD
          </h1>
        </div>
        
        <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm text-white opacity-70 tracking-[0.5px] sm:tracking-[1px] items-center">
          <span className="text-sui-blue font-bold hidden sm:block">Admin Panel</span>
          <button className="bg-sui-dark text-white border-2 border-sui-blue px-2 sm:px-3 py-1 sm:py-2 text-xs font-bold text-center shadow-[0_0_3px_rgba(111,188,240,0.6)] cursor-pointer tracking-[0.5px] transition-all duration-200 hover:bg-sui-blue hover:text-sui-dark hover:scale-105 flex items-center gap-2">
            <FaSignOutAlt className="w-3 h-3" />
            LOGOUT
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-100px)] border-box">
        <nav className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-20 w-64 bg-sui-darker border-r-2 border-sui-border p-4 md:p-6 h-full transition-transform duration-300 ease-in-out`}>
          <div className="flex justify-end items-center mb-4 md:hidden">
            <button 
              onClick={toggleSidebar}
              className="bg-sui-dark border-2 border-sui-blue p-1 rounded-sm hover:bg-sui-blue hover:text-sui-dark transition-all duration-200 flex items-center justify-center"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2 md:space-y-4">
            <button
              onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
              className={`w-full text-left py-2 md:py-3 px-3 md:px-4 rounded-sm font-space-mono text-xs md:text-sm font-bold transition-all duration-200 flex items-center gap-3 ${
                activeTab === 'dashboard'
                  ? 'bg-sui-blue bg-opacity-10 text-sui-blue border-2 border-sui-blue'
                  : 'text-white opacity-70 hover:opacity-100 hover:bg-sui-darker border-2 border-transparent'
              }`}
            >
              <FaChartBar className="w-4 h-4" />
              OVERVIEW
            </button>
            <button
              onClick={() => { setActiveTab('users'); setSidebarOpen(false); }}
              className={`w-full text-left py-2 md:py-3 px-3 md:px-4 rounded-sm font-space-mono text-xs md:text-sm font-bold transition-all duration-200 flex items-center gap-3 ${
                activeTab === 'users'
                  ? 'bg-sui-blue bg-opacity-10 text-sui-blue border-2 border-sui-blue'
                  : 'text-white opacity-70 hover:opacity-100 hover:bg-sui-darker border-2 border-transparent'
              }`}
            >
              <FaUsers className="w-4 h-4" />
              USERS
            </button>
            <button
              onClick={() => { setActiveTab('transactions'); setSidebarOpen(false); }}
              className={`w-full text-left py-2 md:py-3 px-3 md:px-4 rounded-sm font-space-mono text-xs md:text-sm font-bold transition-all duration-200 flex items-center gap-3 ${
                activeTab === 'transactions'
                  ? 'bg-sui-blue bg-opacity-10 text-sui-blue border-2 border-sui-blue'
                  : 'text-white opacity-70 hover:opacity-100 hover:bg-sui-darker border-2 border-transparent'
              }`}
            >
              <FaExchangeAlt className="w-4 h-4" />
              TRANSACTIONS
            </button>
            <button
              onClick={() => { setActiveTab('analytics'); setSidebarOpen(false); }}
              className={`w-full text-left py-2 md:py-3 px-3 md:px-4 rounded-sm font-space-mono text-xs md:text-sm font-bold transition-all duration-200 flex items-center gap-3 ${
                activeTab === 'analytics'
                  ? 'bg-sui-blue bg-opacity-10 text-sui-blue border-2 border-sui-blue'
                  : 'text-white opacity-70 hover:opacity-100 hover:bg-sui-darker border-2 border-transparent'
              }`}
            >
              <FaChartBar className="w-4 h-4" />
              ANALYTICS
            </button>
            <button
              onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
              className={`w-full text-left py-2 md:py-3 px-3 md:px-4 rounded-sm font-space-mono text-xs md:text-sm font-bold transition-all duration-200 flex items-center gap-3 ${
                activeTab === 'settings'
                  ? 'bg-sui-blue bg-opacity-10 text-sui-blue border-2 border-sui-blue'
                  : 'text-white opacity-70 hover:opacity-100 hover:bg-sui-darker border-2 border-transparent'
              }`}
            >
              <FaCog className="w-4 h-4" />
              SETTINGS
            </button>
          </div>
        </nav>

        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-sui-blue font-space-mono">DASHBOARD OVERVIEW</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
                  <h3 className="text-sm md:text-lg font-medium text-white font-space-mono">TOTAL USERS</h3>
                  <p className="text-2xl md:text-3xl font-bold text-sui-blue">1,234</p>
                  <p className="text-xs md:text-sm text-white opacity-70 font-space-mono">+12% from last month</p>
                </div>
                
                <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
                  <h3 className="text-sm md:text-lg font-medium text-white font-space-mono">SUI DISTRIBUTED</h3>
                  <p className="text-2xl md:text-3xl font-bold text-green-400">5,678</p>
                  <p className="text-xs md:text-sm text-white opacity-70 font-space-mono">+8% from last month</p>
                </div>
                
                <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
                  <h3 className="text-sm md:text-lg font-medium text-white font-space-mono">NFTS CLAIMED</h3>
                  <p className="text-2xl md:text-3xl font-bold text-purple-400">890</p>
                  <p className="text-xs md:text-sm text-white opacity-70 font-space-mono">+15% from last month</p>
                </div>
                
                <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
                  <h3 className="text-sm md:text-lg font-medium text-white font-space-mono">ACTIVE TODAY</h3>
                  <p className="text-2xl md:text-3xl font-bold text-yellow-400">156</p>
                  <p className="text-xs md:text-sm text-white opacity-70 font-space-mono">+5% from yesterday</p>
                </div>
              </div>

              <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
                <h3 className="text-sm md:text-lg font-medium text-white font-space-mono mb-3 md:mb-4">RECENT ACTIVITY</h3>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 md:py-3 border-b border-sui-border">
                    <div className="mb-2 sm:mb-0">
                      <p className="text-white font-space-mono text-sm md:text-base">0x1234...5678 requested 2.5 SUI</p>
                      <p className="text-xs md:text-sm text-white opacity-70 font-space-mono">2 minutes ago</p>
                    </div>
                    <span className="bg-green-600 text-white px-2 md:px-3 py-1 rounded-sm text-xs font-space-mono self-start sm:self-auto">COMPLETED</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 md:py-3 border-b border-sui-border">
                    <div className="mb-2 sm:mb-0">
                      <p className="text-white font-space-mono text-sm md:text-base">0xabcd...efgh claimed NFT</p>
                      <p className="text-xs md:text-sm text-white opacity-70 font-space-mono">5 minutes ago</p>
                    </div>
                    <span className="bg-green-600 text-white px-2 md:px-3 py-1 rounded-sm text-xs font-space-mono self-start sm:self-auto">COMPLETED</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 md:py-3">
                    <div className="mb-2 sm:mb-0">
                      <p className="text-white font-space-mono text-sm md:text-base">0x9876...4321 requested 1.0 SUI</p>
                      <p className="text-xs md:text-sm text-white opacity-70 font-space-mono">8 minutes ago</p>
                    </div>
                    <span className="bg-yellow-600 text-white px-2 md:px-3 py-1 rounded-sm text-xs font-space-mono self-start sm:self-auto">PENDING</span>
                  </div>
                </div>
              </div>
              <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
                <h3 className="text-sm md:text-lg font-medium text-white font-space-mono mb-3 md:mb-4">RECENT ACTIVITY</h3>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 md:py-3 border-b border-sui-border">
                    <div className="mb-2 sm:mb-0">
                      <p className="text-white font-space-mono text-sm md:text-base">0x1234...5678 requested 2.5 SUI</p>
                      <p className="text-xs md:text-sm text-white opacity-70 font-space-mono">2 minutes ago</p>
                    </div>
                    <span className="bg-green-600 text-white px-2 md:px-3 py-1 rounded-sm text-xs font-space-mono self-start sm:self-auto">COMPLETED</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 md:py-3 border-b border-sui-border">
                    <div className="mb-2 sm:mb-0">
                      <p className="text-white font-space-mono text-sm md:text-base">0xabcd...efgh claimed NFT</p>
                      <p className="text-xs md:text-sm text-white opacity-70 font-space-mono">5 minutes ago</p>
                    </div>
                    <span className="bg-green-600 text-white px-2 md:px-3 py-1 rounded-sm text-xs font-space-mono self-start sm:self-auto">COMPLETED</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 md:py-3">
                    <div className="mb-2 sm:mb-0">
                      <p className="text-white font-space-mono text-sm md:text-base">0x9876...4321 requested 1.0 SUI</p>
                      <p className="text-xs md:text-sm text-white opacity-70 font-space-mono">8 minutes ago</p>
                    </div>
                    <span className="bg-yellow-600 text-white px-2 md:px-3 py-1 rounded-sm text-xs font-space-mono self-start sm:self-auto">PENDING</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-sui-blue font-space-mono">USER MANAGEMENT</h2>
              <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
                <p className="text-white opacity-70 font-space-mono text-sm md:text-base">User management interface coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-sui-blue font-space-mono">TRANSACTION HISTORY</h2>
              <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
                <p className="text-white opacity-70 font-space-mono text-sm md:text-base">Transaction history interface coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-sui-blue font-space-mono">ANALYTICS</h2>
              <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
                <p className="text-white opacity-70 font-space-mono text-sm md:text-base">Analytics dashboard coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-sui-blue font-space-mono">SETTINGS</h2>
              <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
                <p className="text-white opacity-70 font-space-mono text-sm md:text-base">Settings interface coming soon...</p>
              </div>
            </div>
          )}
        </main>
      </div>

      <div className="absolute hidden md:block md:top-[10px] md:left-4 md:w-8 md:h-4 md:border-t-4 md:border-l-4 border-white z-5"></div>
      <div className="absolute hidden md:block md:top-[10px] md:right-4 md:w-8 md:h-4 md:border-t-4 md:border-r-4 border-white z-5"></div>
      <div className="absolute hidden md:block md:top-[70px] md:left-4 md:w-8 md:h-4 md:border-b-4 md:border-l-4 border-white z-5"></div>
      <div className="absolute hidden md:block md:top-[70px] md:right-4 md:w-8 md:h-4 md:border-b-4 md:border-r-4 border-white z-5"></div>
    </div>
  )
}

export default App

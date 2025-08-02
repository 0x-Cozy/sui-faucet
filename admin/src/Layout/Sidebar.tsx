import { FaTimes, FaChartBar, FaExchangeAlt, FaCog } from 'react-icons/fa';

interface SidebarProps {
  sidebarOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const Sidebar = ({ sidebarOpen, activeTab, setActiveTab, setSidebarOpen, toggleSidebar }: SidebarProps) => {
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
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
          onClick={() => handleTabClick('dashboard')}
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
          onClick={() => handleTabClick('transactions')}
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
          onClick={() => handleTabClick('analytics')}
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
          onClick={() => handleTabClick('settings')}
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
  );
};

export default Sidebar; 
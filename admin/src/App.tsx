import { useState } from 'react';
import { Login } from './components';
import { Header, Sidebar, CornerDecorations, MobileOverlay, MainContent } from './Layout';
import { useAuth } from './hooks/useAuth';
import { useSidebar } from './hooks/useSidebar';
import { DEFAULT_TAB } from './constants';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, handleLogin, handleLogout } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useSidebar(sidebarOpen);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-sui-darker text-white font-orbitron relative overflow-hidden">
      <Header toggleSidebar={toggleSidebar} handleLogout={handleLogout} />

      <div className="flex h-[calc(100vh-100px)] border-box">
        <Sidebar 
          sidebarOpen={sidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSidebarOpen={setSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <MobileOverlay sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <MainContent activeTab={activeTab} />
      </div>

      <CornerDecorations />
    </div>
  );
}

export default App;

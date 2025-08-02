import { Dashboard, Transactions, Analytics, Settings } from '../components';

interface MainContentProps {
  activeTab: string;
}

const MainContent = ({ activeTab }: MainContentProps) => {
  return (
    <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
      {activeTab === 'dashboard' && (
        <Dashboard />
      )}

      {activeTab === 'transactions' && (
        <Transactions />
      )}

      {activeTab === 'analytics' && (
        <Analytics />
      )}

      {activeTab === 'settings' && (
        <Settings />
      )}
    </main>
  );
};

export default MainContent; 
import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit'
import { Copy, Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';

interface ApiApp {
  id: string;
  name: string;
  description?: string;
  apiKey: string;
  createdAt: string;
}

export default function ApiManagement() {
  const [apps, setApps] = useState<ApiApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  const [newApp, setNewApp] = useState({ name: '', description: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();

  const displayToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const fetchApps = async () => {
    if (!currentAccount?.address) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/apps/list/${currentAccount.address}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setApps(data.data || []);
        }
      }
    } catch (error) {
      console.error('failed to fetch apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const createApp = async () => {
    if (!currentAccount?.address || !newApp.name) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/apps/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: currentAccount.address,
          name: newApp.name,
          description: newApp.description
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          displayToast('app created successfully!');
          setNewApp({ name: '', description: '' });
          setShowCreateForm(false);
          fetchApps();
        } else {
          displayToast(data.error || 'failed to create app');
        }
      } else {
        const error = await response.json();
        displayToast(error.error || 'failed to create app');
      }
    } catch (error) {
      console.error('failed to create app:', error);
      displayToast('failed to create app');
    }
  };

  const deleteApp = async (appId: string) => {
    if (!currentAccount?.address) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/apps/${appId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: currentAccount.address
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          displayToast('app deleted successfully!');
          setShowDeleteConfirm(null);
          fetchApps();
        } else {
          displayToast(data.error || 'failed to delete app');
        }
      } else {
        const error = await response.json();
        displayToast(error.error || 'failed to delete app');
      }
    } catch (error) {
      console.error('failed to delete app:', error);
      displayToast('failed to delete app');
    }
  };

  const copyApiKey = async (apiKey: string) => {
    try {
      await navigator.clipboard.writeText(apiKey);
      displayToast('api key copied!');
    } catch (err) {
      console.error('failed to copy:', err);
      displayToast('failed to copy api key');
    }
  };

  useEffect(() => {
    fetchApps();
  }, [currentAccount?.address]);

  if (!currentAccount) {
    return (
      <div className="min-h-screen bg-[#030F1C] text-white font-['Orbitron'] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">please connect your wallet to manage api keys</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030F1C] text-white font-['Orbitron']">
      {showToast && (
        <div className="fixed top-4 right-4 bg-[#050F1E] border-2 border-[#4DA2FF] text-white px-4 py-2 rounded-sm shadow-[0_0_3px_rgba(111,188,240,0.6)] z-50">
          {toastMessage}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#050F1E] border-2 border-[#4DA2FF] rounded-sm p-6 max-w-md w-full shadow-[0_0_3px_rgba(111,188,240,0.6)]">
            <h3 className="text-lg font-semibold text-white mb-4">confirm deletion</h3>
            <p className="text-gray-300 mb-6">are you sure you want to delete this api app? this action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteApp(showDeleteConfirm)}
                className="bg-red-600 text-white px-4 py-2 rounded-sm hover:bg-red-700 transition-colors"
              >
                delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded-sm hover:bg-gray-700 transition-colors"
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center justify-center w-10 h-10 bg-[#030F1C] border-2 border-[#4DA2FF] rounded-full text-[#4DA2FF] hover:text-white hover:bg-[#4DA2FF] transition-all duration-200 shadow-[0_0_3px_rgba(111,188,240,0.6)]"
      >
        <FaChevronLeft className="w-4 h-4" />
      </button>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 pt-16 sm:pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">api management</h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => window.open('/api/docs', '_blank')}
              className="bg-gray-600 text-white px-3 py-2 rounded-sm hover:bg-gray-700 transition-colors text-sm"
            >
              documentation
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center justify-center gap-2 bg-sui-blue text-white px-3 py-2 rounded-sm hover:bg-blue-600 transition-colors text-sm"
            >
              <Plus size={16} />
              create app
            </button>
          </div>
        </div>

        {showCreateForm && (
          <div className="bg-[#050F1E] border-2 border-[#4DA2FF] rounded-sm p-4 sm:p-6 mb-6 shadow-[0_0_3px_rgba(111,188,240,0.6)]">
            <h3 className="text-lg font-semibold text-white mb-4">create new app</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">app name</label>
                <input
                  type="text"
                  value={newApp.name}
                  onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                  className="w-full bg-[#030F1C] border-2 border-[#4DA2FF] text-white px-3 py-2 rounded-sm focus:border-[#4DA2FF] focus:outline-none shadow-[0_0_3px_rgba(111,188,240,0.6)]"
                  placeholder="my dapp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">description (optional)</label>
                <textarea
                  value={newApp.description}
                  onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                  className="w-full bg-[#030F1C] border-2 border-[#4DA2FF] text-white px-3 py-2 rounded-sm focus:border-[#4DA2FF] focus:outline-none shadow-[0_0_3px_rgba(111,188,240,0.6)]"
                  placeholder="what is this app for?"
                  rows={3}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={createApp}
                  disabled={loading || !newApp.name}
                  className="bg-[#030F1C] text-white border-2 border-[#4DA2FF] px-6 py-3 text-sm font-bold tracking-[0.5px] shadow-[0_0_3px_rgba(111,188,240,0.6)] cursor-pointer transition-all duration-200 hover:bg-[#4DA2FF] hover:text-[#121317] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'creating...' : 'create app'}
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-sm hover:bg-gray-700 transition-colors"
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && apps.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">loading...</p>
          </div>
        ) : apps.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">no api apps found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map((app) => (
              <div key={app.id} className="bg-[#050F1E] border-2 border-[#4DA2FF] rounded-sm p-4 sm:p-6 shadow-[0_0_3px_rgba(111,188,240,0.6)]">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate">{app.name}</h3>
                    {app.description && (
                      <p className="text-gray-400 mt-1 text-sm break-words">{app.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      created: {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeleteConfirm(app.id)}
                    className="text-red-400 hover:text-red-300 transition-colors ml-2 flex-shrink-0"
                    title="delete app"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="bg-[#030F1C] border-2 border-[#4DA2FF] rounded-sm p-4 shadow-[0_0_3px_rgba(111,188,240,0.6)]">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-300">api key</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowApiKey(showApiKey === app.id ? null : app.id)}
                        className="text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        {showApiKey === app.id ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => copyApiKey(app.apiKey)}
                        className="text-gray-400 hover:text-gray-300 transition-colors"
                        title="copy api key"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="font-mono text-sm text-[#4DA2FF] break-all">
                    {showApiKey === app.id ? app.apiKey : '••••••••••••••••••••••••••••••••'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
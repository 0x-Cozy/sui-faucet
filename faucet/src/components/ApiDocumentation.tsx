import { Copy } from 'lucide-react';
import { BACKEND_URL } from '../constants';
import { useState } from 'react';

export default function ApiDocumentation() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage('copied to clipboard!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('failed to copy:', err);
      setToastMessage('failed to copy');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#030F1C] text-white font-['Orbitron']">
      {showToast && (
        <div className="fixed top-4 right-4 bg-[#050F1E] border-2 border-[#4DA2FF] text-white px-4 py-2 rounded-sm shadow-[0_0_3px_rgba(111,188,240,0.6)] z-50">
          {toastMessage}
        </div>
      )}

      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">API Documentation</h2>
        
        <div className="space-y-6 sm:space-y-8">
          <div className="bg-[#050F1E] border-2 border-[#4DA2FF] rounded-sm p-4 sm:p-6 shadow-[0_0_3px_rgba(111,188,240,0.6)]">
            <h3 className="text-lg font-semibold text-white mb-4">authentication</h3>
            <p className="text-gray-300 mb-4 text-sm sm:text-base">
              all api requests require an api key in the authorization header:
            </p>
            <div className="bg-[#030F1C] border-2 border-[#4DA2FF] rounded-sm p-3 sm:p-4 shadow-[0_0_3px_rgba(111,188,240,0.6)]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">authorization header</span>
                <button
                  onClick={() => copyToClipboard('Authorization: Bearer fm_your_api_key_here')}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <Copy size={16} />
                </button>
              </div>
              <code className="text-xs sm:text-sm text-[#4DA2FF] break-all">
                Authorization: Bearer fm_your_api_key_here
              </code>
            </div>
          </div>

          <div className="bg-[#050F1E] border-2 border-[#4DA2FF] rounded-sm p-4 sm:p-6 shadow-[0_0_3px_rgba(111,188,240,0.6)]">
            <h3 className="text-lg font-semibold text-white mb-4">request tokens</h3>
            <p className="text-gray-300 mb-4 text-sm sm:text-base">
              send sui tokens to a wallet address:
            </p>
            <div className="bg-[#030F1C] border-2 border-[#4DA2FF] rounded-sm p-3 sm:p-4 shadow-[0_0_3px_rgba(111,188,240,0.6)]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">curl example</span>
                <button
                  onClick={() => copyToClipboard(`curl -X POST ${BACKEND_URL}/api/faucet/request \\
  -H "Authorization: Bearer fm_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"walletAddress":"0x...","amount":0.1}'`)}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <Copy size={16} />
                </button>
              </div>
              <pre className="text-xs sm:text-sm text-[#4DA2FF] overflow-x-auto whitespace-pre-wrap break-all">
{`curl -X POST ${BACKEND_URL}/api/faucet/request \\
  -H "Authorization: Bearer fm_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"walletAddress":"0x...","amount":0.1}'`}
              </pre>
            </div>
            
            <div className="mt-4">
              <h4 className="text-md font-semibold text-white mb-2">response</h4>
              <div className="bg-[#030F1C] border-2 border-[#4DA2FF] rounded-sm p-3 sm:p-4 shadow-[0_0_3px_rgba(111,188,240,0.6)]">
                <pre className="text-xs sm:text-sm text-[#4DA2FF] whitespace-pre-wrap break-all">
{`{
  "success": true,
  "data": {
    "txHash": "0x...",
    "message": "0.1 SUI sent successfully"
  }
}`}
                </pre>
              </div>
            </div>
          </div>

          <div className="bg-[#050F1E] border-2 border-[#4DA2FF] rounded-sm p-4 sm:p-6 shadow-[0_0_3px_rgba(111,188,240,0.6)]">
            <h3 className="text-lg font-semibold text-white mb-4">check balance</h3>
            <p className="text-gray-300 mb-4 text-sm sm:text-base">
              check wallet balance:
            </p>
            <div className="bg-[#030F1C] border-2 border-[#4DA2FF] rounded-sm p-3 sm:p-4 shadow-[0_0_3px_rgba(111,188,240,0.6)]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">curl example</span>
                <button
                  onClick={() => copyToClipboard(`curl -X GET ${BACKEND_URL}/api/faucet/balance/0x... \\
  -H "Authorization: Bearer fm_your_api_key_here"`)}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <Copy size={16} />
                </button>
              </div>
              <pre className="text-xs sm:text-sm text-[#4DA2FF] overflow-x-auto whitespace-pre-wrap break-all">
{`curl -X GET ${BACKEND_URL}/api/faucet/balance/0x... \\
  -H "Authorization: Bearer fm_your_api_key_here"`}
              </pre>
            </div>
          </div>

          <div className="bg-[#050F1E] border-2 border-[#4DA2FF] rounded-sm p-4 sm:p-6 shadow-[0_0_3px_rgba(111,188,240,0.6)]">
            <h3 className="text-lg font-semibold text-white mb-4">rate limiting</h3>
            <p className="text-gray-300 mb-4 text-sm sm:text-base">
              api users share the same rate limits as web users:
            </p>
            <ul className="text-gray-300 space-y-2 text-sm sm:text-base">
              <li>• 1 request per 12 hours per ip address</li>
              <li>• 1 request per 12 hours per wallet address</li>
              <li>• no captcha verification required</li>
              <li>• same restrictions as web frontend</li>
            </ul>
          </div>

          <div className="bg-[#050F1E] border-2 border-[#4DA2FF] rounded-sm p-4 sm:p-6 shadow-[0_0_3px_rgba(111,188,240,0.6)]">
            <h3 className="text-lg font-semibold text-white mb-4">error responses</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-md font-semibold text-red-400 mb-2">rate limit exceeded</h4>
                <pre className="text-xs sm:text-sm text-red-400 bg-[#030F1C] border-2 border-[#4DA2FF] p-2 rounded shadow-[0_0_3px_rgba(111,188,240,0.6)] whitespace-pre-wrap break-all">
{`{
  "success": false,
  "error": "rate limit exceeded"
}`}
                </pre>
              </div>
              <div>
                <h4 className="text-md font-semibold text-red-400 mb-2">invalid api key</h4>
                <pre className="text-xs sm:text-sm text-red-400 bg-[#030F1C] border-2 border-[#4DA2FF] p-2 rounded shadow-[0_0_3px_rgba(111,188,240,0.6)] whitespace-pre-wrap break-all">
{`{
  "success": false,
  "error": "invalid api key"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
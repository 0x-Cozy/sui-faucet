import { useState, useRef, useEffect } from 'react';
import type { FooterProps } from '../types';
import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaTimes, FaChevronUp } from 'react-icons/fa';
//import { isEnokiWallet } from '@mysten/enoki';
import NewHereModal from './NewHereModal';
// import SendTokens from './SendTokens';

interface FooterWithConnectProps extends FooterProps {
  showDrawer?: boolean;
  setShowDrawer?: (show: boolean) => void;
  captchaCompleted?: boolean;
}

const Footer = ({ activeTab, setActiveTab, showDrawer, setShowDrawer, captchaCompleted }: FooterWithConnectProps) => {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  //const wallets = useWallets();
  const navigate = useNavigate();
  const [showConnectPopup, setShowConnectPopup] = useState(false);
  const [showNewHereModal, setShowNewHereModal] = useState(false);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const drawerRef = useRef<HTMLDivElement>(null);

  //const isGoogleWallet = currentAccount && wallets.some(wallet => 
  //  isEnokiWallet(wallet) && wallet.accounts.some(account => account.address === currentAccount.address)
  //);

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setShowDrawer?.(false);
      }
    };

    if (showDrawer) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDrawer, setShowDrawer]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnectClick = () => {
    if (currentAccount) {
      setShowConnectPopup(true);
    } else {
      navigate('/login');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowConnectPopup(false);
  };

  const shouldShowDrawer = screenHeight <= 740;

  return (
    <>
      {!captchaCompleted && shouldShowDrawer && (
        <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 left-1/2 transform -translate-x-1/2 z-10 flex gap-4 sm:gap-6">
          <button 
            onClick={() => setShowNewHereModal(true)}
            className="bg-[#030F1C] min-w-[120px] text-white border-2 border-[#4DA2FF] px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-center shadow-[0_0_3px_rgba(111,188,240,0.6)] cursor-pointer tracking-[0.5px] sm:tracking-[1px] transition-all duration-200 hover:bg-[#4DA2FF] hover:text-[#121317] hover:scale-105 sm:hidden"
          >
            NEW HERE?
          </button>
          <button 
            onClick={handleConnectClick}
            className="bg-[#030F1C] text-white border-2 border-[#4DA2FF] px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-center shadow-[0_0_3px_rgba(111,188,240,0.6)] cursor-pointer tracking-[0.5px] sm:tracking-[1px] transition-all duration-200 hover:bg-[#4DA2FF] hover:text-[#121317] hover:scale-105 sm:hidden"
          >
            {currentAccount ? formatAddress(currentAccount.address) : 'CONNECT'}
          </button>
        </div>
      )}
      

      {!shouldShowDrawer && (
        <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 left-1/2 transform -translate-x-1/2 z-10 flex gap-4 sm:gap-6">
          <button onClick={() => setShowNewHereModal(true)} className="bg-[#030F1C] min-w-[150px] text-white border-2 border-[#4DA2FF] px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-center shadow-[0_0_3px_rgba(111,188,240,0.6)] cursor-pointer tracking-[0.5px] sm:tracking-[1px] transition-all duration-200 hover:bg-[#4DA2FF] hover:text-[#121317] hover:scale-105 sm:hidden">
            NEW HERE?
          </button>
          <button onClick={handleConnectClick} className="bg-[#030F1C] min-w-[150px] text-white border-2 border-[#4DA2FF] px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-center shadow-[0_0_3px_rgba(111,188,240,0.6)] cursor-pointer tracking-[0.5px] sm:tracking-[1px] transition-all duration-200 hover:bg-[#4DA2FF] hover:text-[#121317] hover:scale-105 sm:hidden">
            {currentAccount ? formatAddress(currentAccount.address) : 'CONNECT'}
          </button>
        </div>
      )}
      
      <footer className="absolute bottom-4 sm:bottom-6 md:bottom-8 w-full h-[40px] sm:h-[50px] flex justify-around items-center px-4 sm:px-8 md:px-15 text-xs sm:text-sm text-white opacity-85 tracking-[0.5px] sm:tracking-[1px] z-8">
        <div className="flex gap-1 sm:gap-2">
          <span 
            className={`text-white py-2 px-6 rounded cursor-pointer transition-all duration-200 ${activeTab === 'sui' ? 'bg-[#4DA2FF] bg-opacity-20' : 'opacity-50 hover:opacity-80'}`}
            onClick={() => setActiveTab('sui')}
          >
            SUI DROP
          </span>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <span 
            className={`text-white py-2 px-6 rounded cursor-pointer transition-all duration-200 ${activeTab === 'refund' ? 'bg-[#4DA2FF] bg-opacity-20' : 'opacity-50 hover:opacity-80'}`}
            onClick={() => setActiveTab('refund')}
          >
            REFUND
          </span>
        </div>
      </footer>

      <div 
        ref={drawerRef}
        className={`fixed bottom-0 left-0 right-0 bg-[#050F1E] border-t-2 border-[#4DA2FF] z-50 transition-transform duration-300 ease-in-out sm:hidden ${
          showDrawer ? 'transform translate-y-0' : 'transform translate-y-full'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-[#4DA2FF] font-['Space_Mono']">
              QUICK ACTIONS
            </h3>
            <button
              onClick={() => setShowDrawer?.(false)}
              className="text-white hover:text-[#4DA2FF] transition-colors duration-150"
            >
              <FaChevronUp className="w-4 h-4 rotate-180" />
            </button>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setShowNewHereModal(true)}
              className="flex-1 bg-[#030F1C] text-white border-2 border-[#4DA2FF] px-4 py-3 text-sm font-bold text-center shadow-[0_0_3px_rgba(111,188,240,0.6)] cursor-pointer tracking-[0.5px] transition-all duration-200 hover:bg-[#4DA2FF] hover:text-[#121317] hover:scale-105"
            >
              NEW HERE?
            </button>
            <button 
              onClick={handleConnectClick}
              className="flex-1 bg-[#030F1C] text-white border-2 border-[#4DA2FF] px-4 py-3 text-sm font-bold text-center shadow-[0_0_3px_rgba(111,188,240,0.6)] cursor-pointer tracking-[0.5px] transition-all duration-200 hover:bg-[#4DA2FF] hover:text-[#121317] hover:scale-105"
            >
              {currentAccount ? formatAddress(currentAccount.address) : 'CONNECT'}
            </button>
          </div>
        </div>
      </div>

      {captchaCompleted && !showDrawer && shouldShowDrawer && (
        <button
          onClick={() => setShowDrawer?.(true)}
          className="fixed bottom-4 right-4 z-40 sm:hidden bg-[#030F1C] border-2 border-[#4DA2FF] rounded-full w-12 h-12 flex items-center justify-center text-[#4DA2FF] hover:text-white hover:bg-[#4DA2FF] transition-all duration-200 shadow-[0_0_3px_rgba(111,188,240,0.6)]"
        >
          <FaChevronUp className="w-4 h-4" />
        </button>
      )}

      {showConnectPopup && currentAccount && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
            onClick={() => setShowConnectPopup(false)}
          />
          <div className="fixed inset-x-4 bottom-4 bg-[#050F1E] border-2 border-white z-50 p-4 rounded-sm sm:hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#4DA2FF] font-['Space_Mono']">
                CONNECTED
              </h3>
              <button
                onClick={() => setShowConnectPopup(false)}
                className="text-white hover:text-[#4DA2FF] transition-colors duration-150"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="px-3 py-2 bg-[#011829] rounded-sm border border-[#4DA2FF]">
                <div className="text-xs text-white opacity-70">Wallet Address</div>
                <div className="text-sm text-[#4DA2FF] font-mono">
                  {formatAddress(currentAccount.address)}
                </div>
              </div>
              
              {/* 
              {isGoogleWallet && <SendTokens onClose={() => setShowConnectPopup(false)} />}
              */}
              
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center gap-3 text-white text-sm py-3 px-4 hover:bg-[#23262f] hover:text-[#4DA2FF] transition-colors duration-150 font-['Space_Mono']"
              >
                <FaSignOutAlt className="text-[#4DA2FF] flex-shrink-0" />
                Disconnect
              </button>
            </div>
          </div>
        </>
      )}

      <NewHereModal 
        isOpen={showNewHereModal}
        onClose={() => setShowNewHereModal(false)}
      />
    </>
  );
};

export default Footer; 
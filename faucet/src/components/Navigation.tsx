import { useRef, useState, useEffect } from 'react';
import { FaGithub, FaDiscord, FaTwitter, FaChevronDown, FaSignOutAlt } from 'react-icons/fa';
import { SOCIAL_LINKS } from '../constants';
import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import { useNavigate } from 'react-router-dom';
//import { isEnokiWallet } from '@mysten/enoki';
import NewHereModal from './NewHereModal';
// import SendTokens from './SendTokens';

const Navigation = () => {
  const [showSocials, setShowSocials] = useState(false);
  const [showConnectDropdown, setShowConnectDropdown] = useState(false);
  const [showNewHereModal, setShowNewHereModal] = useState(false);
  const socialsRef = useRef<HTMLDivElement>(null);
  const connectRef = useRef<HTMLDivElement>(null);
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  //t wallets = useWallets();
  const navigate = useNavigate();

  //const isGoogleWallet = currentAccount && wallets.some(wallet => 
    //isEnokiWallet(wallet) && wallet.accounts.some(account => account.address === currentAccount.address)
  //);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (socialsRef.current && !socialsRef.current.contains(event.target as Node)) {
        setShowSocials(false);
      }
      if (connectRef.current && !connectRef.current.contains(event.target as Node)) {
        setShowConnectDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnectClick = () => {
    if (currentAccount) {
      setShowConnectDropdown(!showConnectDropdown);
    } else {
      navigate('/login');
    }
  };

  const handleDisconnect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    disconnect();
    setShowConnectDropdown(false);
  };

  return (
    <>
      <nav className="flex justify-between items-center px-4 sm:px-8 md:px-12 pt-3 sm:pt-6 md:pt-10 relative z-30">
        <h1 className="text-lg sm:text-xl md:text-[1.8rem] font-black text-[#4DA2FF] uppercase tracking-[1px] sm:tracking-[2px] md:tracking-[3px] font-['Space_Mono']">
          FIRST MOVERS
        </h1>
        
        <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm text-white opacity-70 tracking-[0.5px] sm:tracking-[1px] items-center">
          <span 
            onClick={() => setShowNewHereModal(true)}
            className="cursor-pointer hover:text-[#4DA2FF] hidden sm:block"
          >
            New Here?
          </span>
          
          <div ref={connectRef} className="relative hidden sm:block">
            <button 
              onClick={handleConnectClick}
              className="bg-[#030F1C] text-white border-2 border-[#4DA2FF] px-3 py-2 text-xs font-bold text-center shadow-[0_0_3px_rgba(111,188,240,0.6)] cursor-pointer tracking-[0.5px] transition-all duration-200 hover:bg-[#4DA2FF] hover:text-[#121317] hover:scale-105"
            >
              {currentAccount ? formatAddress(currentAccount.address) : 'CONNECT'}
            </button>
            
            {currentAccount && showConnectDropdown && (
              <div className="absolute mt-2 top-full right-0 min-w-[280px] bg-[#050F1E] border-2 border-white z-50 py-1 flex flex-col font-['Space_Mono']">
                <div className="px-4 py-2 border-b border-white border-opacity-20">
                  <div className="text-xs text-white opacity-70">Connected</div>
                  <div className="text-sm text-[#4DA2FF] font-mono">
                    {formatAddress(currentAccount.address)}
                  </div>
                </div>
                
                {/* 
                {isGoogleWallet && (
                  <div className="px-4 py-3 border-b border-white border-opacity-20">
                    <SendTokens isCompact={true} onClose={() => setShowConnectDropdown(false)} />
                  </div>
                )}
                */}
                
                <div className="relative">
                  <button
                    onClick={handleDisconnect}
                    className="w-full flex items-center gap-3 text-white no-underline text-xs sm:text-sm py-3 px-4 hover:bg-[#23262f] hover:text-[#4DA2FF] transition-colors duration-150 cursor-pointer"
                  >
                    <FaSignOutAlt className="text-[#4DA2FF] flex-shrink-0" />
                    Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>

          <span
            ref={socialsRef}
            className="relative inline-flex items-center cursor-pointer text-[#4DA2FF] font-bold tracking-[0.5px] sm:tracking-[1px] select-none"
            onClick={() => setShowSocials(!showSocials)}
          >
            <span>SOCIALS</span>
            <FaChevronDown className={`ml-1 transition-transform duration-200 ${showSocials ? 'rotate-180' : 'rotate-0'}`} />
            {showSocials && (
              <div className="absolute mt-2 sm:mt-2 md:mt-4 top-full right-0 min-w-[140px] sm:min-w-[160px] bg-[#050F1E] border-2 border-white z-50 py-0.5 flex flex-col font-['Space_Mono']">
                <a href={SOCIAL_LINKS.GITHUB} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white no-underline text-xs sm:text-sm py-2 px-3 sm:px-4 hover:bg-[#23262f] hover:text-[#4DA2FF] transition-colors duration-150">
                  <FaGithub className="text-[#4DA2FF] flex-shrink-0" />
                  Github
                </a>
                <a href={SOCIAL_LINKS.TWITTER} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white no-underline text-xs sm:text-sm py-2 px-3 sm:px-4 hover:bg-[#23262f] hover:text-[#4DA2FF] transition-colors duration-150">
                  <FaTwitter className="text-[#4DA2FF] flex-shrink-0" />
                  Twitter
                </a>
                <a href={SOCIAL_LINKS.DISCORD} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white no-underline text-xs sm:text-sm py-2 px-3 sm:px-4 hover:bg-[#23262f] hover:text-[#4DA2FF] transition-colors duration-150">
                  <FaDiscord className="text-[#4DA2FF] flex-shrink-0" />
                  Discord
                </a>
              </div>
            )}
          </span>
        </div>
      </nav>

      <NewHereModal 
        isOpen={showNewHereModal}
        onClose={() => setShowNewHereModal(false)}
      />
    </>
  );
};

export default Navigation; 
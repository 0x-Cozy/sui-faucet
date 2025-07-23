

import { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import 'jquery.ripples';
import { FaGithub, FaDiscord, FaTwitter, FaCloud, FaTint, FaBolt } from 'react-icons/fa';
import "./App.css";

declare global {
  interface JQuery {
    ripples(options?: any): JQuery;
  }
}

const ThunderEffect = ({ show }: { show: boolean }) => {
  const [showThunder, setShowThunder] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [thunderKey, setThunderKey] = useState(0);
  const [thunderPoints, setThunderPoints] = useState('');
  const [thunderPosition, setThunderPosition] = useState({ left: '50%', top: '20%' });

  const randomThunderPoints = () => {
    const points = [];
    let x = 30 + Math.random() * 10 - 5;
    let y = 0;
    points.push(`${x},${y}`);
    let segments = 5 + Math.floor(Math.random() * 3);
    for (let i = 1; i <= segments; i++) {
      x += (Math.random() - 0.5) * 20;
      y += 25 + Math.random() * 25;
      points.push(`${Math.max(10, Math.min(50, x))},${Math.min(160, y)}`);
    }
    return points.join(' ');
  };

  const randomThunderPosition = () => {
    return {
      left: `${20 + Math.random() * 60}%`,
      top: `${10 + Math.random() * 60}%`
    };
  };

  useEffect(() => {
    if (!show) return;
    
    let timeout: NodeJS.Timeout;
    let active = true;
    
    function triggerThunder(strikeCount = 1) {
      if (!active) return;
      setThunderKey(k => k + 1);
      setThunderPoints(randomThunderPoints());
      setThunderPosition(randomThunderPosition());
      setShowThunder(true);
      setShowFlash(true);
      
      setTimeout(() => setShowThunder(false), 180 + Math.random() * 120);
      setTimeout(() => setShowFlash(false), 120 + Math.random() * 80);
      
      //randomly trigger a second or third strike
      if (strikeCount < 3 && Math.random() < 0.3) {
        setTimeout(() => triggerThunder(strikeCount + 1), 200 + Math.random() * 300);
      } else {
        timeout = setTimeout(triggerThunder, 3000 + Math.random() * 5000);
      }
    }
    
    timeout = setTimeout(triggerThunder, 2000 + Math.random() * 3000);
    return () => { active = false; clearTimeout(timeout); };
  }, [show]);

  if (!show) return null;

  return (
    <div className="thunder-layer">
      {showThunder && (
        <svg
          key={thunderKey}
          className="thunder-strike"
          width="120" height="320" viewBox="0 0 60 160"
          style={{
            ...thunderPosition,
            position: 'absolute',
            pointerEvents: 'none',
          }}
        >
          <polyline
            points={thunderPoints}
            stroke="#e0f7ff"
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow)"
          />
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>
      )}
      {showFlash && <div className="thunder-flash" />}
    </div>
  );
};

export default function App() {
  const [showSocials, setShowSocials] = useState(false);
  const [rippleKey, setRippleKey] = useState(0);
  const [sliderValue, setSliderValue] = useState(40);
  const [activeTab, setActiveTab] = useState('sui'); // tabs sui, nft nd refund
  const [walletAddress, setWalletAddress] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [captchaCompleted, setCaptchaCompleted] = useState(false);
  const rippleRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | undefined>(undefined);
  const socialsRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    let clientX: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newValue = Math.round(percentage);
    setSliderValue(newValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCaptchaClick = () => {
    setCaptchaCompleted(true);
  };

  useEffect(() => {
    if (isDragging) {
      const handleMouseMoveGlobal = (e: MouseEvent | TouchEvent) => {
        handleMouseMove(e as any);
      };
      
      const handleMouseUpGlobal = () => {
        handleMouseUp();
      };

      document.addEventListener('mousemove', handleMouseMoveGlobal);
      document.addEventListener('mouseup', handleMouseUpGlobal);
      document.addEventListener('touchmove', handleMouseMoveGlobal, { passive: false });
      document.addEventListener('touchend', handleMouseUpGlobal);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMoveGlobal);
        document.removeEventListener('mouseup', handleMouseUpGlobal);
        document.removeEventListener('touchmove', handleMouseMoveGlobal);
        document.removeEventListener('touchend', handleMouseUpGlobal);
      };
    }
  }, [isDragging]);

  const dropCount = sliderValue < 20 ? 1 : sliderValue < 50 ? 2 : sliderValue < 80 ? 3 : 0;
  const suiAmount = (sliderValue / 100) * 0.9 + 0.1;
  const isMaxStorm = sliderValue >= 80;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (socialsRef.current && !socialsRef.current.contains(event.target as Node)) {
        setShowSocials(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    
    if (rippleRef.current) {
      $(rippleRef.current).ripples({
        resolution: 512,
        dropRadius: 20,
        perturbance: 0.04,
      });
      
      // @ts-ignore
      $(rippleRef.current).ripples('drop', window.innerWidth / 2, window.innerHeight / 2, 50, 0.04);

      const baseInterval = 1200;
      const speedMultiplier = 1 - (sliderValue / 100) * 0.9;
      const dynamicInterval = Math.max(100, baseInterval * speedMultiplier);

      interval = window.setInterval(() => {
        if (rippleRef.current) {
          const x = Math.random() * window.innerWidth;
          const y = Math.random() * window.innerHeight;
          // @ts-ignore
          $(rippleRef.current).ripples('drop', x, y, 30 + Math.random() * 30, 0.03 + Math.random() * 0.03);
        }
      }, dynamicInterval);
      
      intervalRef.current = interval;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = undefined;
        }
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = undefined;
        }
        if (rippleRef.current) {
          try { 
            $(rippleRef.current).ripples('destroy'); 
          } catch (e) {
          }
        }
        setRippleKey(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (rippleRef.current) {
        try { $(rippleRef.current).ripples('destroy'); } catch {}
      }
    };
  }, [rippleKey, sliderValue]);

  const renderMainContent = () => {
    switch (activeTab) {
      case 'sui':
        return (
          <div className="flex flex-col space-y-4 items-center w-80 sm:w-96">
            <div className="w-full mb-6">
              <label className="block text-xs text-[#4DA2FF] opacity-80 mb-2">
                WALLET ADDRESS
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full px-4 py-3 bg-[#030F1C] border-2 border-[#4DA2FF] rounded-sm text-white text-sm focus:outline-none focus:border-[#6fbcf0] focus:shadow-[0_0_10px_rgba(111,188,240,0.3)] transition-all duration-300"
                placeholder="Enter wallet address"
              />
            </div>
            
            <div className="relative w-full h-10 sm:h-12 mb-2">
              <div 
                ref={cloudRef}
                className="absolute top-0 transition-all duration-300 ease-out flex flex-col items-center cursor-grab active:cursor-grabbing"
                style={{ left: `${sliderValue}%`, transform: 'translateX(-50%)' }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
              >
                <FaCloud className="text-[#4DA2FF] text-xl sm:text-2xl mb-1" />
                <div className="flex justify-center gap-0.5">
                  {isMaxStorm ? (
                    <FaBolt className="text-[#FFD700] text-xs animate-pulse" />
                  ) : (
                    Array.from({ length: dropCount }, (_, i) => (
                      <FaTint 
                        key={i} 
                        className="text-[#4DA2FF] text-xs animate-bounce" 
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
            
            <div 
              ref={sliderRef}
              className="relative w-full h-2 bg-[#011829] rounded-full cursor-pointer border border-[#2e3b4e] touch-none"
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#4DA2FF] to-[#4DA2FF] rounded-full transition-all duration-300"
                style={{ width: `${sliderValue}%` }}
              ></div>
              <div 
                className="absolute top-1/2 w-4 h-4 bg-[#4DA2FF] rounded-full border border-white transform -translate-y-1/2 transition-all duration-300"
                style={{ left: `${sliderValue}%`, transform: 'translate(-50%, -50%)' }}
              ></div>
            </div>
            
            <div className="mt-2 text-center">
              <div className="text-lg sm:text-xl font-bold text-[#4DA2FF]">{suiAmount.toFixed(1)} SUI</div>
              <div className="text-xs text-white opacity-70">
                {sliderValue < 20 ? 'Airdrop' : sliderValue < 50 ? 'Water Drop' : sliderValue < 80 ? 'Rain Drop' : 'Full Storm'}
              </div>
            </div>
            
            <div className="w-full flex justify-center">
              <button 
                onClick={handleCaptchaClick}
                className={`w-32 h-12 mt-4 rounded-lg flex font-['Space_Mono'] items-center justify-center transition-all duration-300 text-xs cursor-pointer ${
                  captchaCompleted 
                    ? 'bg-[#4DA2FF] text-[#030F1C] border-2 border-[#4DA2FF] shadow-[0_0_10px_rgba(77,162,255,0.4)] hover:bg-[#030F1C] hover:text-[#4DA2FF] hover:scale-105' 
                    : 'bg-[#011829] text-white border-2 border-[#2e3b4e] opacity-50 hover:opacity-80'
                }`}
              >
                {captchaCompleted ? 'REQUEST SUI DROP' : 'CAPTCHA'}
              </button>
            </div>
          </div>
        );
      
      case 'nft':
        return (
          <div className="flex flex-col space-y-6 items-center w-80 sm:w-96">
            <div className="w-48 h-48 bg-[#011829] border-2 border-[#4DA2FF] rounded-lg flex items-center justify-center">
              <span className="text-xs text-white opacity-50">NFT IMAGE</span>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-bold text-[#4DA2FF]">FIRST MOVERS NFT</h3>
              <p className="text-xs text-white opacity-70 mt-1">Exclusive collection</p>
            </div>
            
            <div className="w-full flex justify-center">
              <button 
                onClick={handleCaptchaClick}
                className={`w-32 h-12 mt-4 rounded-lg flex items-center justify-center transition-all duration-300 font-['Space_Mono'] text-xs cursor-pointer ${
                  captchaCompleted 
                    ? 'bg-[#4DA2FF] text-[#030F1C] border-2 border-[#4DA2FF] shadow-[0_0_10px_rgba(77,162,255,0.4)] hover:bg-[#030F1C] hover:text-[#4DA2FF] hover:scale-105' 
                    : 'bg-[#011829] text-white border-2 border-[#2e3b4e] opacity-50 hover:opacity-80'
                }`}
              >
                {captchaCompleted ? 'REQUEST NFT DROP' : 'CAPTCHA'}
              </button>
            </div>
          </div>
        );
      
      case 'refund':
        return (
          <div className="flex flex-col space-y-6 items-center text-center w-80 sm:w-96">
            <div className="text-lg font-bold text-[#4DA2FF]">
              Unused Testnet SUI?
            </div>
            <div className="text-sm text-white opacity-80">
              Return your unused tokens to help other developers!
            </div>
            <div className="text-xs text-white opacity-60">
              Return tokens to address:
            </div>
            <div className="w-full px-4 py-3 bg-[#011829] border-2 border-[#2e3b4e] rounded-lg">
              <div className="text-xs text-[#4DA2FF] break-all">
                0x7a9d19d4c210663926eb549da59a54e25777fef63161bfccda08277b58b4212e
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#030F1C] text-white font-['Orbitron'] relative overflow-hidden">
      <div
        id="ripple"
        ref={rippleRef}
        style={{
          height: '100vh',
          width: '100vw',
          position: 'fixed',
          zIndex: 0,
          left: 0,
          top: 0,
          background: "url('/none.png') no-repeat center center"
        }}
      />
      
      <ThunderEffect show={sliderValue >= 80} />
      
      <nav className="flex justify-between items-center px-4 sm:px-8 md:px-12 pt-3 sm:pt-6 md:pt-10 relative z-10">
        <h1 className="text-lg sm:text-xl md:text-[1.8rem] font-black text-[#4DA2FF] uppercase tracking-[1px] sm:tracking-[2px] md:tracking-[3px] font-['Space_Mono']">
          FIRST MOVERS
        </h1>
        
        <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm text-white opacity-70 tracking-[0.5px] sm:tracking-[1px] items-center">
          <span className="cursor-pointer hover:text-[#4DA2FF] hidden sm:block">New Here?</span>
          <button className="bg-[#030F1C] text-white border-2 border-[#4DA2FF] px-3 py-2 text-xs font-bold text-center shadow-[0_0_3px_rgba(111,188,240,0.6)] cursor-pointer tracking-[0.5px] transition-all duration-200 hover:bg-[#4DA2FF] hover:text-[#121317] hover:scale-105 hidden sm:block md:hidden">
            CONNECT
          </button>
          <button className="bg-[#030F1C] text-white border-2 border-[#4DA2FF] px-3 py-2 text-xs font-bold text-center shadow-[0_0_3px_rgba(111,188,240,0.6)] cursor-pointer tracking-[0.5px] transition-all duration-200 hover:bg-[#4DA2FF] hover:text-[#121317] hover:scale-105 hidden sm:hidden md:block">
            CONNECT WALLET
          </button>
          <span
            ref={socialsRef}
            className="relative inline-flex items-center cursor-pointer text-[#4DA2FF] font-bold tracking-[0.5px] sm:tracking-[1px] select-none"
            onClick={() => setShowSocials(!showSocials)}
          >
            <span>SOCIALS</span>
            <svg 
              className={`ml-1 transition-transform duration-200 ${showSocials ? 'rotate-180' : 'rotate-0'}`} 
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4DA2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
            {showSocials && (
              <div className="absolute mt-2 sm:mt-2 md:mt-4 top-full right-0 min-w-[140px] sm:min-w-[160px] bg-[#050F1E] border-2 border-white z-50 py-0.5 flex flex-col font-['Space_Mono']">
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white no-underline text-xs sm:text-sm py-2 px-3 sm:px-4 hover:bg-[#23262f] hover:text-[#4DA2FF] transition-colors duration-150">
                  <FaGithub className="text-[#4DA2FF] flex-shrink-0" />
                  Github
                </a>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white no-underline text-xs sm:text-sm py-2 px-3 sm:px-4 hover:bg-[#23262f] hover:text-[#4DA2FF] transition-colors duration-150">
                  <FaTwitter className="text-[#4DA2FF] flex-shrink-0" />
                  Twitter
                </a>
                <a href="https://discord.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white no-underline text-xs sm:text-sm py-2 px-3 sm:px-4 hover:bg-[#23262f] hover:text-[#4DA2FF] transition-colors duration-150">
                  <FaDiscord className="text-[#4DA2FF] flex-shrink-0" />
                  Discord
                </a>
              </div>
            )}
          </span>
        </div>
      </nav>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-full px-4 sm:px-8 md:px-0">
        <div className="flex justify-center">
          {renderMainContent()}
        </div>
      </div>

      <div className="absolute top-2 sm:top-4 md:top-6 left-2 sm:left-4 md:left-6 w-8 h-8 sm:w-12 sm:h-12 md:w-15 md:h-15 border-t-2 sm:border-t-3 md:border-t-4 border-l-2 sm:border-l-3 md:border-l-4 border-white z-5"></div>
      <div className="absolute top-2 sm:top-4 md:top-6 right-2 sm:right-4 md:right-6 w-8 h-8 sm:w-12 sm:h-12 md:w-15 md:h-15 border-t-2 sm:border-t-3 md:border-t-4 border-r-2 sm:border-r-3 md:border-r-4 border-white z-5"></div>
      
      <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 left-1/2 transform -translate-x-1/2 z-10 flex gap-4 sm:gap-6">
        <button className="bg-[#030F1C] text-white border-2 border-[#4DA2FF] px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-center shadow-[0_0_3px_rgba(111,188,240,0.6)] cursor-pointer tracking-[0.5px] sm:tracking-[1px] transition-all duration-200 hover:bg-[#4DA2FF] hover:text-[#121317] hover:scale-105 sm:hidden">
          NEW HERE?
        </button>
        <button className="bg-[#030F1C] text-white border-2 border-[#4DA2FF] px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-center shadow-[0_0_3px_rgba(111,188,240,0.6)] cursor-pointer tracking-[0.5px] sm:tracking-[1px] transition-all duration-200 hover:bg-[#4DA2FF] hover:text-[#121317] hover:scale-105 sm:hidden">
          CONNECT
        </button>
      </div>
      
      <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 left-2 sm:left-4 md:left-6 w-8 h-8 sm:w-12 sm:h-12 md:w-15 md:h-15 border-b-2 sm:border-b-3 md:border-b-4 border-l-2 sm:border-l-3 md:border-l-4 border-white z-5"></div>
      <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 right-2 sm:right-4 md:right-6 w-8 h-8 sm:w-12 sm:h-12 md:w-15 md:h-15 border-b-2 sm:border-b-3 md:border-b-4 border-r-2 sm:border-r-3 md:border-r-4 border-white z-5"></div>
      
      <footer className="absolute bottom-0 w-full h-[40px] sm:h-[50px] flex justify-around items-center px-4 sm:px-8 md:px-15 bg-[#050F1E] border-t-2 border-[#2e3b4e] font-['Orbitron'] text-xs sm:text-sm text-white opacity-85 tracking-[0.5px] sm:tracking-[1px] z-8">
        <div className="flex gap-1 sm:gap-2">
          <span 
            className={`text-white p-2 rounded cursor-pointer transition-all duration-200 ${activeTab === 'sui' ? 'bg-[#4DA2FF] bg-opacity-20' : 'opacity-50 hover:opacity-80'}`}
            onClick={() => setActiveTab('sui')}
          >
            SUI DROP
          </span>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <span 
            className={`text-white p-2 rounded cursor-pointer transition-all duration-200 ${activeTab === 'nft' ? 'bg-[#4DA2FF] bg-opacity-20' : 'opacity-50 hover:opacity-80'}`}
            onClick={() => setActiveTab('nft')}
          >
            NFT DROP
          </span>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <span 
            className={`text-white p-2 rounded cursor-pointer transition-all duration-200 ${activeTab === 'refund' ? 'bg-[#4DA2FF] bg-opacity-20' : 'opacity-50 hover:opacity-80'}`}
            onClick={() => setActiveTab('refund')}
          >
            REFUND
          </span>
        </div>
      </footer>
    </div>
  );
}
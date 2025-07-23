

import { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import 'jquery.ripples';
import { FaGithub, FaDiscord, FaTwitter, FaCloud, FaTint } from 'react-icons/fa';
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
  const [sliderValue, setSliderValue] = useState(50);
  const [activeTab, setActiveTab] = useState('sui'); // 'sui', 'nft', 'refund'
  const [walletAddress, setWalletAddress] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [captchaCompleted, setCaptchaCompleted] = useState(false);
  const rippleRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | undefined>(undefined);
  const socialsRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
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
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const dropCount = Math.max(1, Math.floor((sliderValue / 100) * 5));
  const suiAmount = (sliderValue / 100) * 0.9 + 0.1;

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
              <div className="relative">
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-[#030F1C] border-2 border-[#4DA2FF] rounded-lg text-[#e6f7fd] text-sm font-['Space_Mono'] focus:outline-none focus:border-[#6fbcf0] focus:shadow-[0_0_10px_rgba(111,188,240,0.3)] transition-all duration-300 placeholder-transparent"
                  placeholder="Enter wallet address"
                />
                <label className="absolute left-4 -bottom-6 text-xs font-['Space_Mono'] text-[#4DA2FF] opacity-80 transition-all duration-300">
                  WALLET ADDRESS
                </label>
              </div>
            </div>
            
            <div className="relative w-full h-10 sm:h-12 mb-2">
              <div 
                ref={cloudRef}
                className="absolute top-0 transition-all duration-300 ease-out flex flex-col items-center cursor-grab active:cursor-grabbing"
                style={{ left: `${sliderValue}%`, transform: 'translateX(-50%)' }}
                onMouseDown={handleMouseDown}
              >
                <FaCloud className="text-[#4DA2FF] text-xl sm:text-2xl mb-1" />
                <div className="flex justify-center gap-0.5">
                  {Array.from({ length: dropCount }, (_, i) => (
                    <FaTint 
                      key={i} 
                      className="text-[#4DA2FF] text-xs animate-bounce" 
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div 
              ref={sliderRef}
              className="relative w-full h-2 bg-[#011829] rounded-full cursor-pointer border border-[#2e3b4e]"
              onMouseDown={handleMouseDown}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#4DA2FF] to-[#4DA2FF] rounded-full transition-all duration-300"
                style={{ width: `${sliderValue}%` }}
              ></div>
              <div 
                className="absolute top-1/2 w-4 h-4 bg-[#4DA2FF] rounded-full border border-[#e6f7fd] transform -translate-y-1/2 transition-all duration-300"
                style={{ left: `${sliderValue}%`, transform: 'translate(-50%, -50%)' }}
              ></div>
            </div>
            
            <div className="mt-2 text-center">
              <div className="text-lg sm:text-xl font-bold text-[#4DA2FF]">{suiAmount.toFixed(1)} SUI</div>
              <div className="text-xs font-['Space_Mono'] text-[#e6f7fd] opacity-70">
                {sliderValue < 20 ? 'Airdrop' : sliderValue < 50 ? 'Water Drop' : sliderValue < 80 ? 'Rain Drop' : 'Full Storm'}
              </div>
            </div>
            
            <div className="w-full flex justify-center">
              <button 
                onClick={handleCaptchaClick}
                className={`w-32 h-12 rounded-lg flex items-center justify-center transition-all duration-300 font-['Space_Mono'] text-xs cursor-pointer ${
                  captchaCompleted 
                    ? 'bg-[#4DA2FF] text-[#030F1C] border-2 border-[#4DA2FF] shadow-[0_0_10px_rgba(77,162,255,0.4)] hover:bg-[#030F1C] hover:text-[#4DA2FF] hover:scale-105' 
                    : 'bg-[#011829] text-[#e6f7fd] border-2 border-[#2e3b4e] opacity-50 hover:opacity-80'
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
              <span className="text-xs font-['Space_Mono'] text-[#e6f7fd] opacity-50">NFT IMAGE</span>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-bold text-[#4DA2FF] font-['Space_Mono']">FIRST MOVERS NFT</h3>
              <p className="text-xs text-[#e6f7fd] opacity-70 mt-1">Exclusive collection</p>
            </div>
            
            <div className="w-full flex justify-center">
              <button 
                onClick={handleCaptchaClick}
                className={`w-32 h-12 rounded-lg flex items-center justify-center transition-all duration-300 font-['Space_Mono'] text-xs cursor-pointer ${
                  captchaCompleted 
                    ? 'bg-[#4DA2FF] text-[#030F1C] border-2 border-[#4DA2FF] shadow-[0_0_10px_rgba(77,162,255,0.4)] hover:bg-[#030F1C] hover:text-[#4DA2FF] hover:scale-105' 
                    : 'bg-[#011829] text-[#e6f7fd] border-2 border-[#2e3b4e] opacity-50 hover:opacity-80'
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
            <div className="text-lg font-bold text-[#4DA2FF] font-['Space_Mono']">
              Unused Testnet SUI?
            </div>
            <div className="text-sm text-[#e6f7fd] opacity-80 font-['Space_Mono']">
              Return your unused tokens to help other developers!
            </div>
            <div className="text-xs text-[#e6f7fd] opacity-60 font-['Space_Mono']">
              Return tokens to address:
            </div>
            <div className="w-full px-4 py-3 bg-[#011829] border-2 border-[#2e3b4e] rounded-lg">
              <div className="text-xs font-['Space_Mono'] text-[#4DA2FF] break-all">
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
    <div className="min-h-screen bg-[#030F1C] text-[#e6f7fd] font-['Orbitron'] relative overflow-hidden">
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
      
      <nav className="flex justify-between items-center px-4 sm:px-8 md:px-15 pt-4 sm:pt-6 md:pt-8 relative z-10">
        <h1 className="text-lg sm:text-xl md:text-[1.8rem] font-black text-[#4DA2FF] uppercase tracking-[1px] sm:tracking-[2px] md:tracking-[3px] font-twk-everett">
          FIRST MOVERS
        </h1>
        
        <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm text-[#e6f7fd] opacity-70 tracking-[0.5px] sm:tracking-[1px]">
          <span className="cursor-pointer hover:text-[#4DA2FF] hidden sm:block">LOGIN</span>
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
              <div className="absolute mt-5 sm:mt-4 md:mt-6 top-full right-0 min-w-[140px] sm:min-w-[160px] bg-[#050F1E] border-2 border-[#e6f7fd] z-50 py-0.5 flex flex-col font-['Space_Mono']">
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#e6f7fd] no-underline text-xs sm:text-sm py-2 px-3 sm:px-4 hover:bg-[#23262f] hover:text-[#4DA2FF] transition-colors duration-150">
                  <FaGithub className="text-[#4DA2FF] flex-shrink-0" />
                  Github
                </a>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#e6f7fd] no-underline text-xs sm:text-sm py-2 px-3 sm:px-4 hover:bg-[#23262f] hover:text-[#4DA2FF] transition-colors duration-150">
                  <FaTwitter className="text-[#4DA2FF] flex-shrink-0" />
                  Twitter
                </a>
                <a href="https://discord.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#e6f7fd] no-underline text-xs sm:text-sm py-2 px-3 sm:px-4 hover:bg-[#23262f] hover:text-[#4DA2FF] transition-colors duration-150">
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

      <div className="absolute top-12 sm:top-16 md:top-20 left-2 sm:left-8 md:left-15 w-8 h-8 sm:w-12 sm:h-12 md:w-15 md:h-15 border-t-2 sm:border-t-3 md:border-t-4 border-l-2 sm:border-l-3 md:border-l-4 border-[#e6f7fd] z-5"></div>
      <div className="absolute top-12 sm:top-16 md:top-20 right-2 sm:right-8 md:right-15 w-8 h-8 sm:w-12 sm:h-12 md:w-15 md:h-15 border-t-2 sm:border-t-3 md:border-t-4 border-r-2 sm:border-r-3 md:border-r-4 border-[#e6f7fd] z-5"></div>
      
      <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 left-1/2 transform -translate-x-1/2 z-10 flex gap-4 sm:gap-6">
        <button className="bg-[#030F1C] text-[#e6f7fd] border-2 border-[#4DA2FF] px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-center shadow-[0_0_3px_rgba(111,188,240,0.6)] cursor-pointer tracking-[0.5px] sm:tracking-[1px] transition-all duration-200 hover:bg-[#4DA2FF] hover:text-[#121317] hover:scale-105">
          NEW HERE?
        </button>
        <button className="bg-[#030F1C] text-[#e6f7fd] border-2 border-[#4DA2FF] px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-center shadow-[0_0_3px_rgba(111,188,240,0.6)] cursor-pointer tracking-[0.5px] sm:tracking-[1px] transition-all duration-200 hover:bg-[#4DA2FF] hover:text-[#121317] hover:scale-105 sm:hidden">
          LOGIN
        </button>
      </div>
      
      <div className="absolute bottom-14 sm:bottom-16 md:bottom-20 left-2 sm:left-8 md:left-15 w-8 h-8 sm:w-12 sm:h-12 md:w-15 md:h-15 border-b-2 sm:border-b-3 md:border-b-4 border-l-2 sm:border-l-3 md:border-l-4 border-[#e6f7fd] z-5"></div>
      <div className="absolute bottom-14 sm:bottom-16 md:bottom-20 right-2 sm:right-8 md:right-15 w-8 h-8 sm:w-12 sm:h-12 md:w-15 md:h-15 border-b-2 sm:border-b-3 md:border-b-4 border-r-2 sm:border-r-3 md:border-r-4 border-[#e6f7fd] z-5"></div>
      
      <footer className="absolute bottom-0 w-full h-[40px] sm:h-[50px] flex justify-around items-center px-4 sm:px-8 md:px-15 bg-[#050F1E] border-t-2 border-[#2e3b4e] font-['Orbitron'] text-xs sm:text-sm text-[#e6f7fd] opacity-85 tracking-[0.5px] sm:tracking-[1px] z-8">
        <div className="flex gap-1 sm:gap-2">
          <span 
            className={`text-[#e6f7fd] p-2 rounded cursor-pointer transition-all duration-200 ${activeTab === 'sui' ? 'bg-[#4DA2FF] bg-opacity-20' : 'opacity-50 hover:opacity-80'}`}
            onClick={() => setActiveTab('sui')}
          >
            SUI DROP
          </span>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <span 
            className={`text-[#e6f7fd] p-2 rounded cursor-pointer transition-all duration-200 ${activeTab === 'nft' ? 'bg-[#4DA2FF] bg-opacity-20' : 'opacity-50 hover:opacity-80'}`}
            onClick={() => setActiveTab('nft')}
          >
            NFT DROP
          </span>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <span 
            className={`text-[#e6f7fd] p-2 rounded cursor-pointer transition-all duration-200 ${activeTab === 'refund' ? 'bg-[#4DA2FF] bg-opacity-20' : 'opacity-50 hover:opacity-80'}`}
            onClick={() => setActiveTab('refund')}
          >
            REFUND
          </span>
        </div>
      </footer>
    </div>
  );
}
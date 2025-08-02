import { useRef, useState, useEffect } from 'react';
import { FaCloud, FaTint, FaBolt } from 'react-icons/fa';
import type { RainSliderProps } from '../types';

const RainSlider = ({ sliderValue, setSliderValue }: RainSliderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);

  // slider value to sui amount- 0.1 to 1.0
  const getSuiAmount = (value: number): number => {
    const step = Math.round(value / 10) * 10;
    return (step / 100) * 0.9 + 0.1;
  };

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
    
    const snappedValue = Math.round(percentage / 10) * 10;
    setSliderValue(snappedValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
  const suiAmount = getSuiAmount(sliderValue);
  const isMaxStorm = sliderValue >= 80;

  return (
    <div className="w-full mb-6">
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
        
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="absolute top-1/2 w-1 h-1 bg-[#4DA2FF] rounded-full transform -translate-y-1/2"
            style={{ left: `${i * 10}%` }}
          ></div>
        ))}
        
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
    </div>
  );
};

export default RainSlider; 
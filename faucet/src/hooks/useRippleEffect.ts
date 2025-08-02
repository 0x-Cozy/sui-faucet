import { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'jquery.ripples';

declare global {
  interface JQuery {
    ripples(options?: any): JQuery;
  }
}

export const useRippleEffect = (sliderValue: number) => {
  const rippleRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    let interval: number | undefined;
    
    const initializeRipples = () => {
      if (rippleRef.current) {
        try {
          $(rippleRef.current).ripples('destroy');
        } catch {
        }
        
        $(rippleRef.current).ripples({
          resolution: 512,
          dropRadius: 20,
          perturbance: 0.04,
        });
        
        // @ts-ignore
        $(rippleRef.current).ripples('drop', window.innerWidth / 2, window.innerHeight / 2, 50, 0.04);
      }
    };

    const startInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

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
    };

    const initializeAndStart = () => {
      initializeRipples();
      startInterval();
    };

    initializeAndStart();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = undefined;
        }
      } else {
        initializeAndStart();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (rippleRef.current) {
        try { 
          $(rippleRef.current).ripples('destroy'); 
        } catch (e) {
        }
      }
    };
  }, [sliderValue]);

  return rippleRef;
}; 
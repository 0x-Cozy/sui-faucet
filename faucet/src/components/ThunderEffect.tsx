import { useEffect, useState } from 'react';
import type { ThunderEffectProps } from '../types';

const ThunderEffect = ({ show }: ThunderEffectProps) => {
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

export default ThunderEffect; 
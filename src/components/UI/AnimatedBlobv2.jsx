
import React, { useState, useEffect } from 'react';

const AnimatedBlobv2 = ({ isListening }) => {
  const [points, setPoints] = useState([]);
  const [time, setTime] = useState(0);
  
  // Generate blob points
  useEffect(() => {
    const generatePoints = () => {
      const count = 8;
      const angleStep = (2 * Math.PI) / count;
      const newPoints = [];
      
      for (let i = 0; i < count; i++) {
        const angle = i * angleStep;
        const radius = isListening 
          ? 70 + Math.sin(time + i * 0.5) * 15 + Math.cos(time * 1.5 + i) * 15
          : 75 + Math.sin(time + i * 0.7) * 10; 
        
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        newPoints.push([x, y]);
      }
      
      setPoints(newPoints);
    };

    const interval = setInterval(() => {
      setTime(prev => prev + 0.05);
      generatePoints();
    }, 50);
    
    return () => clearInterval(interval);
  }, [isListening, time]);

  // Create smooth blob path
  const createBlobPath = () => {
    if (points.length === 0) return '';
    
    let path = `M ${points[0][0]},${points[0][1]} `;
    
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      
      // Control points for smooth curves
      const cp1x = current[0] + (next[0] - current[0]) * 0.5 - (next[1] - current[1]) * 0.2;
      const cp1y = current[1] + (next[1] - current[1]) * 0.5 + (next[0] - current[0]) * 0.2;
      const cp2x = next[0] - (next[0] - current[0]) * 0.5 - (next[1] - current[1]) * 0.2;
      const cp2y = next[1] - (next[1] - current[1]) * 0.5 + (next[0] - current[0]) * 0.2;
      
      path += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next[0]},${next[1]} `;
    }
    
    return path;
  };

  return (
    <svg
      viewBox="-100 -100 200 200"
      className="w-64 h-64"
      style={{ 
        position: 'relative',
        zIndex: 50
      }}
    >
      <defs>
        <linearGradient id="blob-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4361ee" />
          <stop offset="50%" stopColor="#7209b7" />
          <stop offset="100%" stopColor="#3a0ca3" />
        </linearGradient>
      </defs>
      
      {/* Fluid animated blob */}
      <path
        d={createBlobPath()}
        fill="url(#blob-gradient)"
        className="transition-all duration-200"
      />
    </svg>
  );
};

export default AnimatedBlobv2;
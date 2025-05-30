import React, { useState, useEffect } from 'react';

const AnimatedBlobv3 = ({ isListening }) => {
  const [pulseSize, setPulseSize] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseSize(prev => (prev + 0.1) % 1);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate size based on pulse animation
  const size = 80 + (isListening ? Math.sin(pulseSize * Math.PI * 2) * 4 : 0);

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
        <radialGradient id="blue-gradient" cx="0.5" cy="0.5" r="0.5" fx="0.4" fy="0.3">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#a5d8ff" />
          <stop offset="70%" stopColor="#4299e1" />
          <stop offset="100%" stopColor="#3182ce" />
        </radialGradient>
      </defs>
      
      {/* Simple animated circle with gradient */}
      <circle 
        cx="0" 
        cy="0" 
        r={size}
        fill="url(#blue-gradient)"
        className="transition-all duration-300"
      />
      
      {/* Text at bottom if needed */}
      {isListening === false && (
        <text
          x="0"
          y="120"
          textAnchor="middle"
          fill="white"
          fontSize="12"
          fontFamily="sans-serif"
        >
          Juniper
        </text>
      )}
    </svg>
  );
};

export default AnimatedBlobv3;

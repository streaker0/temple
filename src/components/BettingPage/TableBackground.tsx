import React from 'react';

const TableBackground = () => {
  return (
    <div className="relative w-full h-full">
      {/* Base felt pattern */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Noise texture pattern */}
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
            <feBlend in="SourceGraphic" mode="multiply"/>
          </filter>
          
          {/* Decorative pattern for the border */}
          <pattern id="borderPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 Q5 0, 10 10 Q15 20, 20 10" fill="none" stroke="#daa520" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>

        {/* Main table background */}
        <rect width="100%" height="100%" fill="#2a6e2a"/>
        <rect width="100%" height="100%" filter="url(#noise)" opacity="0.1"/>

        {/* Inner felt area */}
        <rect 
          x="3%" y="3%" 
          width="94%" height="94%" 
          fill="#248f24"
          rx="20"
        />
        
        {/* Decorative border */}
        <rect 
          x="2%" y="2%" 
          width="96%" height="96%" 
          fill="none" 
          stroke="url(#borderPattern)"
          strokeWidth="4"
          rx="25"
        />

        {/* Corner decorations */}
        {[
          [0, 0], [100, 0], 
          [0, 100], [100, 100]
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <circle 
              cx="0" cy="0" 
              r="30" 
              fill="#1a5c1a" 
              stroke="#daa520" 
              strokeWidth="1"
              opacity="0.6"
            />
            <path 
              d="M-15,-15 L15,15 M-15,15 L15,-15" 
              stroke="#daa520" 
              strokeWidth="1"
              opacity="0.3"
            />
          </g>
        ))}

        {/* Subtle radial gradient overlay */}
        <radialGradient id="tableGlow">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1"/>
          <stop offset="70%" stopColor="#000000" stopOpacity="0.2"/>
        </radialGradient>
        <rect 
          width="100%" height="100%" 
          fill="url(#tableGlow)" 
          opacity="0.3"
        />
      </svg>

      {/* Subtle spotlight effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-20"/>
    </div>
  );
};

export default TableBackground;
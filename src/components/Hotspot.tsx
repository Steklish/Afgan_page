import React, { useState } from 'react';
import { Html } from '@react-three/drei';

export interface HotspotProps {
  position: [number, number, number];
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

export function Hotspot({ position, icon, label, onClick, color = '#dc2626' }: HotspotProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.07, 16, 16]} />
      <meshBasicMaterial transparent opacity={0} />
      <Html 
        distanceFactor={12} 
        center 
        zIndexRange={[1, 10]}
      >
        <div 
          className="hotspot-wrapper"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <button 
            className="hotspot-pin" 
            style={{ backgroundColor: color, boxShadow: `0 0 16px ${color}` }}
            onClick={onClick} 
            title={label}
            aria-label={label}
          >
            {icon}
          </button>
          <div 
            className="hotspot-label"
            style={{ 
              opacity: hovered ? 1 : 0.88,
              transform: hovered ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            {label}
          </div>
        </div>
      </Html>
    </mesh>
  );
}

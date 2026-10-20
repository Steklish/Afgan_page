import React from 'react';
import { Html } from '@react-three/drei';

export interface HotspotProps {
  position: [number, number, number];
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
  hidden?: boolean;
  distanceFactor?: number;
  occlude?: boolean | 'raycast' | 'blending';
}

export function Hotspot({ 
  position, 
  icon, 
  label, 
  onClick, 
  color = '#dc2626',
  hidden = false,
  distanceFactor,
  occlude
}: HotspotProps) {
  // Если открыто любое модальное окно или лайтбокс, хотспот полностью убирается из DOM
  if (hidden) return null;

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.03, 16, 16]} />
      <meshBasicMaterial transparent opacity={0} />
      <Html 
        distanceFactor={distanceFactor} 
        center 
        zIndexRange={[100, 1]}
        occlude={occlude}
        style={{ pointerEvents: 'auto', userSelect: 'none' }}
      >
        <div 
          className="hotspot-wrapper"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          style={{ cursor: 'pointer' }}
        >
          <button 
            type="button"
            className="hotspot-pin" 
            style={{ 
              backgroundColor: color, 
              boxShadow: `0 0 10px ${color}` 
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }} 
            title={label}
            aria-label={label}
          >
            {icon}
          </button>

          {/* Название хотспота появляется ТОЛЬКО при наведении (CSS visibility/opacity) */}
          <div className="hotspot-label">
            {label}
          </div>
        </div>
      </Html>
    </mesh>
  );
}

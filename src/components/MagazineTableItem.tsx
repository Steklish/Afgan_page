import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { MagazineItem } from '../config/magazines';

interface MagazineTableItemProps {
  item: MagazineItem;
  index: number;
  localPosition: [number, number, number];
  localRotation: [number, number, number];
  size: [number, number]; // [width, height]
  onOpen: (index: number) => void;
  hidden?: boolean;
}

export function MagazineTableItem({
  item,
  index,
  localPosition,
  localRotation,
  size,
  onOpen,
  hidden = false
}: MagazineTableItemProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  // Загружаем текстуру разворота/обложки
  const texture = useTexture(item.src);
  texture.colorSpace = THREE.SRGBColorSpace;

  // Плавная физическая анимация подъёма и наклона к зрителю при наведении
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetY = localPosition[1] + (hovered ? 0.048 : 0);
    const targetRotX = localRotation[0] + (hovered ? 0.32 : 0);
    const targetScale = hovered ? 1.08 : 1.0;

    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetY,
      14,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      14,
      delta
    );
    const s = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 14, delta);
    groupRef.current.scale.set(s, s, s);
  });

  const [width, height] = size;

  return (
    <group
      ref={groupRef}
      position={[localPosition[0], localPosition[1], localPosition[2]]}
      rotation={[localRotation[0], localRotation[1], localRotation[2]]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onOpen(index);
      }}
    >
      {/* Теневая подложка при подъёме листа */}
      {hovered && (
        <mesh position={[0, -0.003, -0.015]}>
          <planeGeometry args={[width * 1.05, height * 1.05]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.35} />
        </mesh>
      )}

      {/* Лицевая сторона публикации с текстурой */}
      <mesh castShadow receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.65}
          metalness={0.05}
          emissive={hovered ? '#d97706' : '#000000'}
          emissiveIntensity={hovered ? 0.15 : 0}
        />
      </mesh>

      {/* Обратная сторона листа (состаренная бумага) */}
      <mesh position={[0, 0, -0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#f5ede0" roughness={0.9} />
      </mesh>

      {/* Золотистая рамка-подсветка при наведении */}
      {hovered && (
        <lineSegments position={[0, 0, 0.002]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(width * 1.02, height * 1.02)]} />
          <lineBasicMaterial color="#fbbf24" linewidth={2} />
        </lineSegments>
      )}

      {/* Всплывающий интерактивный бейдж над поднятой страницей */}
      {hovered && !hidden && (
        <Html
          position={[0, height / 2 + 0.04, 0.02]}
          center
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <div className="magazine-3d-tooltip">
            <div className="mag-tooltip-action">Читать...</div>
            <div className="mag-tooltip-title">{item.title}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

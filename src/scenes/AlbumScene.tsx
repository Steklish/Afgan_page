import { useState, useEffect } from 'react';
import { useTexture, Html } from '@react-three/drei';
import type { AlbumPhoto } from '../components/LightboxModal';
import { Hotspot } from '../components/Hotspot';
import type { SectionKey } from '../components/ContestModal';
import { Images, Maximize2, MapPin } from 'lucide-react';

interface AlbumSceneProps {
  onOpenLightbox: (index: number) => void;
  onSelectSection: (key: SectionKey) => void;
  hidden?: boolean;
}

// 3D Карточка фотографии на виртуальной витрине
function PhotoCard3D({
  photo,
  position,
  rotation,
  index,
  onClick,
  hidden = false
}: {
  photo: AlbumPhoto;
  position: [number, number, number];
  rotation: [number, number, number];
  index: number;
  onClick: () => void;
  hidden?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(photo.src);

  return (
    <group 
      position={position} 
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Рамка и паспарту фотографии */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.65, 1.25, 0.04]} />
        <meshStandardMaterial color={hovered ? '#334155' : '#1e242d'} roughness={0.6} />
      </mesh>

      {/* Фотография */}
      <mesh position={[0, 0, 0.025]} onClick={onClick}>
        <planeGeometry args={[1.5, 1.1]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* Всплывающая кнопка увеличения (скрыта при модальных окнах) */}
      {!hidden && (
        <Html distanceFactor={8} position={[0, -0.72, 0.05]} center zIndexRange={[1, 5]}>
          <button
            className="album-card-btn"
            onClick={onClick}
            title="Нажмите для открытия снимка в высоком разрешении"
          >
            <Maximize2 size={13} />
            <span>№ {index + 1}: {photo.title.slice(0, 24)}...</span>
          </button>
        </Html>
      )}
    </group>
  );
}

export function AlbumScene({ onOpenLightbox, onSelectSection, hidden = false }: AlbumSceneProps) {
  const [photos, setPhotos] = useState<AlbumPhoto[]>([]);

  useEffect(() => {
    fetch('./album/album.json')
      .then((res) => res.json())
      .then((data) => setPhotos(data))
      .catch((err) => console.error('Failed to load album.json:', err));
  }, []);

  // Выбираем ключевые знаковые снимки для 3D полукруглой галереи
  const showcasePhotos = photos.slice(0, 5);

  return (
    <group position={[0, 0.3, 0]}>
      {/* 3D Полукруглая экспозиция знаковых авторских фотоснимков */}
      {showcasePhotos.map((p, idx) => {
        // Распределяем по дуге перед камерой
        const total = showcasePhotos.length;
        const angle = ((idx - (total - 1) / 2) / total) * (Math.PI * 0.7);
        const radius = 3.6;
        const x = Math.sin(angle) * radius;
        const z = -Math.cos(angle) * radius + 1.2;
        const rotY = -angle;

        return (
          <PhotoCard3D
            key={p.id}
            photo={p}
            position={[x, 0, z]}
            rotation={[0, rotY, 0]}
            index={idx}
            onClick={() => onOpenLightbox(idx)}
            hidden={hidden}
          />
        );
      })}

      {/* Центральный интерактивный хотспот: Открыть полный альбом */}
      <Hotspot 
        position={[0, 1.2, -1.8]} 
        icon={<Images size={18} />} 
        label="Открыть полный альбом (все 16 снимков)" 
        onClick={() => onOpenLightbox(0)} 
        color="#dc2626"
        hidden={hidden}
      />

      {/* Хотспот на хронологию выставок */}
      <Hotspot 
        position={[0, -0.9, -1.5]} 
        icon={<MapPin size={18} />} 
        label="Музейные экспозиции «Афганского репортажа»" 
        onClick={() => onSelectSection('memory')} 
        color="#2563eb"
        hidden={hidden}
      />
    </group>
  );
}

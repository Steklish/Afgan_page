import { Splat } from '@react-three/drei';
import { Hotspot } from '../components/Hotspot';
import type { SectionKey } from '../components/ContestModal';
import { BookOpen, Volume2, Film, MapPin } from 'lucide-react';

interface GaussianSplatSceneProps {
  onSelectSection: (key: SectionKey) => void;
}

export function GaussianSplatScene({ onSelectSection }: GaussianSplatSceneProps) {
  return (
    <group position={[0, 0, 0]}>
      {/* 3D Gaussian Splatting через нативный шейдер Drei */}
      <Splat 
        src="./g_splats/output_501_01.splat" 
        toneMapped={false}
        alphaTest={0.02}
      />

      {/* Интерактивные точки вокруг объёмного скана */}
      <Hotspot 
        position={[0, 4, 0]} 
        icon={<BookOpen size={18} />} 
        label="Биография и боевой путь" 
        onClick={() => onSelectSection('biography')} 
      />

      <Hotspot 
        position={[-6, 1.5, 3]} 
        icon={<Volume2 size={18} />} 
        label="Голоса памяти: аудиоархив" 
        onClick={() => onSelectSection('audio')} 
      />

      <Hotspot 
        position={[6, 1.5, 3]} 
        icon={<Film size={18} />} 
        label="Хроника событий: видео" 
        onClick={() => onSelectSection('video')} 
      />

      <Hotspot 
        position={[0, -2, 7]} 
        icon={<MapPin size={18} />} 
        label="Увековечение памяти земляка" 
        onClick={() => onSelectSection('memory')} 
      />
    </group>
  );
}

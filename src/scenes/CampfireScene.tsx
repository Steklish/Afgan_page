import { useEffect } from 'react';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { Hotspot } from '../components/Hotspot';
import type { SectionKey } from '../components/ContestModal';
import { BookOpen, Volume2, Film, MapPin } from 'lucide-react';

interface CampfireSceneProps {
  onSelectSection: (key: SectionKey) => void;
}

export function CampfireScene({ onSelectSection }: CampfireSceneProps) {
  const { scene } = useGLTF('./models/wicker_basket_with_firewood.glb');

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <group position={[0, 0.4, 0]}>
      {/* Теплый свет костра/лампы, мягко подсвечивающий фактуру дерева */}
      <pointLight position={[0, 0.3, 0.3]} intensity={1.8} color="#fb923c" distance={4} />

      {/* 3D-модель с авто-центрированием Drei <Center> */}
      <Center position={[0, 0, 0]}>
        <primitive object={scene} scale={0.25} />
      </Center>

      {/* Интерактивные точки вокруг парящей 3D-модели */}
      <Hotspot 
        position={[0, 1.45, 0]} 
        icon={<BookOpen size={18} />} 
        label="Биография и боевой путь" 
        onClick={() => onSelectSection('biography')} 
      />

      <Hotspot 
        position={[-1.4, 0.05, 0.2]} 
        icon={<Volume2 size={18} />} 
        label="Песни у костра: аудиоархив" 
        onClick={() => onSelectSection('audio')} 
      />

      <Hotspot 
        position={[1.4, 0.05, 0.2]} 
        icon={<Film size={18} />} 
        label="Хроника событий: видео" 
        onClick={() => onSelectSection('video')} 
      />

      <Hotspot 
        position={[0, -1.3, 0.3]} 
        icon={<MapPin size={18} />} 
        label="Увековечение памяти земляка" 
        onClick={() => onSelectSection('memory')} 
      />
    </group>
  );
}

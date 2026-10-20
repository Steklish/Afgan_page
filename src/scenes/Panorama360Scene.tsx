import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Hotspot } from '../components/Hotspot';
import type { SectionKey } from '../components/ContestModal';
import { BookOpen, Volume2, Film, MapPin } from 'lucide-react';

interface Panorama360SceneProps {
  onSelectSection: (key: SectionKey) => void;
  hidden?: boolean;
}

// Управление FOV зумом в режиме 360° панорамы (колесико мыши)
export function PanoramaZoomController() {
  const { camera, gl } = useThree();

  useEffect(() => {
    const dom = gl.domElement;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if ('fov' in camera && typeof camera.fov === 'number') {
        const step = e.deltaY * 0.04;
        camera.fov = Math.max(25, Math.min(80, camera.fov + step));
        camera.updateProjectionMatrix();
      }
    };

    dom.addEventListener('wheel', handleWheel, { passive: false });
    return () => dom.removeEventListener('wheel', handleWheel);
  }, [camera, gl]);

  return null;
}

export function Panorama360Scene({ onSelectSection, hidden = false }: Panorama360SceneProps) {
  return (
    <group>
      <PanoramaZoomController />
      <Hotspot 
        position={[0, 1.3, -6.2]} 
        icon={<BookOpen size={18} />} 
        label="Биография и боевые заслуги" 
        onClick={() => onSelectSection('biography')} 
        hidden={hidden}
      />
      <Hotspot 
        position={[5.6, 0.6, -2.8]} 
        icon={<Volume2 size={18} />} 
        label="Голоса памяти: аудиоархив" 
        onClick={() => onSelectSection('audio')} 
        hidden={hidden}
      />
      <Hotspot 
        position={[2.4, -1.6, -5.2]} 
        icon={<Film size={18} />} 
        label="Хроника событий: видео" 
        onClick={() => onSelectSection('video')} 
        hidden={hidden}
      />
      <Hotspot 
        position={[-5.2, 0.4, -3.8]} 
        icon={<MapPin size={18} />} 
        label="Увековечение памяти земляка" 
        onClick={() => onSelectSection('memory')} 
        hidden={hidden}
      />
    </group>
  );
}

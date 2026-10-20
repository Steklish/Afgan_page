import { useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { Hotspot } from '../components/Hotspot';
import type { SceneKey } from '../config/scenes';
import type { SectionKey } from '../components/ContestModal';
import { 
  Award, 
  Camera, 
  Images, 
  Mountain, 
  Flame, 
  BookOpen, 
  Volume2, 
  Film
} from 'lucide-react';

interface TentSceneProps {
  onNavigate: (scene: SceneKey) => void;
  onSelectSection: (key: SectionKey) => void;
  onOpenAlbum: () => void;
  hidden?: boolean;
}

// Базовая 3D-модель палаточного лагеря (public/models/tent.glb)
function TentBaseModel() {
  const { scene } = useGLTF('./models/tent.glb');

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Улучшаем отображение материалов палатки и каменистого грунта
        if (child.material) {
          child.material.roughness = Math.max(0.7, child.material.roughness || 0.8);
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}

useGLTF.preload('./models/tent.glb');

// Полевая керосиновая лампа «Летучая мышь»
function KeroseneLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Металлическое основание / резервуар */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.095, 0.14, 24]} />
        <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Стеклянная колба с тёплым пламенем внутри */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.055, 0.07, 0.18, 24]} />
        <meshPhysicalMaterial 
          color="#ffedd5" 
          transparent 
          opacity={0.5} 
          roughness={0.1} 
          transmission={0.9} 
          thickness={0.05} 
        />
      </mesh>

      {/* Горящий фитиль */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.012, 0.018, 0.07, 12]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>

      {/* Верхний колпак / дымоход и кольцо для подвеса */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.09, 24]} />
        <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.44, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.035, 0.007, 12, 24]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Тёплый свет керосинового пламени */}
      <pointLight 
        position={[0, 0.25, 0]} 
        color="#f59e0b" 
        intensity={2.4} 
        distance={6} 
        decay={2} 
        castShadow 
      />
    </group>
  );
}

// Аутентичный деревянный полевой стол военкора (public/models/old_table.glb)
function OldTable({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF('./models/old_table.glb');

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.roughness = Math.max(0.75, child.material.roughness || 0.8);
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  return (
    <primitive 
      object={scene} 
      position={position} 
      scale={[0.0105, 0.0105, 0.0105]} 
    />
  );
}

useGLTF.preload('./models/old_table.glb');

// 1. Планшет с боевыми наградами на столе
function MedalsTrayItem({ position, onClick }: { position: [number, number, number]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group 
      position={position} 
      rotation={[-0.08, 0.15, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Бархатный планшет цвета бордо */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.36, 0.03, 0.28]} />
        <meshStandardMaterial 
          color={hovered ? '#991b1b' : '#7f1d1d'} 
          roughness={0.7} 
          metalness={0.1} 
        />
      </mesh>

      {/* Золотистая окантовка планшета */}
      <mesh position={[0, 0.017, 0]}>
        <boxGeometry args={[0.37, 0.005, 0.29]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Медаль «За отвагу» (миниатюра) */}
      <group position={[-0.09, 0.022, -0.03]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.007, 20]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.003, 0.055]}>
          <boxGeometry args={[0.06, 0.004, 0.045]} />
          <meshStandardMaterial color="#64748b" roughness={0.5} />
        </mesh>
      </group>

      {/* Знак «Гвардия» (миниатюра со звездой) */}
      <group position={[0.09, 0.022, -0.03]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.007, 5]} />
          <meshStandardMaterial color="#dc2626" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.004, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 0.008, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Медаль «Воину-интернационалисту» */}
      <group position={[0, 0.022, 0.05]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.007, 20]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

// 2. 3D-модель фотоаппарата военкора (public/models/generic_camera.glb)
function CameraDeskItem({ position, onClick }: { position: [number, number, number]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const { scene } = useGLTF('./models/generic_camera.glb');

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <group 
      position={position} 
      rotation={[0, Math.PI / 2 + 0.22, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
      scale={hovered ? [1.88, 1.88, 1.88] : [1.75, 1.75, 1.75]}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('./models/generic_camera.glb');

// 3. 3D-модель фотоальбома «Афганский репортаж» (public/models/album.glb)
function AlbumModelItem({ position, onClick }: { position: [number, number, number]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const { scene } = useGLTF('./models/album.glb', './draco/');

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <group 
      position={position} 
      rotation={[0, -0.06, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
      scale={hovered ? [0.41, 0.41, 0.41] : [0.38, 0.38, 0.38]}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('./models/album.glb', './draco/');

// 4. Полевая карта и документы военкора
function MapAndPapersItem({ position, onClick }: { position: [number, number, number]; onClick: () => void }) {
  return (
    <group position={position} rotation={[0, 0.06, 0]} onClick={onClick}>
      {/* Развернутая топографическая карта */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[0.48, 0.004, 0.28]} />
        <meshStandardMaterial color="#e2d9c8" roughness={0.9} />
      </mesh>

      {/* Линейка и карандаш */}
      <mesh position={[-0.12, 0.005, 0.07]} rotation={[0, 0.25, 0]}>
        <boxGeometry args={[0.16, 0.004, 0.015]} />
        <meshStandardMaterial color="#d97706" roughness={0.5} />
      </mesh>
      <mesh position={[0.14, 0.005, -0.05]} rotation={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.14, 12]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.6} />
      </mesh>
    </group>
  );
}

// 5. Полевой магнитофон «Электроника-302» (Песни «Голубых беретов»)
function CassetteRecorderItem({ position, onClick }: { position: [number, number, number]; onClick: () => void }) {
  return (
    <group position={position} rotation={[0, 0.2, 0]} onClick={onClick}>
      {/* Корпус магнитофона */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.065, 0.13]} />
        <meshStandardMaterial color="#374151" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Кассетный отсек */}
      <mesh position={[-0.015, 0.034, 0]}>
        <boxGeometry args={[0.1, 0.005, 0.075]} />
        <meshStandardMaterial color="#111827" roughness={0.3} />
      </mesh>
      {/* Решетка динамика */}
      <mesh position={[0.058, 0.034, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.005, 16]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} />
      </mesh>
    </group>
  );
}

// 6. Армейский бинокль у палатки (направлен на Саланг)
function BinocularsItem({ position, onClick }: { position: [number, number, number]; onClick: () => void }) {
  return (
    <group position={position} rotation={[0, -0.4, 0.08]} onClick={onClick}>
      {/* Снарядный ящик-подставка под бинокль */}
      <mesh position={[0, -0.32, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.38, 0.62, 0.38]} />
        <meshStandardMaterial color="#3a4436" roughness={0.85} />
      </mesh>

      {/* Бинокль Б-8 */}
      <group position={[0, 0.04, 0]}>
        {/* Левый тубус */}
        <mesh position={[-0.05, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.042, 0.18, 18]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.3} />
        </mesh>
        {/* Правый тубус */}
        <mesh position={[0.05, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.042, 0.18, 18]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.3} />
        </mesh>
        {/* Шарнир */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 0.13, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Передние стеклянные линзы с синим просветлением */}
        <mesh position={[-0.05, 0, 0.095]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.036, 0.036, 0.005, 16]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.05, 0, 0.095]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.036, 0.036, 0.005, 16]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

// 7. Костровой уголок и корзина дров у палатки
function CampfireCornerItem({ position, onClick }: { position: [number, number, number]; onClick: () => void }) {
  return (
    <group position={position} onClick={onClick}>
      {/* Плетёная корзина с поленьями */}
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.2, 0.32, 20]} />
        <meshStandardMaterial color="#6b4c35" roughness={0.9} />
      </mesh>
      {/* Поленья дров */}
      <mesh position={[-0.04, 0.32, 0]} rotation={[0.2, 0.3, 0.4]} castShadow>
        <cylinderGeometry args={[0.045, 0.055, 0.38, 10]} />
        <meshStandardMaterial color="#543b27" roughness={0.95} />
      </mesh>
      <mesh position={[0.06, 0.34, -0.03]} rotation={[-0.3, 0.4, -0.2]} castShadow>
        <cylinderGeometry args={[0.038, 0.045, 0.36, 10]} />
        <meshStandardMaterial color="#422e1e" roughness={0.95} />
      </mesh>
      {/* Силуэт армейской семиструнной гитары */}
      <group position={[0.28, 0.32, 0.08]} rotation={[0.2, 0, 0.22]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.44, 0.05]} />
          <meshStandardMaterial color="#92400e" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.045, 0.3, 0.018]} />
          <meshStandardMaterial color="#374151" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

export function TentScene({
  onNavigate,
  onSelectSection,
  onOpenAlbum,
  hidden = false
}: TentSceneProps) {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Базовая 3D-модель палаточного лагеря (public/models/tent.glb) */}
      <TentBaseModel />

      {/* 2. Аутентичный деревянный стол перед входом в палатку (public/models/old_table.glb) */}
      <OldTable position={[0, 0, 1.35]} />

      {/* Керосиновая лампа «Летучая мышь» на краю стола */}
      <KeroseneLamp position={[0.42, 0.787, 1.20]} />

      {/* Интерактивные предметы на столе */}
      <MedalsTrayItem 
        position={[-0.32, 0.802, 1.35]} 
        onClick={() => onNavigate('medals')} 
      />
      <AlbumModelItem 
        position={[0, 0.825, 1.35]} 
        onClick={onOpenAlbum} 
      />
      <CameraDeskItem 
        position={[0.33, 0.841, 1.35]} 
        onClick={() => onNavigate('cameras')} 
      />

      {/* Предметы вокруг палаточного лагеря */}
      {/* Личное дело и карта на штабной подставке слева от входа */}
      <MapAndPapersItem 
        position={[-0.95, 0.75, 0.95]} 
        onClick={() => onSelectSection('biography')} 
      />

      {/* Полевой кассетный магнитофон у кострового уголка */}
      <CassetteRecorderItem 
        position={[-1.25, 0.35, 0.4]} 
        onClick={() => onSelectSection('audio')} 
      />

      {/* Костровой уголок и корзина с дровами слева */}
      <CampfireCornerItem 
        position={[-1.55, 0, 0.1]} 
        onClick={() => onNavigate('camp')} 
      />

      {/* Командирский бинокль на ящике справа с обзором перевала */}
      <BinocularsItem 
        position={[1.5, 0.42, 0.4]} 
        onClick={() => onNavigate('panorama360')} 
      />

      {/* =========================================================================
          Чётко распределённые 3D-хотспоты без наложения:
          - Верхний портал входа: Кинохроника
          - Центр стола: Фотоальбом
          - Левый край стола: Награды
          - Правый край стола: Фотоаппаратура
          - Штабная стойка слева: Личное дело
          - Музыкальный уголок слева: Аудиозаписи
          - Костровой сектор слева: Быт и песни
          - Панорамный пункт справа: Перевал Саланг
          ========================================================================= */}

      {/* 1. КИНОХРОНИКА (над входом в палатку) */}
      <Hotspot 
        position={[0, 1.62, 1.25]} 
        icon={<Film size={18} />} 
        label="🎬 Кинохроника Афганской войны" 
        onClick={() => onSelectSection('video')} 
        color="#be123c"
        hidden={hidden}
      />

      {/* 2. ФОТОАЛЬБОМ (по центру стола) */}
      <Hotspot 
        position={[0, 1.05, 1.35]} 
        icon={<Images size={18} />} 
        label="📖 Альбом «Афганский репортаж» (16 фото)" 
        onClick={() => onNavigate('album')} 
        color="#d97706"
        hidden={hidden}
      />

      {/* 3. НАГРАДЫ (левая часть стола) */}
      <Hotspot 
        position={[-0.32, 0.96, 1.38]} 
        icon={<Award size={18} />} 
        label="🎖️ Экспозиция боевых наград" 
        onClick={() => onNavigate('medals')} 
        color="#dc2626"
        hidden={hidden}
      />

      {/* 4. ФОТОАППАРАТЫ (правая часть стола) */}
      <Hotspot 
        position={[0.33, 0.99, 1.38]} 
        icon={<Camera size={18} />} 
        label="📷 Фотоаппаратура военкора (ФЭД-2, Зенит)" 
        onClick={() => onNavigate('cameras')} 
        color="#2563eb"
        hidden={hidden}
      />

      {/* 5. ЛИЧНОЕ ДЕЛО И БОЕВОЙ ПУТЬ (слева у входа) */}
      <Hotspot 
        position={[-0.95, 1.15, 0.95]} 
        icon={<BookOpen size={18} />} 
        label="📄 Личное дело и боевой путь" 
        onClick={() => onSelectSection('biography')} 
        color="#4f46e5"
        hidden={hidden}
      />

      {/* 6. АУДИОАРХИВ ВИА «ГОЛУБЫЕ БЕРЕТЫ» (у магнитофона) */}
      <Hotspot 
        position={[-1.25, 0.78, 0.4]} 
        icon={<Volume2 size={18} />} 
        label="🎵 Записи ВИА «Голубые береты»" 
        onClick={() => onSelectSection('audio')} 
        color="#7c3aed"
        hidden={hidden}
      />

      {/* 7. СОЛДАТСКИЙ БЫТ И ПЕСНИ У КОСТРА (у костра слева) */}
      <Hotspot 
        position={[-1.65, 0.48, 0.0]} 
        icon={<Flame size={18} />} 
        label="🪵 Солдатский быт и песни у костра" 
        onClick={() => onNavigate('camp')} 
        color="#ea580c"
        hidden={hidden}
      />

      {/* 8. 360° ПАНОРАМА ПЕРЕВАЛА САЛАНГ (у бинокля справа) */}
      <Hotspot 
        position={[1.55, 0.95, 0.4]} 
        icon={<Mountain size={18} />} 
        label="🏔️ 360° Панорама перевала Саланг" 
        onClick={() => onNavigate('panorama360')} 
        color="#059669"
        hidden={hidden}
      />
    </group>
  );
}

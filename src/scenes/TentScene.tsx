import { useState, useEffect, useMemo, Suspense } from 'react';
import { useGLTF, Center } from '@react-three/drei';
import { Hotspot } from '../components/Hotspot';
import { MagazineTableItem } from '../components/MagazineTableItem';
import { MAGAZINES_DATA } from '../config/magazines';
import type { SceneKey } from '../config/scenes';
import type { SectionKey } from '../components/ContestModal';
import {
  Award,
  Camera,
  Images,
  Mountain,
  BookOpen,
  Newspaper,
  Music
} from 'lucide-react';

interface TentSceneProps {
  onNavigate: (scene: SceneKey) => void;
  onSelectSection: (key: SectionKey) => void;
  onOpenAlbum: () => void;
  onOpenMagazine: (index: number) => void;
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

// 3D-модель настольной лампы военкора (public/models/desk_lamp.glb)
function DeskLamp({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 0.18,
  lightIntensity = 3.6
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  lightIntensity?: number;
}) {
  const { scene } = useGLTF('./models/desk_lamp.glb', './draco/');

  const lampScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          child.material.emissiveIntensity = 2.2;
          child.material.needsUpdate = true;
        }
      }
    });
    return clone;
  }, [scene]);

  return (
    <group position={position} rotation={rotation}>
      <primitive
        object={lampScene}
        position={[0, 0.045, 0]}
        scale={[scale, scale, scale]}
      />
      {/* Тёплый свет лампы */}
      <pointLight
        position={[0, 0.32, 0]}
        color="#fbbf24"
        intensity={lightIntensity}
        distance={6}
        decay={1.8}
        castShadow
      />
      {/* Световой конус, падающий на предметы на столе */}
      <spotLight
        position={[0, 0.35, 0]}
        color="#fef08a"
        intensity={lightIntensity * 0.85}
        distance={3}
        angle={Math.PI / 3}
        penumbra={0.7}
      />
    </group>
  );
}

useGLTF.preload('./models/desk_lamp.glb', './draco/');

// Аутентичный деревянный полевой стол военкора (public/models/old_table.glb)
function OldTable({
  position = [0, 0, 0],
  rotation = [0, 0, 0]
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const { scene } = useGLTF('./models/old_table.glb');

  // Клонируем сцену, чтобы каждый стол был независимым объектом в сцене Three.js
  const tableClone = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          child.material.roughness = Math.max(0.75, child.material.roughness || 0.8);
          child.material.needsUpdate = true;
        }
      }
    });
    return clone;
  }, [scene]);

  return (
    <primitive
      object={tableClone}
      position={position}
      rotation={rotation}
      scale={[0.0105, 0.0105, 0.0105]}
    />
  );
}

useGLTF.preload('./models/old_table.glb');

// Второй деревянный стол с периодикой и публикациями о военкоре (public/models/magazines)
function PressDesk({
  position,
  rotation = [0, 0, 0],
  onOpenMagazine,
  hidden = false
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  onOpenMagazine: (index: number) => void;
  hidden?: boolean;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* 3D-модель деревянного стола */}
      <OldTable position={[0, 0, 0]} />

      {/* Портрет военкора в рамке на ящике у бинокля (public/models/portrait_02.glb) */}
      <Portrait02Model position={[3.3, 0.53, 0.8]} rotation={[-0.35, 0.1, 0]} scale={0.1} />

      {/* Настольная лампа для чтения в дальнем углу стола */}
      <DeskLamp position={[-0.38, 0.74, -0.2]} rotation={[0, 0.8, 0]} />

      {/* 5 публикаций (журналы, статьи, афиша, газеты) в виде интерактивных 3D-планов */}
      <Suspense fallback={null}>
        {/* 1. Журнал «Спецназ» — обложка */}
        <MagazineTableItem
          item={MAGAZINES_DATA[0]}
          index={0}
          localPosition={[-0.26, 0.791, -0.06]}
          localRotation={[-Math.PI / 2, 0, 0.08]}
          size={[0.23, 0.30]}
          onOpen={onOpenMagazine}
          hidden={hidden}
        />

        {/* 2. Журнал «Спецназ» — статья стр. 25 */}
        <MagazineTableItem
          item={MAGAZINES_DATA[1]}
          index={1}
          localPosition={[-0.14, 0.793, 0.08]}
          localRotation={[-Math.PI / 2, 0, -0.06]}
          size={[0.23, 0.30]}
          onOpen={onOpenMagazine}
          hidden={hidden}
        />

        {/* 3. Афиша выставки «Мгновения войны» */}
        <MagazineTableItem
          item={MAGAZINES_DATA[2]}
          index={2}
          localPosition={[0.04, 0.792, -0.04]}
          localRotation={[-Math.PI / 2, 0, 0.04]}
          size={[0.21, 0.32]}
          onOpen={onOpenMagazine}
          hidden={hidden}
        />

        {/* 4. Газета «Голос Приграничья» — титул */}
        <MagazineTableItem
          item={MAGAZINES_DATA[3]}
          index={3}
          localPosition={[0.24, 0.791, -0.06]}
          localRotation={[-Math.PI / 2, 0, -0.05]}
          size={[0.28, 0.29]}
          onOpen={onOpenMagazine}
          hidden={hidden}
        />

        {/* 5. Газета «Голос Приграничья» — статья */}
        <MagazineTableItem
          item={MAGAZINES_DATA[4]}
          index={4}
          localPosition={[0.34, 0.793, 0.08]}
          localRotation={[-Math.PI / 2, 0, 0.07]}
          size={[0.24, 0.35]}
          onOpen={onOpenMagazine}
          hidden={hidden}
        />
      </Suspense>
    </group>
  );
}

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
  const scale_no_hover = 2.3;
  const scale_hover = scale_no_hover + 0.2;

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
      rotation={[0, 0.5, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
      scale={hovered ? [scale_hover, scale_hover, scale_hover] : [scale_no_hover, scale_no_hover, scale_no_hover]}
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

// 3D-модель армейского ящика (public/models/military_box.glb)
function MilitaryBox({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 0.42
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF('./models/military_box.glb', './draco/');
  const boxClone = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <Center bottom>
        <primitive object={boxClone} />
      </Center>
    </group>
  );
}

useGLTF.preload('./models/military_box.glb', './draco/');

// 3D-модель полевого бинокля (public/models/binocular.glb)
function BinocularsModel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 0.00045,
  onClick
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const { scene } = useGLTF('./models/binocular.glb', './draco/');
  const binocClone = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={onClick}
      scale={hovered ? [scale * 1.08, scale * 1.08, scale * 1.08] : [scale, scale, scale]}
    >
      <Center bottom>
        <primitive object={binocClone} />
      </Center>
    </group>
  );
}

useGLTF.preload('./models/binocular.glb', './draco/');

// 3D-модель портрета 01 в рамке на подставке (public/models/portrait_01.glb)
function Portrait01Model({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 0.16
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF('./models/portrait_01.glb', './draco/');
  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <Center bottom>
        <primitive object={clone} />
      </Center>
    </group>
  );
}

useGLTF.preload('./models/portrait_01.glb', './draco/');

// 3D-модель портрета 02 в рамке на подставке (public/models/portrait_02.glb)
function Portrait02Model({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 0.15
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF('./models/portrait_02.glb', './draco/');
  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <Center bottom>
        <primitive object={clone} />
      </Center>
    </group>
  );
}

useGLTF.preload('./models/portrait_02.glb', './draco/');

// 6. Наблюдательный пункт: командирский бинокль на армейском ящике
function BinocularsItem({ position, onClick }: { position: [number, number, number]; onClick: () => void }) {
  return (
    <group position={position}>
      <MilitaryBox position={[0.3, -0.050, 0]} rotation={[0.02, -0.25, 0.05]} scale={0.4} />
      <BinocularsModel
        position={[0.2, 0, 0]}
        rotation={[0, -0.35, 0.3]}
        scale={0.00045}
        onClick={onClick}
      />
    </group>
  );
}

// 3D-модель армейской акустической гитары (public/models/acoustic_guitar.glb)
function AcousticGuitar({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 0.48,
  onClick
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const { scene } = useGLTF('./models/acoustic_guitar.glb', './draco/');
  const guitarClone = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={onClick}
      scale={hovered ? [scale * 1.06, scale * 1.06, scale * 1.06] : [scale, scale, scale]}
    >
      <Center bottom>
        <primitive object={guitarClone} />
      </Center>
    </group>
  );
}

useGLTF.preload('./models/acoustic_guitar.glb', './draco/');

// 3D-модель плетеной корзины с поленьями дров (public/models/wicker_basket_with_firewood.glb)
function FirewoodBasket({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 0.055
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF('./models/wicker_basket_with_firewood.glb');
  const basketClone = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <Center bottom>
        <primitive object={basketClone} />
      </Center>
    </group>
  );
}

useGLTF.preload('./models/wicker_basket_with_firewood.glb');

// 3D-модель автомата АК-74 (public/models/ak-74.glb)
function Ak74Model({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 0.22,
  onClick
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const { scene } = useGLTF('./models/ak-74.glb', './draco/');

  const akClone = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          child.material.roughness = Math.max(0.35, child.material.roughness || 0.4);
          child.material.metalness = Math.min(0.85, child.material.metalness || 0.6);
          child.material.needsUpdate = true;
        }
      }
    });
    return clone;
  }, [scene]);

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={onClick}
      scale={hovered ? [scale * 1.04, scale * 1.04, scale * 1.04] : [scale, scale, scale]}
    >
      <Center>
        <primitive object={akClone} />
      </Center>
    </group>
  );
}

useGLTF.preload('./models/ak-74.glb', './draco/');

// 7. Костровой уголок: плетеная корзина с дровами и гитара военкора
function CampfireCornerItem({ position, onClick }: { position: [number, number, number]; onClick: () => void }) {
  return (
    <group position={position}>
      {/* Аутентичная плетёная корзина с поленьями */}
      <FirewoodBasket position={[0, 0.36, 0]} rotation={[0, 0.4, 0]} scale={0.03} />
      {/* Акустическая гитара, прислонённая к корзине с дровами */}
      <AcousticGuitar
        position={[0.07, 0.45, 0.12]}
        rotation={[1, 0.35, -0.12]}
        scale={0.48}
        onClick={onClick}
      />
    </group>
  );
}

export function TentScene({
  onNavigate,
  onSelectSection,
  onOpenAlbum,
  onOpenMagazine,
  hidden = false
}: TentSceneProps) {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Базовая 3D-модель палаточного лагеря (public/models/tent.glb) */}
      <TentBaseModel />

      {/* 2. Первый деревянный стол перед входом в палатку (награды, альбом, камера, лампа) */}
      <OldTable position={[0, 0, 1.35]} />

      {/* Настольная лампа на краю стола (public/models/desk_lamp.glb) */}
      <DeskLamp position={[0.42, 0.74, 1.20]} rotation={[0, -0.6, 0]} />

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
        position={[0.33, 0.855, 1.35]}
        onClick={() => onNavigate('cameras')}
      />

      {/* Портрет военкора в рамке на столе с периодикой и публикациями (public/models/portrait_01.glb) */}
      <Portrait01Model
        position={[-1.5, 1, 1.05]}
        rotation={[-0.2, 0.15, 0]}
        scale={0.12}
      />

      {/* 3. Второй деревянный стол слева с периодикой и публикациями (public/models/magazines) */}
      <PressDesk
        position={[-1.25, 0, 1.25]}
        rotation={[0, 0.45, 0]}
        onOpenMagazine={onOpenMagazine}
        hidden={hidden}
      />

      {/* 4. Внутри штабной палатки: армейский ящик и автомат АК-74 военкора */}
      <group position={[0, 0, -0.2]}>
        <MilitaryBox position={[0, 0, 0]} rotation={[0, 0.08, 0]} scale={0.46} />
        {/* Автомат АК-74, прислонённый к армейскому ящику внутри палатки */}
        <Ak74Model
          position={[0.2, 0.45, 0.18]}
          rotation={[1.6, 0.15, -1.25]}
          scale={0.18}
        />
        {/* Тёплая подсветка внутри палатки */}
        <pointLight position={[0, 0.85, 0]} color="#fef08a" intensity={1.8} distance={4} decay={2} />
      </group>

      {/* Предметы вокруг палаточного лагеря */}
      {/* Личное дело и карта на штабной подставке слева от входа */}
      <MapAndPapersItem
        position={[-0.95, 0.75, 0.95]}
        onClick={() => onSelectSection('biography')}
      />

      {/* Костровой уголок и корзина с дровами слева */}
      <CampfireCornerItem
        position={[-1.55, 0, 0.1]}
        onClick={() => onSelectSection('audio')}
      />

      {/* Командирский бинокль на ящике справа с обзором перевала */}
      <BinocularsItem
        position={[1.5, 0.42, 0.4]}
        onClick={() => onNavigate('panorama360')}
      />

      {/* =========================================================================
          Чётко распределённые 3D-хотспоты без наложения:
          - Центр стола: Фотоальбом
          - Левый край стола: Награды
          - Правый край стола: Фотоаппаратура
          - Штабная стойка слева: Личное дело
          - Музыкальный уголок слева: Аудиозаписи
          - Костровой сектор слева: Быт и песни
          - Панорамный пункт справа: Перевал Саланг
          - Второй стол слева: Пресса и статьи о военкоре
          ========================================================================= */}

      {/* 1. ФОТОАЛЬБОМ (по центру стола) */}
      <Hotspot
        position={[0, 1.00, 1.35]}
        icon={<Images size={18} />}
        label="«Афганский репортаж»"
        onClick={() => onNavigate('album')}
        color="#714818ff"
        hidden={hidden}
      />

      {/* 3. НАГРАДЫ (левая часть стола) */}
      <Hotspot
        position={[-0.32, 0.96, 1.38]}
        icon={<Award size={18} />}
        label="Экспозиция наград"
        onClick={() => onNavigate('medals')}
        color="#601e1eff"
        hidden={hidden}
      />

      {/* 4. ФОТОАППАРАТЫ (правая часть стола) */}
      <Hotspot
        position={[0.33, 0.99, 1.38]}
        icon={<Camera size={18} />}
        label="Фотоаппаратура"
        onClick={() => onNavigate('cameras')}
        color="#3a5629ff"
        hidden={hidden}
      />

      {/* 5. ЛИЧНОЕ ДЕЛО И БОЕВОЙ ПУТЬ (слева у входа) */}
      <Hotspot
        position={[-1.5, 1.1, 1.2]}
        icon={<BookOpen size={18} />}
        label="Личное дело и боевой путь"
        onClick={() => onSelectSection('biography')}
        color="#98e54676"
        hidden={hidden}
      />

      {/* 6. ПЕСНИ ПОД ГИТАРУ И АУДИОАРХИВ «ГОЛУБЫХ БЕРЕТОВ» (у гитары и магнитофона слева) */}
      <Hotspot
        position={[-1.33, 0.98, 0.2]}
        icon={<Music size={18} />}
        label="«Голубые береты»"
        onClick={() => onSelectSection('audio')}
        color="#3a76edff"
        hidden={hidden}
      />

      {/* 8. 360° ПАНОРАМА ПЕРЕВАЛА САЛАНГ (у бинокля справа) */}
      <Hotspot
        position={[1.55, 0.5, 0.4]}
        icon={<Mountain size={18} />}
        label="360° Панорама перевала Саланг"
        onClick={() => onNavigate('panorama360')}
        color="#246450ff"
        hidden={hidden}
      />

      {/* 9. ПРЕССА И СТАТЬИ О ВОЕНКОРЕ (второй стол слева) */}
      <Hotspot
        position={[-1.25, 1.05, 1.25]}
        icon={<Newspaper size={18} />}
        label="Пресса и статьи"
        onClick={() => onOpenMagazine(0)}
        color="#875d2eff"
        hidden={hidden}
      />
    </group>
  );
}

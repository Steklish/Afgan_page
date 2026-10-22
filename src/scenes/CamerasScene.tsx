import React, { Suspense } from 'react';
import { useGLTF, Center } from '@react-three/drei';
import { CAMERAS_DATA, type CameraItem } from '../config/cameras';
import { Hotspot } from '../components/Hotspot';
import type { SectionKey } from '../components/ContestModal';
import { Eye, Film, Aperture } from 'lucide-react';

interface CamerasSceneProps {
  onSelectSection: (key: SectionKey) => void;
  selectedCameraIndex: number;
  hidden?: boolean;
}

class CameraErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('GLB camera failed to load, falling back to procedural mock:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Процедурная 3D-модель винтажного советского фотоаппарата (Mock-заглушка)
function ProceduralCameraMock({ camera }: { camera: CameraItem }) {
  const isSLR = camera.id === 'zenit';

  return (
    <group position={[0, 0, 0]}>
      {/* Основной корпус (металлический каркас с фактурной отделкой) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.9, 0.45]} />
        <meshStandardMaterial color="#1a1d21" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Верхняя и нижняя хромированные панели корпуса */}
      <mesh position={[0, 0.44, 0]} castShadow>
        <boxGeometry args={[1.52, 0.08, 0.47]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.18} />
      </mesh>
      <mesh position={[0, -0.44, 0]} receiveShadow>
        <boxGeometry args={[1.52, 0.08, 0.47]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.18} />
      </mesh>

      {/* Пентапризма зеркального аппарата («Зенит») или дальномерные окна («ФЭД-2») */}
      {isSLR ? (
        <mesh position={[0, 0.62, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.35, 0.32, 4]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.2} />
        </mesh>
      ) : (
        <>
          {/* Окна оптического дальномера ФЭД-2 */}
          <mesh position={[-0.45, 0.3, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0.45, 0.3, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.1} />
          </mesh>
        </>
      )}

      {/* Тубус объектива (Индустар-26М / Гелиос-44) */}
      <group position={[0, -0.02, 0.35]}>
        {/* Байонет / резьбовое кольцо M39/M42 */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.45, 0.25, 36]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.88} roughness={0.2} />
        </mesh>

        {/* Кольцо фокусировки с насечками */}
        <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.41, 0.16, 36]} />
          <meshStandardMaterial color="#1e242d" roughness={0.6} metalness={0.4} />
        </mesh>

        {/* Передняя линза с просветляющим покрытием (сине-фиолетовый блик) */}
        <mesh position={[0, 0, 0.27]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.05} metalness={0.95} />
        </mesh>
      </group>

      {/* Органы управления на верхней панели: */}
      {/* 1. Спусковая кнопка с резьбой под тросик */}
      <mesh position={[0.55, 0.54, 0.05]}>
        <cylinderGeometry args={[0.08, 0.09, 0.14, 24]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* 2. Диск выдержек */}
      <mesh position={[0.25, 0.52, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.1, 24]} />
        <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.3} />
      </mesh>

      {/* 3. Головка взвода затвора и счетчик кадров */}
      <mesh position={[-0.55, 0.53, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.12, 24]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Загрузка 3D-модели фотоаппарата (в детальном виде используется исторически точная процедурная модель советского аппарата ФЭД-2/Зенит)
function RealOrMockCamera({ camera }: { camera: CameraItem }) {
  // Исключаем generic_camera.glb из детального режима просмотра
  if (!camera.modelFile || camera.modelFile.includes('generic_camera')) {
    return <ProceduralCameraMock camera={camera} />;
  }

  return (
    <CameraErrorBoundary key={camera.id} fallback={<ProceduralCameraMock camera={camera} />}>
      <Suspense fallback={<ProceduralCameraMock camera={camera} />}>
        <GlbCameraLoader camera={camera} />
      </Suspense>
    </CameraErrorBoundary>
  );
}

function GlbCameraLoader({ camera }: { camera: CameraItem }) {
  const { scene } = useGLTF(camera.modelFile);
  return (
    <Center position={[0, 0, 0]}>
      <primitive 
        object={scene} 
        scale={16} 
        rotation={[0, Math.PI / 2, 0]} 
      />
    </Center>
  );
}

export function CamerasScene({
  onSelectSection,
  selectedCameraIndex,
  hidden = false
}: CamerasSceneProps) {
  const camera = CAMERAS_DATA[selectedCameraIndex] || CAMERAS_DATA[0];

  return (
    <group position={[0, 0, 0]}>
      {/* Направленный студийный свет */}
      <spotLight 
        position={[0, 3, 3]} 
        intensity={2.6} 
        angle={0.65} 
        penumbra={0.6} 
        color="#ffffff" 
      />
      <pointLight position={[3, 1, 1]} intensity={1.0} color="#e0f2fe" />
      <pointLight position={[-3, -1, 1]} intensity={0.7} color="#fed7aa" />

      {/* Модель фотоаппарата */}
      <group position={[0, 0.1, 0]}>
        <RealOrMockCamera camera={camera} />

        {/* Интерактивный хотспот: Оптика и объектив */}
        <Hotspot 
          position={[0, -0.05, 0.72]} 
          icon={<Aperture size={18} />} 
          label={`Оптика: ${camera.lens}`} 
          onClick={() => onSelectSection('sources')} 
          color="#38bdf8"
          hidden={hidden}
        />

        {/* Интерактивный хотспот: Дальномер и видоискатель */}
        <Hotspot 
          position={[-0.55, 0.45, 0.25]} 
          icon={<Eye size={18} />} 
          label="Видоискатель и съемка навскидку" 
          onClick={() => onSelectSection('biography')} 
          color="#f59e0b"
          hidden={hidden}
        />

        {/* Интерактивный хотспот: Пленка и архивы */}
        <Hotspot 
          position={[0.55, 0.45, 0.25]} 
          icon={<Film size={18} />} 
          label="Пленка и полевая фотолаборатория" 
          onClick={() => onSelectSection('memory')} 
          color="#10b981"
          hidden={hidden}
        />
      </group>
    </group>
  );
}

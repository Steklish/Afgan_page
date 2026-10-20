import { useState, Suspense } from 'react';
import { useGLTF, Center } from '@react-three/drei';
import { MEDALS_DATA, type MedalItem } from '../config/medals';
import { Hotspot } from '../components/Hotspot';
import type { SectionKey } from '../components/ContestModal';
import { BookOpen, Award } from 'lucide-react';

interface MedalsSceneProps {
  onSelectSection: (key: SectionKey) => void;
  selectedMedalIndex: number;
  hidden?: boolean;
}

// Процедурная 3D-модель медали (Mock-заглушка с аутентичной пятиугольной колодкой и диском/звездой)
function ProceduralMedalMock({ medal }: { medal: MedalItem }) {
  const isStar = medal.id === 'gvardia' || medal.id === 'internationalist';

  return (
    <group position={[0, 0, 0]}>
      {/* Пятиугольная колодка советского образца */}
      <group position={[0, 0.45, 0]}>
        {/* Основа колодки */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.7, 0.55, 0.04]} />
          <meshStandardMaterial 
            color={medal.ribbonColors[0] || '#94a3b8'} 
            roughness={0.6} 
            metalness={0.1} 
          />
        </mesh>

        {/* Продольные полосы ленты */}
        {medal.ribbonColors.slice(1).map((col, idx) => (
          <mesh key={idx} position={[(idx - 0.5) * 0.18, 0, 0.025]} castShadow>
            <boxGeometry args={[0.1, 0.55, 0.01]} />
            <meshStandardMaterial color={col} roughness={0.5} />
          </mesh>
        ))}

        {/* Металлическая окантовка и булавка сзади */}
        <mesh position={[0, -0.28, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.25, 0.25, 0.03, 4]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Соединительное кольцо */}
      <mesh position={[0, 0.14, 0]}>
        <torusGeometry args={[0.06, 0.015, 16, 32]} />
        <meshStandardMaterial color={medal.metalColor} metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Медальон (круглый или фигурный) */}
      <group position={[0, -0.3, 0]}>
        {!isStar ? (
          <>
            {/* Круглый металлический медальон */}
            <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.42, 0.42, 0.05, 48]} />
              <meshStandardMaterial 
                color={medal.metalColor} 
                metalness={0.88} 
                roughness={0.25} 
              />
            </mesh>

            {/* Выпуклый рельеф в центре */}
            <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.34, 0.34, 0.02, 36]} />
              <meshStandardMaterial 
                color={medal.metalColor} 
                metalness={0.92} 
                roughness={0.2} 
              />
            </mesh>

            {/* Красная звезда в верхней части */}
            <mesh position={[0, 0.16, 0.045]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.02, 5]} />
              <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.3} />
            </mesh>
          </>
        ) : (
          <>
            {/* Орденская пятиконечная звезда (Гвардия / Воин-интернационалист) */}
            <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, Math.PI]}>
              <cylinderGeometry args={[0.48, 0.48, 0.06, 5]} />
              <meshStandardMaterial color="#dc2626" roughness={0.25} metalness={0.5} />
            </mesh>

            {/* Золотистый венок и щит */}
            <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.26, 0.26, 0.03, 32]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
            </mesh>
          </>
        )}
      </group>
    </group>
  );
}

// Загрузка реального GLB файла медали с авто-переходом на процедурную модель
function RealOrMockMedal({ medal }: { medal: MedalItem }) {
  const [loadFailed, setLoadFailed] = useState(false);

  if (loadFailed) {
    return <ProceduralMedalMock medal={medal} />;
  }

  return (
    <Suspense fallback={<ProceduralMedalMock medal={medal} />}>
      <GlbMedalLoader medal={medal} onError={() => setLoadFailed(true)} />
    </Suspense>
  );
}

function GlbMedalLoader({ medal, onError }: { medal: MedalItem; onError: () => void }) {
  try {
    const { scene } = useGLTF(medal.modelFile);
    return (
      <Center position={[0, 0, 0]}>
        <primitive object={scene} scale={1} />
      </Center>
    );
  } catch (e) {
    onError();
    return <ProceduralMedalMock medal={medal} />;
  }
}

export function MedalsScene({
  onSelectSection,
  selectedMedalIndex,
  hidden = false
}: MedalsSceneProps) {
  const medal = MEDALS_DATA[selectedMedalIndex] || MEDALS_DATA[0];

  return (
    <group position={[0, 0, 0]}>
      {/* Мягкий музейный направленный свет на витрину */}
      <spotLight 
        position={[0, 3, 3]} 
        intensity={2.5} 
        angle={0.6} 
        penumbra={0.5} 
        color="#fffbeb" 
      />
      <pointLight position={[2, 1, 1]} intensity={1.2} color="#fef08a" />
      <pointLight position={[-2, -1, 1]} intensity={0.8} color="#93c5fd" />

      {/* 3D-модель выбранной медали */}
      <group position={[0, 0, 0]}>
        <RealOrMockMedal medal={medal} />

        {/* Интерактивный хотспот 1: Описание подвига */}
        <Hotspot 
          position={[0, -0.85, 0.3]} 
          icon={<BookOpen size={18} />} 
          label="Подвиг и основание награждения" 
          onClick={() => onSelectSection('biography')} 
          color="#d97706"
          hidden={hidden}
        />

        {/* Интерактивный хотспот 2: Исторический формуляр */}
        <Hotspot 
          position={[0.65, 0.45, 0.2]} 
          icon={<Award size={18} />} 
          label="Статус и лента награды" 
          onClick={() => onSelectSection('sources')} 
          color="#2563eb"
          hidden={hidden}
        />
      </group>
    </group>
  );
}

import React, { useState, useEffect, Suspense, Component, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture, Html, Preload, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { 
  BookOpen, 
  Volume2, 
  Film, 
  MapPin, 
  X, 
  Mountain,
  Landmark,
  Box,
  Compass,
  AlertCircle
} from 'lucide-react';

type SectionKey = 'biography' | 'audio' | 'video' | 'memory' | 'sources';
type SceneMode = 'panorama360' | 'monument' | 'model';

interface HotspotProps {
  position: [number, number, number];
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

// Компонент интерактивной 3D-метки с привязкой 2D-кнопки и всплывающего лейбла через Drei <Html>
function Hotspot({ position, icon, label, onClick }: HotspotProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial transparent opacity={0} />
      <Html distanceFactor={10} center>
        <div 
          className="hotspot-wrapper"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <button 
            className="hotspot-pin" 
            onClick={onClick} 
            title={label}
            aria-label={label}
          >
            {icon}
          </button>
          <div 
            className="hotspot-label"
            style={{ 
              opacity: hovered ? 1 : 0.88,
              transform: hovered ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            {label}
          </div>
        </div>
      </Html>
    </mesh>
  );
}

// Установка 360° панорамного изображения в качестве фона и окружения сцены (Skybox)
function PanoramaSkybox({ url }: { url: string }) {
  const texture = useTexture(url);
  const { scene } = useThree();

  useEffect(() => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    scene.background = texture;
    scene.environment = texture;
    return () => {
      scene.background = null;
      scene.environment = null;
    };
  }, [texture, scene]);

  return null;
}

// Управление FOV зумом в режиме 360° панорамы (колесико мыши)
function PanoramaZoomController() {
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

// Адаптер позиции камеры при смене режима сцены
function CameraController({ mode }: { mode: SceneMode }) {
  const { camera } = useThree();

  useEffect(() => {
    if (mode === 'panorama360') {
      camera.position.set(0, 0, 0.01);
      if ('fov' in camera && typeof camera.fov === 'number') {
        camera.fov = 65;
        camera.updateProjectionMatrix();
      }
    } else {
      camera.position.set(0, 1.4, 4.2);
      if ('fov' in camera && typeof camera.fov === 'number') {
        camera.fov = 45;
        camera.updateProjectionMatrix();
      }
    }
  }, [mode, camera]);

  return null;
}

// 1. Сцена 360° Иммерсивного тура (хотспоты расставлены по ключевым точкам горного ландшафта)
function Panorama360Scene({ onSelect }: { onSelect: (key: SectionKey) => void }) {
  return (
    <group>
      {/* Точка 1: Биография — на фоне высокого заснеженного перевала по центру */}
      <Hotspot 
        position={[0, 1.3, -6.2]} 
        icon={<BookOpen size={18} />} 
        label="Биография и боевые заслуги" 
        onClick={() => onSelect('biography')} 
      />

      {/* Точка 2: Аудиоархив — на скальном массиве справа */}
      <Hotspot 
        position={[5.6, 0.6, -2.8]} 
        icon={<Volume2 size={18} />} 
        label="Голоса памяти: аудиоархив" 
        onClick={() => onSelect('audio')} 
      />

      {/* Точка 3: Видеохроника — над серпантином горной дороги Саланга */}
      <Hotspot 
        position={[2.4, -1.6, -5.2]} 
        icon={<Film size={18} />} 
        label="Хроника событий: видео" 
        onClick={() => onSelect('video')} 
      />

      {/* Точка 4: Память — на горном хребте слева */}
      <Hotspot 
        position={[-5.2, 0.4, -3.8]} 
        icon={<MapPin size={18} />} 
        label="Увековечение памяти земляка" 
        onClick={() => onSelect('memory')} 
      />
    </group>
  );
}

// 2. Сцена 3D-Обелиска (мемориальная стела на фоне горной панорамы)
function MonumentScene({ onSelect }: { onSelect: (key: SectionKey) => void }) {
  return (
    <group position={[0, -0.6, 0]}>
      {/* Нижнее гранитное основание */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.3, 2.2]} />
        <meshStandardMaterial color="#1e242d" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Второй ярус постамента */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.25, 1.5]} />
        <meshStandardMaterial color="#2c3440" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Мемориальная стела */}
      <mesh position={[0, 1.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.6, 2.2, 4]} />
        <meshStandardMaterial color="#3b4252" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Символический мемориальный знак */}
      <mesh position={[0, 1.6, 0.35]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 32]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Латунная табличка */}
      <mesh position={[0, 0.4, 0.76]} castShadow>
        <boxGeometry args={[0.8, 0.18, 0.02]} />
        <meshStandardMaterial color="#d97706" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Хотспоты стелы */}
      <Hotspot position={[0, 2.4, 0.1]} icon={<BookOpen size={18} />} label="Биография" onClick={() => onSelect('biography')} />
      <Hotspot position={[-1.1, 1.3, 0.2]} icon={<Volume2 size={18} />} label="Аудиоархив" onClick={() => onSelect('audio')} />
      <Hotspot position={[1.1, 1.3, 0.2]} icon={<Film size={18} />} label="Видеохроника" onClick={() => onSelect('video')} />
      <Hotspot position={[0, 0.4, 0.95]} icon={<MapPin size={18} />} label="Память" onClick={() => onSelect('memory')} />
    </group>
  );
}

// 3. Загрузка внешней GLB 3D-модели (public/models/scene.glb)
function ModelScene({ onSelect }: { onSelect: (key: SectionKey) => void }) {
  const { scene } = useGLTF('./models/scene.glb');

  return (
    <primitive object={scene} position={[0, -1, 0]}>
      <Hotspot position={[0, 1.8, 0.3]} icon={<BookOpen size={18} />} label="Биография" onClick={() => onSelect('biography')} />
      <Hotspot position={[-0.9, 1.2, 0.4]} icon={<Volume2 size={18} />} label="Аудиоархив" onClick={() => onSelect('audio')} />
      <Hotspot position={[0.9, 1.2, 0.4]} icon={<Film size={18} />} label="Видеохроника" onClick={() => onSelect('video')} />
      <Hotspot position={[0, 0.3, 0.7]} icon={<MapPin size={18} />} label="Память" onClick={() => onSelect('memory')} />
    </primitive>
  );
}

// Error Boundary для безопасной подгрузки GLB
interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
  resetKey?: unknown;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SceneErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function App() {
  const [activeModal, setActiveModal] = useState<SectionKey | null>(null);
  // Режимы: 360° панорама перевала (по умолчанию), 3D-обелиск или внешняя 3D-модель
  const [sceneMode, setSceneMode] = useState<SceneMode>('panorama360');

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Заголовок плаката и переключатель режимов */}
      <div className="header-overlay">
        <h1>У каждого времени свои герои</h1>
        <p>Интерактивный 3D-плакат памяти воина-интернационалиста</p>

        <div className="mode-switcher">
          <button 
            className={`mode-btn ${sceneMode === 'panorama360' ? 'active' : ''}`}
            onClick={() => setSceneMode('panorama360')}
            title="360° Панорамный осмотр перевала"
          >
            <Mountain size={13} />
            360° Панорама перевала
          </button>

          <button 
            className={`mode-btn ${sceneMode === 'monument' ? 'active' : ''}`}
            onClick={() => setSceneMode('monument')}
            title="3D-Стела на фоне гор"
          >
            <Landmark size={13} />
            3D-Обелиск
          </button>

          <button 
            className={`mode-btn ${sceneMode === 'model' ? 'active' : ''}`}
            onClick={() => setSceneMode('model')}
            title="3D-модель из public/models/scene.glb"
          >
            <Box size={13} />
            3D-Модель (GLB)
          </button>
        </div>
      </div>

      {/* Индикатор локации в 360° */}
      <div className="location-badge">
        <Compass size={15} color="#ef4444" />
        <span>360°</span> Горный перевал • Гиндукуш
      </div>

      {/* Подсказка управления */}
      <div className="controls-hint">
        {sceneMode === 'panorama360' ? (
          'Вращение: Потяните курсор / Касание • Приближение: Колесо мыши'
        ) : (
          'Вращение: ЛКМ • Масштаб: Колесо мыши'
        )}
      </div>

      {/* Кнопка скрытых источников (требование п. 5.3) */}
      <button className="sources-btn" onClick={() => setActiveModal('sources')}>
        Источники информации
      </button>

      {/* 3D Canvas */}
      <Canvas 
        camera={{ position: [0, 0, 0.01], fov: 65 }}
        shadows
      >
        <ambientLight intensity={0.9} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.6} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-4, 3, -2]} intensity={0.5} color="#93c5fd" />

        <Suspense fallback={
          <Html center>
            <div style={{ 
              color: '#f8fafc', 
              background: 'rgba(13, 15, 18, 0.9)', 
              padding: '0.85rem 1.4rem', 
              borderRadius: '8px', 
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
            }}>
              Загрузка 360° панорамы...
            </div>
          </Html>
        }>
          {/* 360° панорама Саланга в качестве Skybox фона */}
          <PanoramaSkybox url="./images/360_01.webp" />
          <CameraController mode={sceneMode} />

          {sceneMode === 'panorama360' && (
            <>
              <Panorama360Scene onSelect={setActiveModal} />
              <PanoramaZoomController />
              <OrbitControls 
                enablePan={false}
                enableZoom={false}
                rotateSpeed={-0.6}
                minDistance={0.005}
                maxDistance={0.02}
                target={[0, 0, 0]}
              />
            </>
          )}

          {sceneMode === 'monument' && (
            <>
              <MonumentScene onSelect={setActiveModal} />
              <ContactShadows position={[0, -0.6, 0]} opacity={0.65} scale={10} blur={2.2} />
              <OrbitControls 
                enablePan={false}
                minDistance={2} 
                maxDistance={7} 
                maxPolarAngle={Math.PI / 2 + 0.05} 
                target={[0, 0.8, 0]}
              />
            </>
          )}

          {sceneMode === 'model' && (
            <SceneErrorBoundary 
              resetKey={sceneMode}
              fallback={
                <Html center>
                  <div style={{ 
                    color: '#f87171', 
                    background: 'rgba(24, 10, 10, 0.92)', 
                    padding: '1rem 1.25rem', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    maxWidth: '320px',
                    textAlign: 'center',
                    fontSize: '0.85rem'
                  }}>
                    <AlertCircle size={24} style={{ margin: '0 auto 0.5rem', display: 'block', color: '#ef4444' }} />
                    <strong>Файл scene.glb не найден</strong>
                    <p style={{ marginTop: '0.35rem', color: '#cbd5e1', fontSize: '0.78rem' }}>
                      Поместите 3D-модель в <code>public/models/scene.glb</code> или выберите режим «360° Панорама перевала».
                    </p>
                  </div>
                </Html>
              }
            >
              <ModelScene onSelect={setActiveModal} />
              <ContactShadows position={[0, -1, 0]} opacity={0.65} scale={10} blur={2.2} />
              <OrbitControls 
                enablePan={false}
                minDistance={2} 
                maxDistance={7} 
                maxPolarAngle={Math.PI / 2 + 0.05} 
                target={[0, 0.5, 0]}
              />
            </SceneErrorBoundary>
          )}

          <Preload all />
        </Suspense>
      </Canvas>

      {/* Модальные окна с контентом конкурса */}
      {activeModal && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {activeModal === 'biography' && 'Биографический портрет и боевой путь'}
                {activeModal === 'audio' && 'Голоса эпохи: воспоминания и поэзия'}
                {activeModal === 'video' && 'Документальная хроника и видеоинтервью'}
                {activeModal === 'memory' && 'Увековечение памяти о земляке'}
                {activeModal === 'sources' && 'Использованные источники и архивные фонды'}
              </h2>
              <button className="close-btn" onClick={() => setActiveModal(null)} aria-label="Закрыть">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {activeModal === 'biography' && (
                <div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <img 
                      src="./images/hero_photo.jpg" 
                      alt="Портрет воина-интернационалиста" 
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                      style={{ 
                        width: '140px', 
                        height: '180px', 
                        objectFit: 'cover', 
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.6)'
                      }} 
                    />
                    <div style={{ flex: '1 1 240px' }}>
                      <p>
                        <strong>Годы службы и подвиг:</strong> Родился в нашем крае, окончил школу, 
                        был призван в ряды Вооруженных Сил. Принимал участие в выполнении 
                        интернационального долга в Демократической Республике Афганистан (1979–1989 гг.).
                      </p>
                      <p style={{ marginTop: '0.75rem' }}>
                        Проходил службу на сложных участках горных перевалов Саланг и провинций Афганистана. 
                        За проявленное мужество, стойкость и отвагу при выполнении боевых задач награждён 
                        высокими государственными наградами.
                      </p>
                    </div>
                  </div>
                  <div className="modal-note">
                    Подсказка: замените <code>public/images/hero_photo.jpg</code> на архивную фотографию героя.
                  </div>
                </div>
              )}

              {activeModal === 'audio' && (
                <div>
                  <p>
                    Аудиозапись воспоминаний сослуживцев, родственников и тематических стихотворений 
                    времён Афганской войны.
                  </p>
                  <audio className="modal-media" controls src="./audio/voice_archive.mp3">
                    Ваш браузер не поддерживает элемент audio.
                  </audio>
                  <p className="modal-note">
                    Подсказка: разместите аудиозапись в <code>public/audio/voice_archive.mp3</code>.
                  </p>
                </div>
              )}

              {activeModal === 'video' && (
                <div>
                  <p>
                    Фрагменты интервью с участниками событий, поисковые экспедиции школьного музея 
                    и документальная кинохроника перевала Саланг.
                  </p>
                  <video 
                    className="modal-media" 
                    controls 
                    src="./video/documentary.mp4" 
                    poster="./images/360_01.webp"
                  >
                    Ваш браузер не поддерживает элемент video.
                  </video>
                  <p className="modal-note">
                    Подсказка: положите видео в <code>public/video/documentary.mp4</code> или вставьте YouTube embed <code>&lt;iframe&gt;</code>.
                  </p>
                </div>
              )}

              {activeModal === 'memory' && (
                <div>
                  <p>
                    <strong>Память в граните и делах:</strong>
                  </p>
                  <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', lineHeight: '1.7' }}>
                    <li>Мемориальная доска на здании школы;</li>
                    <li>Экспозиция в районном историко-краеведческом музее;</li>
                    <li>Ежегодные уроки мужества, вахты памяти и памятные турниры;</li>
                    <li>Поисково-исследовательская работа учащихся и волонтёров.</li>
                  </ul>
                </div>
              )}

              {activeModal === 'sources' && (
                <div>
                  <p>Список документальных источников исследования (п. 5.3 условий конкурса):</p>
                  <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', fontSize: '0.88rem', lineHeight: '1.7' }}>
                    <li>Материалы фондов школьного историко-краеведческого музея;</li>
                    <li>Семейный архив и письма воина-интернационалиста;</li>
                    <li>Книга памяти воинов-интернационалистов Республики Беларусь;</li>
                    <li>Материалы периодической печати и наградные документы военных комиссариатов.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

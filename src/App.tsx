import React, { useState, Suspense, Component, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Preload, ContactShadows } from '@react-three/drei';
import { 
  BookOpen, 
  Volume2, 
  Film, 
  MapPin, 
  X, 
  Layers,
  AlertCircle
} from 'lucide-react';

type SectionKey = 'biography' | 'audio' | 'video' | 'memory' | 'sources';

interface HotspotProps {
  position: [number, number, number];
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

// Компонент 3D-метки с привязкой 2D-кнопки через Drei <Html>
function Hotspot({ position, icon, label, onClick }: HotspotProps) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial transparent opacity={0} />
      <Html distanceFactor={8} center>
        <button 
          className="hotspot-pin" 
          onClick={onClick} 
          title={label}
          aria-label={label}
        >
          {icon}
        </button>
      </Html>
    </mesh>
  );
}

// Загрузка реальной GLB модели с хотспотами
function ModelScene({ onSelect }: { onSelect: (key: SectionKey) => void }) {
  // Файл должен лежать в public/models/scene.glb
  const { scene } = useGLTF('./models/scene.glb');

  return (
    <primitive object={scene} position={[0, -1, 0]}>
      {/* Точка 1: Биография и боевой путь */}
      <Hotspot 
        position={[0, 1.8, 0.3]} 
        icon={<BookOpen size={18} />} 
        label="Биография и боевые заслуги" 
        onClick={() => onSelect('biography')} 
      />
      
      {/* Точка 2: Аудиозапись воспоминаний / песен эпохи */}
      <Hotspot 
        position={[-0.9, 1.2, 0.4]} 
        icon={<Volume2 size={18} />} 
        label="Голоса памяти: аудиоархив" 
        onClick={() => onSelect('audio')} 
      />

      {/* Точка 3: Документальная хроника и видеоинтервью */}
      <Hotspot 
        position={[0.9, 1.2, 0.4]} 
        icon={<Film size={18} />} 
        label="Хроника событий: видео" 
        onClick={() => onSelect('video')} 
      />

      {/* Точка 4: Увековечение памяти и музейные экспозиции */}
      <Hotspot 
        position={[0, 0.3, 0.7]} 
        icon={<MapPin size={18} />} 
        label="Увековечение памяти земляка" 
        onClick={() => onSelect('memory')} 
      />
    </primitive>
  );
}

// Символическая мемориальная 3D-композиция (fallback/демо, работает сразу из коробки)
function PlaceholderScene({ onSelect }: { onSelect: (key: SectionKey) => void }) {
  return (
    <group position={[0, -0.6, 0]}>
      {/* Нижнее гранитное основание (постамент) */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.3, 2.2]} />
        <meshStandardMaterial color="#1e242d" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Второй ярус постамента */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.25, 1.5]} />
        <meshStandardMaterial color="#2c3440" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Мемориальная стела (обелиск) */}
      <mesh position={[0, 1.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.6, 2.2, 4]} />
        <meshStandardMaterial color="#3b4252" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Символический мемориальный знак в центре */}
      <mesh position={[0, 1.6, 0.35]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 32]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Символическая латунная табличка на постаменте */}
      <mesh position={[0, 0.4, 0.76]} castShadow>
        <boxGeometry args={[0.8, 0.18, 0.02]} />
        <meshStandardMaterial color="#d97706" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Точка 1: Биография */}
      <Hotspot 
        position={[0, 2.4, 0.1]} 
        icon={<BookOpen size={18} />} 
        label="Биография и боевой путь" 
        onClick={() => onSelect('biography')} 
      />

      {/* Точка 2: Аудиоархив */}
      <Hotspot 
        position={[-1.1, 1.3, 0.2]} 
        icon={<Volume2 size={18} />} 
        label="Голоса памяти: аудиоархив" 
        onClick={() => onSelect('audio')} 
      />

      {/* Точка 3: Видеохроника */}
      <Hotspot 
        position={[1.1, 1.3, 0.2]} 
        icon={<Film size={18} />} 
        label="Хроника событий: видео" 
        onClick={() => onSelect('video')} 
      />

      {/* Точка 4: Память и увековечение */}
      <Hotspot 
        position={[0, 0.4, 0.95]} 
        icon={<MapPin size={18} />} 
        label="Увековечение памяти" 
        onClick={() => onSelect('memory')} 
      />
    </group>
  );
}

// Error Boundary для безопасной подгрузки 3D GLB файла
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
  // Режим сцены: по умолчанию используется стилизованная композиция-демо.
  // Переключитесь на 3D-модель (scene.glb) кнопкой в заголовке или измените значение по умолчанию на false.
  const [useFallback, setUseFallback] = useState<boolean>(true);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Заголовок плаката */}
      <div className="header-overlay">
        <h1>У каждого времени свои герои</h1>
        <p>Интерактивный 3D-плакат памяти воина-интернационалиста</p>
        <button 
          className="model-toggle-badge"
          onClick={() => setUseFallback((prev) => !prev)}
          title="Нажмите для переключения режима отображения 3D"
        >
          <Layers size={13} />
          {useFallback ? 'Режим: Базовая 3D-стела (демо)' : 'Режим: Загрузка public/models/scene.glb'}
        </button>
      </div>

      {/* Подсказка управления */}
      <div className="controls-hint">
        Вращение: ЛКМ / Касание • Приближение: Колесо мыши / Pinch
      </div>

      {/* Кнопка скрытых источников (требование п. 5.3) */}
      <button className="sources-btn" onClick={() => setActiveModal('sources')}>
        Источники информации
      </button>

      {/* 3D Сцена */}
      <Canvas 
        camera={{ position: [0, 1.6, 4.2], fov: 45 }}
        shadows
      >
        <ambientLight intensity={0.8} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={1.8} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-4, 3, -2]} intensity={0.6} color="#93c5fd" />
        <pointLight position={[3, -1, 3]} intensity={0.4} color="#fca5a5" />

        <Suspense fallback={
          <Html center>
            <div style={{ 
              color: '#f8fafc', 
              background: 'rgba(13, 15, 18, 0.85)', 
              padding: '0.75rem 1.25rem', 
              borderRadius: '8px', 
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap'
            }}>
              Загрузка 3D-композиции...
            </div>
          </Html>
        }>
          {useFallback ? (
            <PlaceholderScene onSelect={setActiveModal} />
          ) : (
            <SceneErrorBoundary 
              resetKey={useFallback}
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
                      Поместите 3D-модель в <code>public/models/scene.glb</code> или нажмите кнопку вверху, чтобы вернуться к базовой стеле.
                    </p>
                  </div>
                </Html>
              }
            >
              <ModelScene onSelect={setActiveModal} />
            </SceneErrorBoundary>
          )}
          <ContactShadows position={[0, -0.6, 0]} opacity={0.65} scale={10} blur={2.2} />
          <Preload all />
        </Suspense>

        <OrbitControls 
          enablePan={false}
          minDistance={2} 
          maxDistance={7} 
          maxPolarAngle={Math.PI / 2 + 0.05} 
          autoRotate={false}
        />
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
                        // Показываем стилизованный плейсхолдер при отсутствии локального фото
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                      style={{ 
                        width: '140px', 
                        height: '180px', 
                        objectFit: 'cover', 
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                      }} 
                    />
                    <div style={{ flex: '1 1 240px' }}>
                      <p>
                        <strong>Годы службы и подвиг:</strong> Родился в нашем крае, окончил школу, 
                        был призван в ряды Вооруженных Сил. Принимал участие в выполнении 
                        интернационального долга в Демократической Республике Афганистан (1979–1989 гг.).
                      </p>
                      <p style={{ marginTop: '0.75rem' }}>
                        За проявленное мужество, стойкость и отвагу при выполнении боевых задач 
                        награждён высокими государственными наградами.
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
                    и документальная кинохроника.
                  </p>
                  <video 
                    className="modal-media" 
                    controls 
                    src="./video/documentary.mp4" 
                    poster="./images/poster_preview.png"
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

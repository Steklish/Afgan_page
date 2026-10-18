import { useState, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, Html, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Award, 
  Images, 
  Camera, 
  Mountain, 
  Sparkles, 
  Box, 
  RotateCw, 
  Compass,
  FileText
} from 'lucide-react';

import { SCENES, type SceneKey, getSceneByHash } from './config/scenes';
import { MEDALS_DATA } from './config/medals';
import { CAMERAS_DATA } from './config/cameras';

import { MedalsScene } from './scenes/MedalsScene';
import { AlbumScene } from './scenes/AlbumScene';
import { CamerasScene } from './scenes/CamerasScene';
import { Panorama360Scene } from './scenes/Panorama360Scene';
import { GaussianSplatScene } from './scenes/GaussianSplatScene';
import { CampfireScene } from './scenes/CampfireScene';

import { ContestModal, type SectionKey } from './components/ContestModal';
import { LightboxModal, type AlbumPhoto } from './components/LightboxModal';
import { SceneErrorBoundary } from './components/SceneErrorBoundary';

// Панорамный фон (Skybox)
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

// Контроллер камеры с плавной адаптацией под активную сцену
function CameraRig({ sceneKey }: { sceneKey: SceneKey }) {
  const { camera } = useThree();
  const sceneDef = SCENES.find((s) => s.key === sceneKey) || SCENES[0];

  useEffect(() => {
    camera.position.set(...sceneDef.cameraPosition);
    if ('fov' in camera && typeof camera.fov === 'number') {
      camera.fov = sceneDef.fov;
      camera.updateProjectionMatrix();
    }
  }, [sceneKey, camera, sceneDef]);

  return null;
}

export default function App() {
  // Навигация и синхронизация с URL Hash
  const [currentSceneKey, setCurrentSceneKey] = useState<SceneKey>(() => {
    const initial = getSceneByHash(window.location.hash);
    return initial.key;
  });

  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Выбор конкретной медали и камеры
  const [selectedMedalIndex, setSelectedMedalIndex] = useState<number>(0);
  const [selectedCameraIndex, setSelectedCameraIndex] = useState<number>(0);

  // Модальные окна конкурса
  const [activeContestModal, setActiveContestModal] = useState<SectionKey | null>(null);

  // Фотоальбом и Lightbox
  const [photos, setPhotos] = useState<AlbumPhoto[]>([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

  // Загрузка метаданных альбома
  useEffect(() => {
    fetch('./album/album.json')
      .then((res) => res.json())
      .then((data) => setPhotos(data))
      .catch((err) => console.error('Error loading album.json:', err));
  }, []);

  // Слушатель изменения хэша в URL браузера
  useEffect(() => {
    const handleHashChange = () => {
      const scene = getSceneByHash(window.location.hash);
      setCurrentSceneKey(scene.key);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectScene = (key: SceneKey) => {
    const scene = SCENES.find((s) => s.key === key);
    if (scene) {
      window.location.hash = `#/${scene.hash}`;
      setCurrentSceneKey(key);
    }
  };

  const currentSceneDef = SCENES.find((s) => s.key === currentSceneKey) || SCENES[0];
  const activeMedal = MEDALS_DATA[selectedMedalIndex] || MEDALS_DATA[0];
  const activeCamera = CAMERAS_DATA[selectedCameraIndex] || CAMERAS_DATA[0];

  const isAnyModalOpen = activeContestModal !== null || isLightboxOpen;

  return (
    <div 
      className={`app-root ${isAnyModalOpen ? 'modal-open' : ''}`} 
      style={{ width: '100vw', height: '100vh', position: 'relative' }}
    >
      {/* 1. Верхняя навигационная панель виртуальной выставки */}
      <div className="header-overlay">
        <h1>Алексей Козлов: воин и фотолетописец</h1>
        <p>Интерактивная 3D-выставка памяти пулеметчика 350-го полка ВДВ и ВИА «Голубые береты»</p>

        <div className="mode-switcher">
          {SCENES.map((scene) => {
            const isActive = scene.key === currentSceneKey;
            return (
              <button
                key={scene.key}
                className={`mode-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleSelectScene(scene.key)}
                title={scene.description}
              >
                {scene.key === 'medals' && <Award size={14} />}
                {scene.key === 'album' && <Images size={14} />}
                {scene.key === 'cameras' && <Camera size={14} />}
                {scene.key === 'panorama360' && <Mountain size={14} />}
                {scene.key === 'splat' && <Sparkles size={14} />}
                {scene.key === 'camp' && <Box size={14} />}
                <span>{scene.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Правая музейная карточка экспоната */}
      {currentSceneKey === 'medals' && (
        <div className="museum-card">
          <h3>{activeMedal.title}</h3>
          <div className="museum-card-subtitle">{activeMedal.subtitle} ({activeMedal.year} г.)</div>
          <p>{activeMedal.citation}</p>
          <div className="museum-card-note">
            <span>3D-файл (GLB):</span>
            <code>{activeMedal.modelFile}</code>
          </div>
        </div>
      )}

      {currentSceneKey === 'cameras' && (
        <div className="museum-card">
          <h3>{activeCamera.name}</h3>
          <div className="museum-card-subtitle">{activeCamera.type}</div>
          <p>{activeCamera.story}</p>
          <div style={{ marginTop: '0.5rem', fontSize: '0.76rem', color: '#94a3b8', lineHeight: '1.4' }}>
            <div><strong>Объектив:</strong> {activeCamera.lens}</div>
            <div><strong>Затвор:</strong> {activeCamera.shutter}</div>
            <div><strong>Пленка:</strong> {activeCamera.filmType}</div>
          </div>
          <div className="museum-card-note">
            <span>3D-файл (GLB):</span>
            <code>{activeCamera.modelFile}</code>
          </div>
        </div>
      )}

      {currentSceneKey === 'album' && (
        <div className="museum-card">
          <h3>«Афганский репортаж»</h3>
          <div className="museum-card-subtitle">Полный авторский архив 1984–1986 гг.</div>
          <p>
            Уникальная фотохроника войны, снятая на фотоаппараты ФЭД-2 и «Зенит».
            Все снимки отреставрированы и переданы в музейные фонды.
          </p>
          <button 
            style={{ 
              marginTop: '0.8rem', 
              width: '100%', 
              background: '#dc2626', 
              border: 'none', 
              color: '#fff', 
              padding: '0.5rem', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.82rem'
            }}
            onClick={() => {
              setCurrentPhotoIndex(0);
              setIsLightboxOpen(true);
            }}
          >
            <Images size={16} />
            Смотреть все 16 фото с описанием
          </button>
        </div>
      )}

      {/* 3. Нижняя панель переключения элементов в зале */}
      {currentSceneKey === 'medals' && (
        <div className="sub-selector-container">
          <div className="sub-selector-bar">
            {MEDALS_DATA.map((m, idx) => (
              <button
                key={m.id}
                className={`sub-pill-btn ${idx === selectedMedalIndex ? 'active' : ''}`}
                onClick={() => setSelectedMedalIndex(idx)}
              >
                {m.title.split(' ')[0]} {m.title.split(' ')[1] || ''}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentSceneKey === 'cameras' && (
        <div className="sub-selector-container">
          <div className="sub-selector-bar">
            {CAMERAS_DATA.map((c, idx) => (
              <button
                key={c.id}
                className={`sub-pill-btn ${idx === selectedCameraIndex ? 'active' : ''}`}
                onClick={() => setSelectedCameraIndex(idx)}
              >
                {c.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Бейдж локации и кнопка авто-вращения */}
      <div className="location-badge">
        <Compass size={15} color="#ef4444" />
        <span>{currentSceneDef.badge}</span>
        {currentSceneKey !== 'panorama360' && (
          <button 
            style={{ 
              background: autoRotate ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.1)', 
              border: '1px solid rgba(255,255,255,0.2)', 
              color: '#fff', 
              borderRadius: '4px', 
              padding: '2px 6px', 
              marginLeft: '6px', 
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.72rem'
            }}
            onClick={() => setAutoRotate(!autoRotate)}
            title="Переключить авто-вращение 3D-модели"
          >
            <RotateCw size={11} />
            {autoRotate ? 'Вращение: Вкл' : 'Пауза'}
          </button>
        )}
      </div>

      {/* 5. Инструкция по управлению */}
      <div className="controls-hint">
        {currentSceneKey === 'panorama360' ? (
          'Вращение: Потяните курсор / Касание • Приближение: Колесо мыши'
        ) : currentSceneKey === 'splat' ? (
          'Вращение: ЛКМ • Перемещение: ПКМ • Масштаб: Колесо мыши'
        ) : (
          'Вращение: Зажмите ЛКМ • Масштаб: Колесо мыши'
        )}
      </div>

      {/* 6. Кнопка источников (требование положения конкурса) */}
      <button className="sources-btn" onClick={() => setActiveContestModal('sources')}>
        <FileText size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
        Источники и архивы
      </button>

      {/* 7. Главный 3D Canvas */}
      <Canvas 
        camera={{ position: [0, 0.5, 3], fov: 45 }}
        shadows
      >
        <ambientLight intensity={0.85} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.8} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-4, 3, -2]} intensity={0.5} color="#93c5fd" />

        <Suspense fallback={
          <Html center>
            <div style={{ 
              color: '#f8fafc', 
              background: 'rgba(13, 15, 18, 0.92)', 
              padding: '0.85rem 1.4rem', 
              borderRadius: '8px', 
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
            }}>
              Загрузка 3D-экспоната...
            </div>
          </Html>
        }>
          {/* Панорама перевала в качестве фона */}
          <PanoramaSkybox url="./images/360_01.webp" />
          <CameraRig sceneKey={currentSceneKey} />

          {/* Зал 1: Медали и награды */}
          {currentSceneKey === 'medals' && (
            <SceneErrorBoundary resetKey={selectedMedalIndex}>
              <MedalsScene 
                onSelectSection={setActiveContestModal}
                selectedMedalIndex={selectedMedalIndex}
              />
              <OrbitControls 
                enablePan={false}
                minDistance={1.4}
                maxDistance={5.5}
                target={[0, 0, 0]}
                autoRotate={autoRotate}
                autoRotateSpeed={1.0}
              />
            </SceneErrorBoundary>
          )}

          {/* Зал 2: Фотоальбом «Афганский репортаж» */}
          {currentSceneKey === 'album' && (
            <SceneErrorBoundary resetKey="album">
              <AlbumScene 
                onOpenLightbox={(idx) => {
                  setCurrentPhotoIndex(idx);
                  setIsLightboxOpen(true);
                }}
                onSelectSection={setActiveContestModal}
              />
              <OrbitControls 
                enablePan={true}
                minDistance={1.8}
                maxDistance={7}
                target={[0, 0.2, 0]}
                autoRotate={autoRotate}
                autoRotateSpeed={0.5}
              />
            </SceneErrorBoundary>
          )}

          {/* Зал 3: Фотоаппаратура военкора */}
          {currentSceneKey === 'cameras' && (
            <SceneErrorBoundary resetKey={selectedCameraIndex}>
              <CamerasScene 
                onSelectSection={setActiveContestModal}
                selectedCameraIndex={selectedCameraIndex}
              />
              <OrbitControls 
                enablePan={false}
                minDistance={1.4}
                maxDistance={5.5}
                target={[0, 0.1, 0]}
                autoRotate={autoRotate}
                autoRotateSpeed={1.0}
              />
            </SceneErrorBoundary>
          )}

          {/* Зал 4: 360° Панорама перевала */}
          {currentSceneKey === 'panorama360' && (
            <SceneErrorBoundary resetKey="pano">
              <Panorama360Scene onSelectSection={setActiveContestModal} />
              <OrbitControls 
                enablePan={false}
                enableZoom={false}
                rotateSpeed={-0.6}
                minDistance={0.005}
                maxDistance={0.02}
                target={[0, 0, 0]}
              />
            </SceneErrorBoundary>
          )}

          {/* Зал 5: 3D Gaussian Splatting */}
          {currentSceneKey === 'splat' && (
            <SceneErrorBoundary resetKey="splat">
              <GaussianSplatScene onSelectSection={setActiveContestModal} />
              <OrbitControls 
                enablePan={true}
                minDistance={1}
                maxDistance={120}
                target={[0, 0, 0]}
                autoRotate={autoRotate}
                autoRotateSpeed={0.5}
              />
            </SceneErrorBoundary>
          )}

          {/* Зал 6: Полевой быт (3D корзина с костровыми дровами) */}
          {currentSceneKey === 'camp' && (
            <SceneErrorBoundary resetKey="camp">
              <CampfireScene onSelectSection={setActiveContestModal} />
              <OrbitControls 
                enablePan={false}
                minDistance={1.6}
                maxDistance={6}
                maxPolarAngle={Math.PI - 0.05}
                target={[0, 0.4, 0]}
                autoRotate={autoRotate}
                autoRotateSpeed={1.0}
              />
            </SceneErrorBoundary>
          )}

          <Preload all />
        </Suspense>
      </Canvas>

      {/* 8. Конкурсные модальные окна (биография, аудио, видео, память, источники) */}
      <ContestModal 
        activeModal={activeContestModal} 
        onClose={() => setActiveContestModal(null)} 
      />

      {/* 9. Полноэкранный просмотрщик фотографий альбома (Lightbox) */}
      <LightboxModal 
        photos={photos}
        currentIndex={currentPhotoIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onSelectIndex={setCurrentPhotoIndex}
      />
    </div>
  );
}

import { useState, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, Html, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { 
  ArrowLeft,
  RotateCw, 
  Compass,
  FileText,
  Images
} from 'lucide-react';

import { SCENES, type SceneKey, getSceneByHash } from './config/scenes';
import { MEDALS_DATA } from './config/medals';
import { CAMERAS_DATA } from './config/cameras';

import { TentScene } from './scenes/TentScene';
import { MedalsScene } from './scenes/MedalsScene';
import { AlbumScene } from './scenes/AlbumScene';
import { CamerasScene } from './scenes/CamerasScene';
import { Panorama360Scene } from './scenes/Panorama360Scene';
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

  const [autoRotate, setAutoRotate] = useState<boolean>(false);

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
      {/* 1. Верхняя навигационная панель выставки */}
      <div className="header-overlay">
        {currentSceneKey === 'tent' ? (
          <>
            <div className="header-badge">★ 350-й гв. ПДП • Полевой штаб</div>
            <h1>Алексей Козлов: воин и фотолетописец</h1>
            <p className="header-desc">
              Интерактивная 3D-палатка военкора. Осмотрите предметы на столе и у входа, чтобы перейти в выставочные залы.
            </p>
          </>
        ) : (
          <div className="subscene-header-nav">
            <button 
              className="back-to-tent-btn" 
              onClick={() => handleSelectScene('tent')}
              title="Вернуться в штабную палатку"
            >
              <ArrowLeft size={16} />
              <span>← В штабную палатку</span>
            </button>
            <div className="subscene-title-wrap">
              <h2>{currentSceneDef.title}</h2>
              <p>{currentSceneDef.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Правая музейная карточка экспоната */}
      {currentSceneKey === 'medals' && (
        <div className="museum-card">
          <div className="museum-card-tag">Наградной формуляр</div>
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
          <div className="museum-card-tag">Фотоаппаратура военкора</div>
          <h3>{activeCamera.name}</h3>
          <div className="museum-card-subtitle">{activeCamera.type}</div>
          <p>{activeCamera.story}</p>
          <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.4' }}>
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
          <div className="museum-card-tag">Архивный фотоальбом</div>
          <h3>«Афганский репортаж»</h3>
          <div className="museum-card-subtitle">Полный авторский архив 1984–1986 гг.</div>
          <p>
            Уникальная фотохроника войны, снятая на фотоаппараты ФЭД-2 и «Зенит».
            Все снимки отреставрированы и переданы в музейные фонды.
          </p>
          <button 
            className="album-open-all-btn"
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
        <Compass size={15} color="#dc2626" />
        <span>{currentSceneDef.badge}</span>
        {currentSceneKey !== 'panorama360' && (
          <button 
            className="autorotate-toggle-btn"
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
        ) : currentSceneKey === 'tent' ? (
          'Осмотр палатки: Зажмите ЛКМ • Масштаб: Колесо мыши • Кликните по предмету для перехода'
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
        camera={{ position: [0, 1.2, 2.5], fov: 48 }}
        shadows
      >
        <ambientLight intensity={0.7} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.6} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-4, 3, -2]} intensity={0.4} color="#93c5fd" />

        <Suspense fallback={
          <Html center>
            <div className="canvas-loader-box">
              Загрузка 3D-экспоната...
            </div>
          </Html>
        }>
          {/* Панорама перевала Саланг в качестве фона */}
          <PanoramaSkybox url="./images/360_01.webp" />
          <CameraRig sceneKey={currentSceneKey} />

          {/* Зал 0: Полевая палатка военкора (Центральный интерактивный штаб) */}
          {currentSceneKey === 'tent' && (
            <SceneErrorBoundary resetKey="tent">
              <TentScene 
                onNavigate={handleSelectScene}
                onSelectSection={setActiveContestModal}
                onOpenAlbum={() => {
                  setCurrentPhotoIndex(0);
                  setIsLightboxOpen(true);
                }}
                hidden={isAnyModalOpen}
              />
              <OrbitControls 
                enablePan={false}
                minDistance={1.4}
                maxDistance={4.5}
                maxPolarAngle={Math.PI / 2 + 0.05}
                minPolarAngle={Math.PI / 6}
                target={[0, 0.85, 0.4]}
                autoRotate={autoRotate}
                autoRotateSpeed={0.3}
              />
            </SceneErrorBoundary>
          )}

          {/* Зал 1: Медали и награды */}
          {currentSceneKey === 'medals' && (
            <SceneErrorBoundary resetKey={selectedMedalIndex}>
              <MedalsScene 
                onSelectSection={setActiveContestModal}
                selectedMedalIndex={selectedMedalIndex}
                hidden={isAnyModalOpen}
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
                hidden={isAnyModalOpen}
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
                hidden={isAnyModalOpen}
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
              <Panorama360Scene 
                onSelectSection={setActiveContestModal} 
                hidden={isAnyModalOpen}
              />
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

          {/* Зал 5: Полевой быт (3D корзина с костровыми дровами) */}
          {currentSceneKey === 'camp' && (
            <SceneErrorBoundary resetKey="camp">
              <CampfireScene 
                onSelectSection={setActiveContestModal} 
                hidden={isAnyModalOpen}
              />
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

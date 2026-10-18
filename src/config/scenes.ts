export type SceneKey = 'medals' | 'album' | 'cameras' | 'panorama360' | 'splat' | 'camp';

export interface SceneDefinition {
  key: SceneKey;
  hash: string;
  title: string;
  shortTitle: string;
  iconName: string;
  badge: string;
  description: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  fov: number;
}

export const SCENES: SceneDefinition[] = [
  {
    key: 'medals',
    hash: 'medals',
    title: 'Награды и знаки отличия',
    shortTitle: 'Награды',
    iconName: 'Award',
    badge: '3D Экспозиция',
    description: 'Интерактивная 3D-витрина боевых медалей и знаков доблести А. Р. Козлова',
    cameraPosition: [0, 0.4, 2.8],
    cameraTarget: [0, 0, 0],
    fov: 40
  },
  {
    key: 'album',
    hash: 'album',
    title: 'Альбом «Афганский репортаж»',
    shortTitle: 'Фотоальбом',
    iconName: 'Images',
    badge: '16 архивных фото',
    description: 'Полный авторский фотоальбом военкора 350-го полка ВДВ (1984–1986 гг.)',
    cameraPosition: [0, 0.6, 3.2],
    cameraTarget: [0, 0.2, 0],
    fov: 45
  },
  {
    key: 'cameras',
    hash: 'cameras',
    title: 'Фотоаппаратура военкора',
    shortTitle: 'Фотокамеры',
    iconName: 'Camera',
    badge: '3D Арсенал',
    description: 'ФЭД-2, «Зенит», «Смена-8М» — боевые камеры, запечатлевшие войну',
    cameraPosition: [0, 0.5, 2.6],
    cameraTarget: [0, 0.1, 0],
    fov: 42
  },
  {
    key: 'panorama360',
    hash: 'pano',
    title: '360° Панорама перевала Саланг',
    shortTitle: '360° Панорама',
    iconName: 'Mountain',
    badge: 'Гиндукуш',
    description: 'Сферическая панорама горного ущелья и стратегической трассы Саланг',
    cameraPosition: [0, 0, 0.01],
    cameraTarget: [0, 0, 0],
    fov: 65
  },
  {
    key: 'splat',
    hash: 'splat',
    title: '3D Gaussian Splatting',
    shortTitle: '3D Скан',
    iconName: 'Sparkles',
    badge: 'Объёмный скан',
    description: 'Трёхмерный фотограмметрический скан местности (700 000 точек)',
    cameraPosition: [0, 3, 16],
    cameraTarget: [0, 0, 0],
    fov: 50
  },
  {
    key: 'camp',
    hash: 'camp',
    title: 'Полевой лагерь десантников',
    shortTitle: 'Полевой быт',
    iconName: 'Box',
    badge: '3D Экспонат',
    description: '3D-модель полевого быта заставы и костровых поленьев',
    cameraPosition: [0, 0.5, 3.4],
    cameraTarget: [0, 0.4, 0],
    fov: 45
  }
];

export function getSceneByHash(hash: string): SceneDefinition {
  const cleanHash = hash.replace(/^#\/?/, '').toLowerCase();
  const found = SCENES.find((s) => s.hash === cleanHash || s.key === cleanHash);
  return found || SCENES[0];
}

export type SceneKey = 'tent' | 'medals' | 'album' | 'cameras' | 'panorama360';

export interface SceneDefinition {
  key: SceneKey;
  hash: string;
  title: string;
  shortTitle: string;
  badge: string;
  description: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  fov: number;
}

export const SCENES: SceneDefinition[] = [
  {
    key: 'tent',
    hash: 'tent',
    title: 'Полевая палатка военкора',
    shortTitle: 'Штабная палатка',
    badge: 'Штаб 350-го гв. ПДП',
    description: 'Интерактивная штабная палатка: выберите предмет на столе для перехода в зал',
    cameraPosition: [0, 1.45, 3.2],
    cameraTarget: [0, 0.85, 0.4],
    fov: 46
  },
  {
    key: 'medals',
    hash: 'medals',
    title: 'Награды и боевой путь',
    shortTitle: 'Награды',
    badge: '3D Экспозиция наград',
    description: 'Боевые медали и знаки воинской доблести гвардии рядового А. Р. Козлова',
    cameraPosition: [0, 0.35, 2.4],
    cameraTarget: [0, 0, 0],
    fov: 38
  },
  {
    key: 'album',
    hash: 'album',
    title: 'Альбом «Афганский репортаж»',
    shortTitle: 'Фотоальбом',
    badge: '16 авторских фото',
    description: 'Полный авторский фотоальбом военкора 4-й роты (1984–1986 гг.)',
    cameraPosition: [0, 0.5, 3.2],
    cameraTarget: [0, 0.15, 0],
    fov: 44
  },
  {
    key: 'cameras',
    hash: 'cameras',
    title: 'Фотоаппаратура военкора',
    shortTitle: 'Фотокамеры',
    badge: 'ФЭД-2, Зенит, Смена-8М',
    description: 'Боевая фототехника, прошедшая десантные рейды и высокогорные операции',
    cameraPosition: [0, 0.35, 2.4],
    cameraTarget: [0, 0, 0],
    fov: 38
  },
  {
    key: 'panorama360',
    hash: 'pano',
    title: '360° Панорама перевала Саланг',
    shortTitle: '360° Саланг',
    badge: 'Гиндукуш • Перевал',
    description: 'Сферический круговой обзор стратегической трассы и горного перевала Саланг',
    cameraPosition: [0, 0, 0.01],
    cameraTarget: [0, 0, 0],
    fov: 65
  }
];

export function getSceneByHash(hash: string): SceneDefinition {
  const cleanHash = hash.replace(/^#\/?/, '').toLowerCase();
  const found = SCENES.find((s) => s.hash === cleanHash || s.key === cleanHash);
  return found || SCENES[0];
}

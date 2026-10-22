export interface MagazineItem {
  id: string;
  title: string;
  publication: string;
  date: string;
  page?: string;
  description: string;
  src: string;
  width: number;
  height: number;
  aspect: number;
}

export const MAGAZINES_DATA: MagazineItem[] = [
  {
    id: 'spetsnaz-cover',
    title: 'Журнал «Спецназ» — Обложка',
    publication: 'Журнал «Спецназ» (№ 2, 2009)',
    date: 'Февраль 2009 г.',
    page: 'Обложка',
    description: 'Специальный выпуск журнала «Спецназ», приуроченный к 20-летию вывода ограниченного контингента советских войск из Афганистана.',
    src: './models/magazines/Спецназ 2009-02 обложка.jpg',
    width: 2364,
    height: 3108,
    aspect: 0.761
  },
  {
    id: 'spetsnaz-article',
    title: 'Журнал «Спецназ» — Статья «Война через объектив»',
    publication: 'Журнал «Спецназ» (№ 2, 2009)',
    date: 'Февраль 2009 г.',
    page: 'Стр. 25',
    description: 'Очерк о фронтовом фотолетописце 350-го гвардейского парашютно-десантного полка рядовом Алексее Козлове и истории создания его знаменитых кадров.',
    src: './models/magazines/Спецназ 2009-02 статья стр. 25.jpg',
    width: 2397,
    height: 3123,
    aspect: 0.768
  },
  {
    id: 'exhibition-poster',
    title: 'Афиша выставки «Мгновения войны»',
    publication: 'Персональная фотовыставка Алексея Козлова',
    date: 'Мемориальный архив',
    description: 'Афиша персональной выставки авторских фронтовых фоторабот Алексея Козлова, запечатлевшего солдатские будни, перевалы и боевые рейды.',
    src: './models/magazines/Выставка Мгновения войны.jpg',
    width: 1402,
    height: 2156,
    aspect: 0.650
  },
  {
    id: 'gp-title',
    title: 'Газета «Голос Приграничья» — Титульная полоса',
    publication: 'Газета «Голос Приграничья» (№ 12)',
    date: '15 февраля 2014 г.',
    page: 'Титул',
    description: 'Праздничный выпуск газеты к 25-й годовщине вывода советских войск из Республики Афганистан.',
    src: './models/magazines/ГП 2014-02-15 титул.jpg',
    width: 3328,
    height: 3435,
    aspect: 0.969
  },
  {
    id: 'gp-article',
    title: 'Газета «Голос Приграничья» — Статья (стр. 6)',
    publication: 'Газета «Голос Приграничья» (№ 12)',
    date: '15 февраля 2014 г.',
    page: 'Стр. 6',
    description: 'Биографическая статья и воспоминания сослуживцев о воине-интернационалисте и военкоре Алексее Козлове с публикацией архивных фотографий.',
    src: './models/magazines/ГП 2014-02-15 статья стр. 6.jpg',
    width: 2626,
    height: 3791,
    aspect: 0.693
  }
];

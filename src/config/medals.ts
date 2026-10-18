export interface MedalItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'ussr_battle' | 'dra' | 'guard' | 'airborne' | 'anniversary';
  citation: string;
  year: string;
  modelFile: string;
  ribbonColors: string[];
  metalColor: string;
}

export const MEDALS_DATA: MedalItem[] = [
  {
    id: 'otvaga',
    title: 'Медаль «За отвагу» (СССР)',
    subtitle: 'Высшая боевая солдатская награда',
    type: 'ussr_battle',
    year: '1985',
    citation: 'Вручена за героизм в бою на Гардезской дороге (лето 1985 г.). Под огнем душманов Алексей Козлов спасал раненых из горящей колонны наливников, а затем вчетвером с товарищами держал круговую оборону на открытой трассе до прилета вертолетов огневой поддержки.',
    modelFile: './models/medals/medal_otvaga.glb',
    ribbonColors: ['#94a3b8', '#1e3a8a', '#94a3b8'],
    metalColor: '#e2e8f0'
  },
  {
    id: 'afghan_people',
    title: '«От благодарного афганского народа»',
    subtitle: 'Государственная медаль ДРА',
    type: 'dra',
    year: '1986',
    citation: 'Учреждена Демократической Республикой Афганистан. Вручалась советским воинам-интернационалистам за помощь населению кишлаков, доставку продовольствия и медикаментов, охрану перевалов и дорог.',
    modelFile: './models/medals/medal_afghan_people.glb',
    ribbonColors: ['#047857', '#dc2626', '#000000'],
    metalColor: '#d97706'
  },
  {
    id: 'gvardia',
    title: 'Нагрудный знак «Гвардия»',
    subtitle: 'Знак гвардейской десантной доблести',
    type: 'guard',
    year: '1984',
    citation: 'Знак принадлежности к прославленному 350-му гвардейскому парашютно-десантному Краснознаменному ордена Суворова полку («полтинник») 103-й Витебской гвардейской дивизии ВДВ.',
    modelFile: './models/medals/badge_gvardia.glb',
    ribbonColors: ['#dc2626', '#ffffff'],
    metalColor: '#fbbf24'
  },
  {
    id: 'paratrooper',
    title: 'Знак «Парашютист-отличник»',
    subtitle: 'Квалификационный знак ВДВ',
    type: 'airborne',
    year: '1984',
    citation: 'Вручен за освоение парашютного спорта до призыва в Гомеле и образцовые прыжки с парашютом в учебном центре ВДВ в Фергане с подвеской за количество прыжков.',
    modelFile: './models/medals/badge_paratrooper.glb',
    ribbonColors: ['#0284c7', '#ffffff'],
    metalColor: '#cbd5e1'
  },
  {
    id: 'internationalist',
    title: 'Знак «Воину-интернационалисту»',
    subtitle: 'Президиум Верховного Совета СССР',
    type: 'ussr_battle',
    year: '1988',
    citation: 'Вручен вместе с Грамотой Президиума Верховного Совета СССР всем военнослужащим Ограниченного контингента советских войск, честно и до конца выполнившим интернациональный долг.',
    modelFile: './models/medals/badge_internationalist.glb',
    ribbonColors: ['#dc2626', '#fbbf24'],
    metalColor: '#fbbf24'
  },
  {
    id: 'anniversary',
    title: 'Юбилейные медали вывода войск',
    subtitle: 'В память 10, 20, 25, 30 и 35-летия',
    type: 'anniversary',
    year: '1999–2024',
    citation: 'Комплект памятных медалей Республики Беларусь и ветеранских организаций воинов-интернационалистов. Символ нерушимого десантного братства и памяти о погибших однополчанах.',
    modelFile: './models/medals/medal_anniversary.glb',
    ribbonColors: ['#16a34a', '#dc2626', '#f59e0b'],
    metalColor: '#f59e0b'
  }
];

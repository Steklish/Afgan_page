import { X, BookOpen, Volume2, MapPin, FileText } from 'lucide-react';

export type SectionKey = 'biography' | 'audio' | 'memory' | 'sources';

interface ContestModalProps {
  activeModal: SectionKey | null;
  onClose: () => void;
}

export function ContestModal({ activeModal, onClose }: ContestModalProps) {
  if (!activeModal) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {activeModal === 'biography' && <BookOpen size={20} color="#ef4444" />}
            {activeModal === 'audio' && <Volume2 size={20} color="#ef4444" />}
            {activeModal === 'memory' && <MapPin size={20} color="#ef4444" />}
            {activeModal === 'sources' && <FileText size={20} color="#ef4444" />}
            <h2>
              {activeModal === 'biography' && 'Биографический портрет и боевой путь'}
              {activeModal === 'audio' && 'Голоса эпохи: воспоминания и поэзия'}
              {activeModal === 'memory' && 'Увековечение памяти о земляке'}
              {activeModal === 'sources' && 'Использованные источники и архивные фонды'}
            </h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Закрыть">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {activeModal === 'biography' && (
            <div>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <img
                  src="./images/hero_photo.png"
                  alt="Алексей Рэмович Козлов"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                  style={{
                    width: '150px',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.6)'
                  }}
                />
                <div style={{ flex: '1 1 240px' }}>
                  <p>
                    <strong>Козлов Алексей Рэмович</strong> (род. 18 ноября 1964 г., Гомель, Новобелица) —
                    гвардии рядовой, пулеметчик 4-й парашютно-десантной роты 350-го гвардейского
                    парашютно-десантного Краснознаменного ордена Суворова полка 103-й Витебской гвардейской
                    дивизии ВДВ («полтинник»).
                  </p>
                  <p style={{ marginTop: '0.65rem' }}>
                    С октября 1984 по апрель 1986 гг. выполнял интернациональный долг в Афганистане.
                    Участвовал в сложнейших десантных операциях на перевалах Гиндукуша и в Панджшере.
                    За мужество и спасение раненых в бою на Гардезской дороге награжден медалью «За отвагу».
                  </p>
                  <p style={{ marginTop: '0.65rem' }}>
                    Является летописцем первого состава легендарного ансамбля ВДВ «Голубые береты»
                    (с ноября 1985 года).
                  </p>
                </div>
              </div>
              <div className="modal-note">
                Архивная фотография: <code>public/images/hero_photo.png</code>.
              </div>
            </div>
          )}

          {activeModal === 'audio' && (
            <div>
              <p>
                Аудиозапись воспоминаний сослуживцев, солдатских песен у костра и первых композиций
                легендарного ансамбля «Голубые береты» времён Афганской войны (1985–1986 гг.).
              </p>
              <audio className="modal-media" controls src="./audio/voice_archive.mp3">
                Ваш браузер не поддерживает элемент audio.
              </audio>
              <p className="modal-note">
                Подсказка: разместите аудиозапись в <code>public/audio/voice_archive.mp3</code>.
              </p>
            </div>
          )}

          {activeModal === 'memory' && (
            <div>
              <p>
                <strong>Память в граните, делах и фотоснимках:</strong>
              </p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.6rem', lineHeight: '1.75' }}>
                <li>
                  <strong>Музей истории печати и фотографии Гомеля:</strong> персональная выставка
                  «Афганский репортаж» к 35-летию вывода войск (февраль 2024 г.);
                </li>
                <li>
                  <strong>Центральный музей Вооруженных Сил РФ (Москва):</strong> авторские негативы и снимки
                  А. Р. Козлова приняты на постоянное хранение в государственные фонды;
                </li>
                <li>
                  <strong>Музей боевой славы СШ № 2 им. Г. М. Склезнёва (Гомель):</strong> постоянная
                  экспозиция «Мгновения войны»;
                </li>
                <li>
                  <strong>Уроки мужества и диалоговые площадки:</strong> ежегодные памятные встречи с
                  учащимися Гомельского государственного областного лицея (ГГОЛ).
                </li>
              </ul>
            </div>
          )}

          {activeModal === 'sources' && (
            <div>
              <p>Список документальных источников исследования (п. 5.3 условий конкурса):</p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.6rem', fontSize: '0.88rem', lineHeight: '1.75' }}>
                <li>Личный фотоархив и негативы воина-интернационалиста А. Р. Козлова (сканирование и обработка: Евгений Козлов);</li>
                <li>Материалы музейной экспозиции «Афганский репортаж» Музея истории печати и фотографии Гомеля (2024 г.);</li>
                <li>Фонды музея боевой и трудовой славы СШ № 2 им. Г. М. Склезнёва г. Гомеля;</li>
                <li>Публикации газеты «Гомельская праўда» (выпуски 2014 г. и 2024 г., материалы Т. Гречко, Д. Радзивона);</li>
                <li>Журнал специального назначения «Спецназ» (статья «С калашниковым на плече и дзержинским на груди»);</li>
                <li>Материалы архива 350-го гвардейского парашютно-десантного полка 103-й гв. ВДД.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

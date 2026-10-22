import { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Calendar, 
  FileText, 
  BookOpen
} from 'lucide-react';
import { MAGAZINES_DATA, type MagazineItem } from '../config/magazines';

interface MagazineModalProps {
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export function MagazineModal({
  isOpen,
  currentIndex,
  onClose,
  onSelectIndex
}: MagazineModalProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [panPos, setPanPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Сброс зума при переключении страницы или закрытии
  useEffect(() => {
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  }, [currentIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onSelectIndex((currentIndex - 1 + MAGAZINES_DATA.length) % MAGAZINES_DATA.length);
      }
      if (e.key === 'ArrowRight') {
        onSelectIndex((currentIndex + 1) % MAGAZINES_DATA.length);
      }
      if (e.key === '+' || e.key === '=') {
        setZoomLevel((prev) => Math.min(prev + 0.25, 3));
      }
      if (e.key === '-') {
        setZoomLevel((prev) => Math.max(prev - 0.25, 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, onClose, onSelectIndex]);

  if (!isOpen) return null;

  const current: MagazineItem = MAGAZINES_DATA[currentIndex] || MAGAZINES_DATA[0];

  const handlePrev = () => {
    onSelectIndex((currentIndex - 1 + MAGAZINES_DATA.length) % MAGAZINES_DATA.length);
  };

  const handleNext = () => {
    onSelectIndex((currentIndex + 1) % MAGAZINES_DATA.length);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.3, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.3, 1);
      if (next === 1) setPanPos({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPos.x, y: e.clientY - panPos.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanPos({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="lightbox-backdrop magazine-modal-backdrop" onClick={onClose}>
      <div 
        className="lightbox-container magazine-modal-container" 
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Верхняя панель заголовка */}
        <div className="lightbox-header magazine-header">
          <div className="lightbox-title-block">
            <div className="magazine-badge">
              <BookOpen size={13} />
              <span>Архивная фронтовая печать</span>
            </div>
            <h3>{current.title}</h3>
            <div className="lightbox-meta">
              <span><Calendar size={13} /> {current.date}</span>
              <span><FileText size={13} /> {current.publication}</span>
              {current.page && <span className="magazine-page-pill">{current.page}</span>}
              <span className="lightbox-counter">{currentIndex + 1} / {MAGAZINES_DATA.length}</span>
            </div>
          </div>

          {/* Инструменты масштабирования и закрытия */}
          <div className="magazine-controls">
            <div className="magazine-zoom-group">
              <button 
                type="button" 
                className="zoom-btn" 
                onClick={handleZoomIn} 
                title="Увеличить (+)"
                disabled={zoomLevel >= 3}
              >
                <ZoomIn size={16} />
              </button>
              <button 
                type="button" 
                className="zoom-btn" 
                onClick={handleZoomOut} 
                title="Уменьшить (-)"
                disabled={zoomLevel <= 1}
              >
                <ZoomOut size={16} />
              </button>
              {zoomLevel > 1 && (
                <button 
                  type="button" 
                  className="zoom-btn reset" 
                  onClick={handleResetZoom} 
                  title="Сбросить масштаб"
                >
                  <RotateCcw size={15} />
                  <span>{Math.round(zoomLevel * 100)}%</span>
                </button>
              )}
            </div>

            <button className="close-btn" onClick={onClose} aria-label="Закрыть (Esc)">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Основная область просмотра */}
        <div className="lightbox-content magazine-viewer-content">
          <button 
            className="lightbox-nav-btn prev" 
            onClick={handlePrev} 
            aria-label="Предыдущая публикация"
          >
            <ChevronLeft size={32} />
          </button>

          <div 
            className={`lightbox-image-wrapper magazine-image-wrapper ${zoomLevel > 1 ? 'zoomed' : ''}`}
            onMouseDown={handleMouseDown}
            style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            <div 
              className="magazine-transform-container"
              style={{
                transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${zoomLevel})`,
                transition: isDragging ? 'none' : 'transform 0.18s ease-out'
              }}
            >
              <img 
                src={current.src} 
                alt={current.title} 
                className="lightbox-image magazine-image" 
                draggable={false}
              />
            </div>
            {zoomLevel <= 1 && (
              <p className="lightbox-caption magazine-caption">
                <strong>{current.publication}:</strong> {current.description}
              </p>
            )}
          </div>

          <button 
            className="lightbox-nav-btn next" 
            onClick={handleNext} 
            aria-label="Следующая публикация"
          >
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Лента миниатюр внизу */}
        <div className="lightbox-thumbs magazine-thumbs">
          {MAGAZINES_DATA.map((item, idx) => (
            <button
              key={item.id}
              className={`lightbox-thumb-btn magazine-thumb-btn ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => onSelectIndex(idx)}
              title={item.title}
            >
              <img src={item.src} alt={item.title} />
              <span className="magazine-thumb-label">{item.page || `№ ${idx + 1}`}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

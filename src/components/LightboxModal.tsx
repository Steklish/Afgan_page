import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';

export interface AlbumPhoto {
  id: number;
  title: string;
  year: string;
  location: string;
  description: string;
  src: string;
}

interface LightboxModalProps {
  photos: AlbumPhoto[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export function LightboxModal({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onSelectIndex
}: LightboxModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onSelectIndex((currentIndex - 1 + photos.length) % photos.length);
      }
      if (e.key === 'ArrowRight') {
        onSelectIndex((currentIndex + 1) % photos.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photos.length, onClose, onSelectIndex]);

  if (!isOpen || photos.length === 0) return null;

  const current = photos[currentIndex];

  const handlePrev = () => {
    onSelectIndex((currentIndex - 1 + photos.length) % photos.length);
  };

  const handleNext = () => {
    onSelectIndex((currentIndex + 1) % photos.length);
  };

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="lightbox-header">
          <div className="lightbox-title-block">
            <h3>{current.title}</h3>
            <div className="lightbox-meta">
              <span><Calendar size={13} /> {current.year} г.</span>
              <span><MapPin size={13} /> {current.location}</span>
              <span className="lightbox-counter">{currentIndex + 1} / {photos.length}</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Закрыть">
            <X size={24} />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="lightbox-content">
          <button className="lightbox-nav-btn prev" onClick={handlePrev} aria-label="Предыдущее фото">
            <ChevronLeft size={32} />
          </button>

          <div className="lightbox-image-wrapper">
            <img src={current.src} alt={current.title} className="lightbox-image" />
            <p className="lightbox-caption">{current.description}</p>
          </div>

          <button className="lightbox-nav-btn next" onClick={handleNext} aria-label="Следующее фото">
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Thumbnail Strip */}
        <div className="lightbox-thumbs">
          {photos.map((p, idx) => (
            <button
              key={p.id}
              className={`lightbox-thumb-btn ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => onSelectIndex(idx)}
              title={p.title}
            >
              <img src={p.src} alt={p.title} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

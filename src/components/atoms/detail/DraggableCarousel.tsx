import React, { useRef, useState } from 'react';
import s from './DraggableCarousel.module.scss';

interface CarouselItem {
  id: string | number;
  videoUrl: string;
  description: string;
}

interface DraggableCarouselProps {
  items: CarouselItem[];
}

export default function DraggableCarousel({ items }: DraggableCarouselProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      className={`${s['carousel-container']} ${isDragging ? s['active'] : ''}`}
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {items.map((item) => (
        <div key={item.id} className={s['carousel-item']}>
          <div className={s['video-wrap']}>
            <video
              src={item.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className={s['video-element']}
              draggable={false} // 드래그 시 텍스트/요소 선택 방지
            />
          </div>
          <div className={s['description']}>{item.description}</div>
        </div>
      ))}
    </div>
  );
}

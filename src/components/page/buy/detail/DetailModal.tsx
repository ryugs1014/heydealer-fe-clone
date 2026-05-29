// src/components/page/buy/detail/DetailModal.tsx
'use client';

import React, { useEffect, useState } from 'react';
import s from './DetailModal.module.scss';
import Image from 'next/image';

import Close from '/public/svg/mobile-menu-close.svg';

interface Section {
  id: string;
  title: string;
  images: string[];
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
  allImages: string[];
  onImageClick: (index: number) => void;
  initialScrollId?: string | null;
}

export default function DetailModal({
  isOpen,
  onClose,
  sections,
  allImages,
  onImageClick,
  initialScrollId,
}: DetailModalProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isFading, setIsFading] = useState(false);

  // ⭐ 1. 열림/닫힘 애니메이션 상태 관리
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isOpen) {
      setShouldRender(true);
      // DOM이 렌더링된 직후 클래스를 추가하기 위해 아주 짧은 지연시간을 줍니다.
      timeoutId = setTimeout(() => setIsFading(true), 10);
    } else {
      setIsFading(false);
      // CSS 트랜지션 시간(300ms)이 끝난 후 DOM에서 완전히 제거합니다.
      timeoutId = setTimeout(() => setShouldRender(false), 300);
    }

    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  useEffect(() => {
    // ⭐ isFading이 완료되어 화면에 보여질 때 스크롤 및 body 설정
    if (isOpen && shouldRender) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      if (initialScrollId) {
        setActiveId(initialScrollId);
        setTimeout(() => {
          const target = document.getElementById(initialScrollId);
          if (target) {
            target.scrollIntoView({ behavior: 'auto', block: 'start' });
          }
        }, 0);
      } else if (sections.length > 0) {
        setActiveId(sections[0].id);
      }

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, shouldRender, initialScrollId, sections]);

  useEffect(() => {
    // DOM이 없으면 옵저버 실행 안 함
    if (!shouldRender) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -50% 0px',
      },
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [shouldRender, sections]);

  if (!shouldRender) return null;

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`${s['modal-container']} ${isFading ? s['fade-in'] : ''}`}>
      {' '}
      <div className={s['modal-header']}>
        <div className={s['header-gnb']}>
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={activeId === sec.id ? s['active'] : ''}
            >
              <p>{sec.title.split(' ')[0]}</p>
              <span />
            </button>
          ))}
        </div>

        <button className={s['close-button']} onClick={onClose}>
          <div className={s['svg-box']}>
            <Close width="100%" height="100%" viewBox="0 0 24 24" />
          </div>
        </button>
      </div>
      <div className={s['content-container']}>
        {sections.map((section) => (
          <div className={s['content-list']} key={section.id} id={section.id}>
            {section.images.map((imgSrc) => {
              const globalIdx = allImages.indexOf(imgSrc);
              return (
                <div
                  className={`${s['img-wrap']} img-wrap`}
                  key={imgSrc}
                  onClick={() => onImageClick(globalIdx)}
                >
                  <Image src={imgSrc} alt="차량 스냅" fill sizes="100vw" />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

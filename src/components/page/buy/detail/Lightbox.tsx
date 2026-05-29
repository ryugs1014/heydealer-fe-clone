// src/components/page/buy/detail/Lightbox.tsx
'use client';

import React, { useState, useEffect } from 'react';
import s from './Lightbox.module.scss';
import Image from 'next/image';

import Close from '/public/svg/mobile-menu-close.svg';
import Arrow from '/public/svg/arrow-left-big.svg';

interface LightboxProps {
  index: number | null;
  images: string[];
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export default function Lightbox({
  index,
  images,
  onClose,
  onNavigate,
}: LightboxProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const [cachedIndex, setCachedIndex] = useState<number>(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // index가 null이 아니면(열림)
    if (index !== null) {
      setCachedIndex(index);
      setShouldRender(true);
      timeoutId = setTimeout(() => setIsFading(true), 10);
    } else {
      // index가 null이면(닫힘)
      setIsFading(false);
      timeoutId = setTimeout(() => setShouldRender(false), 300); // CSS transition 시간(300ms)과 동일하게 맞춤
    }

    return () => clearTimeout(timeoutId);
  }, [index]);

  if (!shouldRender) return null;

  return (
    <div className={`${s['modal-container']} ${isFading ? s['fade-in'] : ''}`}>
      <div className={s['modal-header']}>
        <div className={s['header-page']}>
          {cachedIndex + 1}/{images.length}{' '}
        </div>

        <button className={s['close-button']} onClick={onClose}>
          <div className={s['svg-box']}>
            <Close width="100%" height="100%" viewBox="0 0 24 24" />
          </div>
        </button>
      </div>

      <div className={s['content-container']}>
        <button className={`${s['arrow']} `} onClick={() => onNavigate('prev')}>
          <div className={s['svg-box']}>
            <Arrow width="100%" height="100%" viewBox="0 0 24 24" />
          </div>
        </button>

        <div className={`${s['img-wrap']} img-wrap`}>
          <Image
            src={images[cachedIndex]}
            alt="확대 사진"
            fill
            sizes="100vw"
          />{' '}
        </div>

        <button
          className={`${s['arrow']} ${s['right']}`}
          onClick={() => onNavigate('next')}
        >
          <div className={s['svg-box']}>
            <Arrow width="100%" height="100%" viewBox="0 0 24 24" />
          </div>
        </button>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import s from './AdList.module.scss';

export default function AdCardList() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isHovered) {
      setIsVideoReady(false);
    }
  }, [isHovered]);

  useEffect(() => {
    if (isHovered && isVideoReady && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.error('비디오 재생 실패:', err);
      });
    }
  }, [isHovered, isVideoReady]);

  return (
    <div className={s['ad-list-container']}>
      <div className={s['grid-layout']}>
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`${s['overflow-box']} ${s['card-box']}`}
        >
          <div className={s['text-box']}>
            모든 차
            <br />
            1년 무료 보증
          </div>

          <div
            className={`${s['img-wrap']} ${s['card-img']}`}
            style={{ display: isHovered && isVideoReady ? 'none' : 'block' }}
          >
            <Image src={'/img/ad-card.png'} alt="Image" fill priority />

            <div className={s['img-gradient']} />
          </div>

          {isHovered && (
            <div className={s['video-wrap']}>
              <video
                ref={videoRef}
                src={'/video/ad-card.mp4'}
                loop
                muted
                playsInline
                className={s['video-element']}
                onLoadedData={() => setIsVideoReady(true)}
                style={{ display: isVideoReady ? 'block' : 'none' }}
              />

              <div className={s['img-gradient']} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

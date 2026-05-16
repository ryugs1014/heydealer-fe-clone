'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import s from './AdList.module.scss';
import AdCarLogo from '/public/svg/ad-car-logo.svg';

export default function AdList() {
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
          className={`${s['overflow-box']} ${s['car-box']}`}
        >
          <div className={s['svg-box']}>
            <AdCarLogo width="100%" height="100%" viewBox="0 0 121 51" />
          </div>

          <div
            className={s['img-wrap']}
            style={{ display: isHovered && isVideoReady ? 'none' : 'block' }}
          >
            <Image src={'/img/ad-car.png'} alt="Image" fill priority />
          </div>

          {isHovered && (
            <video
              ref={videoRef}
              src={'/video/ad-car.mp4'}
              loop
              muted
              playsInline
              className={s['video-element']}
              onLoadedData={() => setIsVideoReady(true)}
              style={{ display: isVideoReady ? 'block' : 'none' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

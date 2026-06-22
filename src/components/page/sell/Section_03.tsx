'use client';

import React from 'react';
import s from './Section_03.module.scss';

export default function Section_03() {
  return (
    <div className={s['section-container']}>
      <div className={s['section-wrap']}>
        <div className={s['text-wrap']}>
          <div className={s['text-top']}>
            <span className={s['text-top-header']}>
              <div>헤이딜러</div>
              <div className={s['svg-box']}>zero</div>
            </span>

            <span className={s['text-top-footer']}>출시</span>
          </div>

          <span className={s['text-bottom']}>
            감가제로 내차팔기, 헤이딜러가 시작합니다.
          </span>
        </div>

        <div className={s['video-container']}>
          <video
            src="/video/sell/desktop-section3.mp4"
            autoPlay
            muted
            loop
            playsInline
            className={s['video-element']}
          />
        </div>
      </div>
    </div>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import s from './StickyBanner.module.scss';
import QR from '/public/svg/total-info-qr.svg';
import React from 'react';

export default function StickyBanner() {
  const pathname = usePathname();

  if (pathname !== '/total-info') return null;

  return (
    <div className={s['sticky-banner-container']}>
      <div className={s['sticky-banner-wrap']}>
        <div className={s['content-wrap']}>
          <div className={s['text-wrap']}>
            <span className={s['main-text']}>
              휴대전화로 QR코드를 찍고 숨은이력을 확인해보세요. 🔍
            </span>
            <span className={s['sub-text']}>번호판만 입력하면 끝!</span>
          </div>
          <div className={s['svg-box']}>
            <QR width="100%" height="100%" viewBox="0 0 29 29" />
          </div>
        </div>
      </div>
    </div>
  );
}

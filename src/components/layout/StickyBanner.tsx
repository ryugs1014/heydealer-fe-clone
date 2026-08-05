'use client';

import { usePathname } from 'next/navigation';
import s from './StickyBanner.module.scss';
import QR from '/public/svg/total-info-qr.svg';
import React from 'react';

export default function StickyBanner() {
  const pathname = usePathname();

  if (pathname !== '/total-info' && pathname !== '/sell') return null;

  const textConfig = {
    '/total-info': {
      main: '휴대전화로 QR코드를 찍고 숨은이력을 확인해보세요. 🔍',
      sub: '번호판만 입력하면 끝!',
      mobile: '지금 번호판 입력하기',
    },
    '/sell': {
      main: '휴대전화로 QR코드를 찍고 내 차 견적을 받아보세요.',
      sub: '견적받기는 앱에서만 가능해요.',
      mobile: '앱 다운로드',
    },
  };

  const { main, sub, mobile } = textConfig[pathname];

  return (
    <div key={pathname} className={s['sticky-banner-container']}>
      <div className={s['sticky-banner-wrap']}>
        <div className={s['content-wrap']}>
          <div className={s['text-wrap']}>
            <span className={s['main-text']}>{main}</span>
            <span className={s['sub-text']}>{sub}</span>

            <div className={s['mobile-button']}>
              <span className={s['mobile-text']}>{mobile}</span>
            </div>
          </div>
          <div className={s['svg-box']}>
            <QR width="100%" height="100%" viewBox="0 0 29 29" />
          </div>
        </div>
      </div>
    </div>
  );
}

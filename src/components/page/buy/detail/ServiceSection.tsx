'use client';

import React from 'react';
import s from './ServiceSection.module.scss';

export default function ServiceSection() {
  return (
    <div className={s['service-section-wrapper']}>
      <div className={s['service-top']}>
        <div className={s['service-text']}>
          <div className={s['emoji-text']}>💭</div>
          <div className={s['main-text']}>서비스 개선 의견을 남겨주세요</div>
          <div className={s['sub-text']}>
            좋은 점, 아쉬운 점 모두 좋아요. <br />
            어떤 의견이든 귀기울여 듣겠습니다.
          </div>
        </div>

        <button className={s['service-button']}>의견 남기기</button>
      </div>

      <div className={s['service-bottom']}>
        <button className={s['ect-button']}>기타 정보</button>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import s from './Section_03.module.scss';

export default function Section_03() {
  return (
    <div className={s['section-content']}>
      <div className={s['content-wrap']}>
        <div className={s['text-wrap']}>
          헤이딜러로
          <br />
          견적 받아야 하는 이유
        </div>

        <ul className={s['text-list']}>
          <li>🙅‍️ 판매 권유 전화가 절대 없어요.</li>
          <li>🛻️ 탁송비가 무료예요.</li>
          <li>⏱️️ 24시간 내 말소완료를 보장해요.</li>
        </ul>
      </div>
    </div>
  );
}

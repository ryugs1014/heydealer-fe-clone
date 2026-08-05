'use client';

import React from 'react';
import s from './Section_02.module.scss';

export default function Section_02() {
  return (
    <div className={s['section-container']}>
      <div className={s['section-wrap']}>
        <span className={s['text-top']}>
          어렵고 불편하던 중고차 거래, <br />
          헤이딜러가 바꿔나갑니다.
        </span>
        <span className={s['text-bottom']}>
          모든 걸 세로로 보는 세상, <br />
          그에 맞는 새로운 기술로 <br /> <br className={s['mobile-br']} />
          <div className={s['slogan']}>중고차 세로고침</div>
        </span>
      </div>
    </div>
  );
}

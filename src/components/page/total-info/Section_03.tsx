'use client';

import React from 'react';
import s from './Section_03.module.scss';
import Container from '@/components/layout/Container';
export default function Section_03() {
  return (
    <div className={s['section-container']}>
      <Container size={'sm-min'}>
        <div className={s['section-wrap']}>
          <div className={s['text-container']}>
            <div className={s['text-wrap']}>
              <span className={s['text-top']}>
                <p>19가지 차량 이력</p>
                투명하게 공개
              </span>

              <span className={s['text-bottom']}>
                구매할 차량의 모든 이력을 확인해보세요.
              </span>
            </div>
          </div>

          <div className={s['padding-container']}>
            <div className={s['img-container']}>
              <div className={`${s['img-wrap']}`}>
                <div className={s['slide-img']}></div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

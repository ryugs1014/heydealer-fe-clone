'use client';

import React from 'react';
import s from './Section_05.module.scss';
import ReviewSlider from '@/components/atoms/pecha/ReviewSlider';
import data from '@/data/pecha/review.json';

export default function Section_05() {
  return (
    <div className={s['section-content']}>
      <div className={s['content-wrap']}>
        <div className={s['text-wrap']}>판매 후기</div>

        <ReviewSlider reviews={data} />
      </div>
    </div>
  );
}

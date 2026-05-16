'use client';

import React from 'react';
import FastMarquee from 'react-fast-marquee';
import s from './Marquee.module.scss';

export default function Marquee() {
  const baseItems = [
    { text: '헤이딜러가', bold: '선별했으니까' },
    { text: '1년', bold: '무료 보증' },
    { text: '단순변심도', bold: '무료 환불' },
    { text: '전국', bold: '무료 배송' },
    { text: '99.9%', bold: '살균세차 완료' },
  ];

  // 📌 핵심 1: 아이템 개수가 적으면 화면 너비를 채우지 못해 빈 공간(딜레이)이 생깁니다.
  // 배열을 3번 반복해서 총 15개로 늘려주면 어떤 화면 해상도에서도 끊김이 원천 차단됩니다.
  const multipliedItems = [...baseItems, ...baseItems, ...baseItems];

  return (
    <div className={s['marquee-container']}>
      {/*
        📌 핵심 2:
        - play: 애니메이션 강제 활성화 보장
        - delay: 루프 사이의 대기 시간 0초 고정
      */}
      <FastMarquee
        speed={60}
        direction="left"
        gradient={false}
        play={true}
        delay={0}
      >
        {multipliedItems.map((item, index) => (
          <span key={index} className={s['marquee-item']}>
            {item.text}
            &nbsp;
            <span className={s['bold']}>{item.bold}</span>
          </span>
        ))}
      </FastMarquee>
    </div>
  );
}

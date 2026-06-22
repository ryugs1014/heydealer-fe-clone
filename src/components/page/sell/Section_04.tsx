'use client';

import React from 'react';
import s from './Section_04.module.scss';
import Container from '@/components/layout/Container';
import Image from 'next/image';
import SectionImage from '/public/img/sell/desktop-section4.png';

export default function Section_04() {
  return (
    <div className={s['section-container']}>
      <Container size={'sm-min'}>
        <div className={s['section-wrap']}>
          <div className={s['text-wrap']}>
            <span className={s['text-top']}>
              번호판으로
              <br />
              쉽게 시세조회
            </span>

            <span className={s['text-bottom']}>100만대 데이터로 정확하게</span>
          </div>

          <div className={s['img-container']}>
            <div className={`${s['img-wrap']} img-wrap`}>
              <Image src={SectionImage} alt={`star`} fill sizes="50vw" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

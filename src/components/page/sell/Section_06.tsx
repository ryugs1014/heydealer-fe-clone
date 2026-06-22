'use client';

import React from 'react';
import s from './Section_06.module.scss';
import Container from '@/components/layout/Container';
import Image from 'next/image';
import SectionImage01 from '/public/img/sell/desktop-section6-01.png';
import SectionImage02 from '/public/img/sell/desktop-section6-02.png';

export default function Section_06() {
  return (
    <div className={s['section-container']}>
      {' '}
      <Container size={'sm-min'}>
        <div className={s['section-wrap']}>
          <div className={s['text-wrap']}>
            <span className={s['text-top']}>
              검증된 딜러와
              <br />
              집앞거래
            </span>

            <span className={s['text-bottom']}>
              헤이딜러는 감가내역까지 투명하게 공개
            </span>
          </div>

          <div className={s['img-container']}>
            <div className={`${s['img-wrap']} img-wrap`}>
              <Image src={SectionImage01} alt={`star`} fill sizes="50vw" />
            </div>
            <div className={`${s['img-wrap']} img-wrap`}>
              <Image src={SectionImage02} alt={`star`} fill sizes="50vw" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

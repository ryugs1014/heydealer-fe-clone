'use client';

import React from 'react';
import s from './Section_02.module.scss';
import Container from '@/components/layout/Container';
import Image from 'next/image';
import SectionImage01 from '/public/img/total-info/desktop_section2-01.png';
import SectionImage02 from '/public/img/total-info/desktop_section2-02.png';

export default function Section_02() {
  return (
    <div className={s['section-container']}>
      <Container size={'sm-min'}>
        <div className={s['section-wrap']}>
          <div className={s['text-container']}>
            <div className={s['text-wrap']}>
              <span className={s['text-top']}>
                어디에도 없던
                <br />
                <p>숨은 정비 이력</p>
              </span>

              <span className={s['text-bottom']}>
                흩어져 있는 정비 이력을 한 곳에 모아놨어요.
              </span>
            </div>
          </div>

          <div className={s['img-container']}>
            <div className={`${s['img-wrap']} img-wrap`}>
              <Image src={SectionImage02} alt={`total`} fill sizes="50vw" />
            </div>
            <div className={`${s['top-img-wrap']} img-wrap`}>
              <Image src={SectionImage01} alt={`total`} fill sizes="50vw" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

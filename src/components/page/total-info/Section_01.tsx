'use client';

import React from 'react';
import s from './Section_01.module.scss';
import Container from '@/components/layout/Container';
import Image from 'next/image';
import SectionImage from '/public/img/total-info/mockup.png';
import SectionGif from '/public/img/total-info/mockup_screen.gif';

export default function Section_01() {
  return (
    <div className={s['section-container']}>
      <Container size={'sm-min'}>
        <div className={s['section-wrap']}>
          <div className={s['text-wrap']}>
            <span className={s['text-bottom']}>중고차 숨은 이력 찾기</span>

            <span className={s['text-top']}>
              구매할 중고차,
              <br />
              번호만 입력하세요
            </span>
          </div>

          <div className={s['img-container']}>
            <div className={`${s['img-wrap']} img-wrap`}>
              <Image src={SectionImage} alt={`star`} fill sizes="50vw" />
            </div>
            <div className={`${s['gif-img-wrap']} img-wrap`}>
              <Image src={SectionGif} alt={`star`} fill sizes="50vw" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

'use client';

import React from 'react';
import s from './Section_05.module.scss';
import Container from '@/components/layout/Container';
import Image from 'next/image';
import SectionImage from '/public/img/sell/desktop-section5.png';
import SectionMobileImage from '/public/img/sell/mobile-section5.png';

export default function Section_05() {
  return (
    <div className={s['section-container']}>
      <Container size={'sm-min'}>
        <div className={s['section-wrap']}>
          <div className={s['img-container']}>
            <div className={`${s['img-wrap']} img-wrap`}>
              <Image src={SectionImage} alt={`star`} fill sizes="50vw" />
            </div>

            <div className={`${s['mobile-img-wrap']} img-wrap`}>
              <Image src={SectionMobileImage} alt={`star`} fill sizes="50vw" />
            </div>
          </div>

          <div className={s['text-wrap']}>
            <div className={s['main-text-wrap']}>
              <span className={s['text-top']}>
                좋은 값에
                <br />
                팔고 싶다면,
              </span>

              <span className={s['text-bottom']}>
                전국 매입딜러 90%가 참여하는 경매
              </span>
            </div>

            <span className={s['sub-text']}>
              *연락처는 판매요청 전까지 딜러에게 공개되지 않아요.
            </span>
          </div>
        </div>
      </Container>
    </div>
  );
}

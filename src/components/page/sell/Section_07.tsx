'use client';

import React from 'react';
import s from './Section_07.module.scss';
import Container from '@/components/layout/Container';
import Image from 'next/image';
import SectionImage01 from '/public/img/sell/desktop-section7-01.png';
import SectionImage02 from '/public/img/sell/desktop-section7-02.png';
import SectionImage03 from '/public/img/sell/desktop-section7-03.png';

export default function Section_07() {
  return (
    <div className={s['section-container']}>
      <Container size={'sm-min'}>
        <div className={s['section-wrap']}>
          <div className={s['text-wrap']}>
            <span className={s['text-top']}>
              안심거래 책임지는
              <br />
              유일한 플랫폼
            </span>
          </div>

          <div className={s['box-container']}>
            <div className={s['box-wrap']}>
              <span className={s['box-header']}>부당감가 보상제</span>
              <div className={s['box-img']}>
                <div className={`${s['img-wrap']} img-wrap`}>
                  <Image src={SectionImage01} alt={`sell`} fill sizes="50vw" />
                </div>
              </div>
              <span className={s['box-text']}>
                감가심사센터 검토 후 <br />
                부당한 감가는 돌려드립니다.
              </span>
            </div>
            <div className={s['box-wrap']}>
              <span className={s['box-header']}>48시간 내 명의이전</span>
              <div className={s['box-img']}>
                <div className={`${s['img-wrap']} img-wrap`}>
                  <Image src={SectionImage02} alt={`sell`} fill sizes="50vw" />
                </div>
              </div>
              <span className={s['box-text']}>
                이전에 문제가 생기면,
                <br />
                헤이딜러가 직접 처리합니다.
              </span>
            </div>
            <div className={s['box-wrap']}>
              <span className={s['box-header']}>365일 채팅상담</span>
              <div className={s['box-img']}>
                <div className={`${s['img-wrap']} img-wrap`}>
                  <Image src={SectionImage03} alt={`sell`} fill sizes="50vw" />
                </div>
              </div>
              <span className={s['box-text']}>
                휴일에도 편하게
                <br />
                도움을 요청하세요.
              </span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

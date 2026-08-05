'use client';

import React from 'react';
import s from './Section_04.module.scss';
import Container from '@/components/layout/Container';
import Image from 'next/image';
import SectionImage01 from '/public/img/total-info/desktop_section4-01.png';
import SectionImage02 from '/public/img/total-info/desktop_section4-02.png';
import SectionImage03 from '/public/img/total-info/desktop_section4-03.png';

import DraggableContainer from '@/components/common/slide/DraggableContainer';

export default function Section_04() {
  return (
    <div className={s['section-container']}>
      <Container size={'sm-slide'}>
        <div className={s['section-wrap']}>
          <div className={s['text-wrap']}>
            <span className={s['text-top']}>
              구매 전에 <br className={s['text-top-br']} />꼭 확인하세요
            </span>
          </div>

          <DraggableContainer className={s['box-container']}>
            <div className={s['box-wrap']}>
              <div className={s['box-img']}>
                <div className={`${s['img-wrap']} img-wrap`}>
                  <Image src={SectionImage01} alt={`sell`} fill sizes="50vw" />
                </div>
              </div>
              <span className={s['box-header']}>
                <div className={s['main-text']}>
                  “몰랐던 정비이력을
                  <br />
                  발견했어요”
                </div>

                <div className={s['sub-text']}>19버1864 조회 고객</div>
              </span>

              <span className={s['box-text']}>
                무사고 차량으로 알았는데, 번호판 입력해 보니 정비 이력이 5건이나
                되네요. 숨은이력 안 찾아봤으면 정말 큰일 날 뻔했어요.
              </span>
            </div>
            <div className={s['box-wrap']}>
              <div className={s['box-img']}>
                <div className={`${s['img-wrap']} img-wrap`}>
                  <Image src={SectionImage02} alt={`sell`} fill sizes="50vw" />
                </div>
              </div>
              <span className={s['box-header']}>
                <div className={s['main-text']}>
                  “알고보니
                  <br />
                  렌터카 차량이었어요”
                </div>

                <div className={s['sub-text']}>67나1457 조회 고객</div>
              </span>

              <span className={s['box-text']}>
                매매 단지에 직접 방문해 꼼꼼히 살펴본 뒤 구매 직전, 이력을
                조회해봤어요. 그런데 알고보니 렌터카로 3년이나 이용했던
                차량이더라구요.
              </span>
            </div>
            <div className={s['box-wrap']}>
              <div className={s['box-img']}>
                <div className={`${s['img-wrap']} img-wrap`}>
                  <Image src={SectionImage03} alt={`sell`} fill sizes="50vw" />
                </div>
              </div>
              <span className={s['box-header']}>
                <div className={s['main-text']}>
                  “5년 전 이력까지
                  <br />
                  확인하니 안심되네요!”
                </div>

                <div className={s['sub-text']}>13가8215 조회 고객</div>
              </span>

              <span className={s['box-text']}>
                중고차 구매는 처음이라 막막했는데.. 5년 전 이력까지 확인할 수
                있으니까 덕분에 안심하고 구매할 수 있었어요!
              </span>
            </div>
          </DraggableContainer>
        </div>
      </Container>
    </div>
  );
}

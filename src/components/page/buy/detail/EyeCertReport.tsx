'use client';

import React from 'react';
import s from './EyeCertReport.module.scss';

import HeydealerEyeIcon from '/public/svg/heydealer-eye.svg';
import EyeIcon from '/public/svg/eye.svg';

export default function EyeCertReport() {
  return (
    <div className={s['cert-report-wrapper']}>
      <div className={s['logo-svg-box']}>
        <HeydealerEyeIcon width="100%" height="100%" viewBox="0 0 121 51" />
      </div>

      <div className={s['video-container']}>
        <video
          src="https://d2avc2iz4eoo2p.cloudfront.net/media/cars/carmediafile/2026/05/27/dcf09dc4-013d-48ff-8246-bf9fef0c6858/dcf09dc4-013d-48ff-8246-bf9fef0c6858.mp4"
          autoPlay
          muted
          loop
          playsInline
          className={s['video-element']}
        />
      </div>

      <div className={s['info-text']}>*실제 진단 과정을 촬영한 영상입니다.</div>

      <div className={s['report-bottom']}>
        <div className={s['report-list']}>
          <div className={s['report-item']}>
            <div className={s['item-title']}>
              단순교환 무사고<span>도색 있음</span>
            </div>
            <ul className={s['item-details']}>
              <li>
                <span className={s['label']}>프레임</span>
                <span className={s['value']}>정상</span>
              </li>
              <li>
                <span className={s['label']}>외부패널</span>
                <span className={s['value']}>교환 1 ∙ 판금 1</span>
              </li>
            </ul>
          </div>

          <div className={s['report-item']}>
            <div className={s['item-title']}>하부 정상</div>
            <ul className={s['item-details']}>
              <li>
                <span className={s['label']}>누유</span>
                <span className={s['value']}>없음</span>
              </li>
              <li>
                <span className={s['label']}>파손</span>
                <span className={s['value']}>없음</span>
              </li>
            </ul>
          </div>

          <div className={s['report-item']}>
            <div className={s['item-title']}>전자시스템 정상</div>
            <ul className={s['item-details']}>
              <li>
                <span className={s['label']}>엔진 제어</span>
                <span className={s['value']}>정상</span>
              </li>
              <li>
                <span className={s['label']}>브레이크 제어</span>
                <span className={s['value']}>정상</span>
              </li>
            </ul>
          </div>
        </div>

        <button className={s['report-button']}>
          <div className={s['svg-box']}>
            <EyeIcon width="100%" height="100%" viewBox="0 0 45 24" />
          </div>
          인증 리포트
        </button>
      </div>
    </div>
  );
}

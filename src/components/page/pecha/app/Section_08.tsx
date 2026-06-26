'use client';

import React from 'react';
import s from './Section_08.module.scss';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={`${s['footer']}`}>
      <div className={s['footer-info']}>
        <Link
          href="https://forms.gle/yoQzrbPMMr6dLiKq5"
          className={s['form-link']}
          target={'_blank'}
        >
          <button className={s['sign-up']}>
            <div className={s['sign-up-text']}>
              👀 헤이딜러로 매입하고 싶으세요?
            </div>
            <div className={s['sign-up-button']}>
              폐차장 가입<div className={s['svg-box']}></div>
            </div>
          </button>
        </Link>

        <div className={s['main-info']}>
          <div className={s['company-name']}>(주) 피알앤디테크베이</div>

          <div className={s['info-top']}>
            사업자등록번호 : 565-86-03060
            <br />
            자동차관리사업등록: 제03-4721-000008호
            <br />
            대표자 : 박진우
            <br />
            주소: 서울 서초구 서초대로 74길 14, 8층
          </div>

          <div className={s['info-bottom']}>
            <button className={s['per-info-button']}>개인정보 처리방침</button>
            <span>|</span>
            <button className={s['company-info-button']}>이용약관</button>
            <span>|</span>
            <button className={s['company-info-button']}>공지</button>
          </div>
        </div>

        <div className={s['copyright-info']}>2026 ⓒ all rights reserved.</div>
      </div>
    </footer>
  );
}

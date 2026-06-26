'use client';

import React from 'react';
import Link from 'next/link';
import s from './Section_07.module.scss';
import ChatImage from '/public/svg/kakaotalk.svg';

export default function Section_07() {
  return (
    <div className={s['section-content']}>
      <div className={s['content-wrap']}>
        <div className={s['text-wrap']}>
          <div className={s['title-text']}>편하게 물어보세요.</div>

          <div className={s['detail-text']}>
            평일: 오전 10시 ~ 오후 6시
            <br />
            일부 시간은 답변이 지연될 수 있습니다.
          </div>
        </div>

        <Link
          href="http://pf.kakao.com/_xlHRPxj/chat"
          className={s['kakao-link']}
          target={'_blank'}
        >
          <button className={s['more-button']}>
            <div className={s['svg-box']}>
              <ChatImage width="100%" height="100%" viewBox="0 0 24 24" />
            </div>
            채팅문의
          </button>
        </Link>
      </div>
    </div>
  );
}

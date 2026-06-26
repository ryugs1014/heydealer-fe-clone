'use client';

import React from 'react';
import s from './Section_04.module.scss';

export default function Section_04() {
  return (
    <div className={s['section-content']}>
      <div className={s['content-wrap']}>
        <div className={s['text-wrap']}>판매 과정</div>

        <ul className={s['text-list']}>
          <li>
            <div className={s['text-title']}>
              <span className={s['badge']}>1</span>
              <div className={s['title']}>휴대폰 번호, 판매지역 입력</div>
            </div>

            <div className={s['text-detail']}>
              <div className={s['detail-line']}>
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className={s['detail']}>신청은 1분이면 돼요.</div>
            </div>
          </li>
          <li>
            <div className={s['text-title']}>
              <span className={s['badge']}>2</span>
              <div className={s['title']}>카톡으로 실시간 견적받기</div>
            </div>

            <div className={s['text-detail']}>
              <div className={s['detail-line']}>
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className={s['detail']}>
                전국 관허 폐차장이 경매에 참여해요.
              </div>
            </div>
          </li>
          <li>
            <div className={s['text-title']}>
              <span className={s['badge']}>3</span>
              <div className={s['title']}>판매여부 결정하기</div>
            </div>

            <div className={s['text-detail']}>
              <div className={s['detail-line']}>
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className={s['detail']}>5일 안에 결정하면 돼요.</div>
            </div>
          </li>
          <li>
            <div className={s['text-title']}>
              <span className={s['badge']}>4</span>
              <div className={s['title']}>흥정없이 판매하기</div>
            </div>

            <div className={s['text-detail']}>
              <div className={s['detail-line']}></div>
              <div className={s['detail']}>
                필요 서류와 차키만 넘기면, 입금 받아요.
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

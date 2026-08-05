'use client';

import React, { useEffect, useState } from 'react';
import s from './Section_02.module.scss';
import Image from 'next/image';
import ReviewImage from '/public/img/pecha/reward.png';
import RewardModal from '@/components/atoms/modal/RewardModal';

export default function Section_02() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      // 💡 1. body와 html 모두 overflow 제어
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      // 💡 2. iOS 바운스(고무줄) 효과 차단
      document.body.style.overscrollBehavior = 'none';
      document.documentElement.style.overscrollBehavior = 'none';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehavior = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehavior = '';
    };
  }, [isModalOpen]);

  return (
    <>
      <div className={s['section-content']}>
        <button
          className={s['banner-wrap']}
          onClick={() => setIsModalOpen(true)}
        >
          <div className={s['content-wrap']}>
            <div className={s['badge']}>100% 지급</div>

            <div className={s['text-wrap']}>
              6월에 폐차하면
              <br />
              투썸 베이글 세트 드려요
            </div>

            <div className={s['more-button']}>
              자세히 보기<div className={s['svg-box']}></div>
            </div>
          </div>

          <div className={s['img-section']}>
            <div className={`${s['img-wrap']} img-wrap`}>
              <Image
                src={ReviewImage}
                alt={'ReviewImage'}
                fill
                sizes="10vw"
                style={{
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </button>
      </div>

      <RewardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

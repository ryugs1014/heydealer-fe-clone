// src/components/page/buy/detail/RelatedCarSlider.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import s from './RelatedCarSlider.module.scss';
import FavoriteButton from '@/components/atoms/buttons/FavoriteButton';
import Arrow from '/public/svg/filter-arrow.svg';

interface RelatedCarSliderProps {
  title: string; // 🌟 외부에서 주입받는 타이틀
  cars: any[];
}

export default function RelatedCarSlider({
  title,
  cars,
}: RelatedCarSliderProps) {
  // Swiper 인스턴스를 상태로 관리하여 외부 버튼과 연동
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  return (
    <div className={s['slider-wrapper']}>
      <div className={s['header-section']}>
        {/* 🌟 주입받은 타이틀 렌더링 */}
        <h2 className={s['category-title']}>{title}</h2>

        <div className={s['button-section']}>
          <button
            className={`${s['nav-btn']} ${s['prev']}`}
            onClick={() => swiperInstance?.slidePrev()}
            aria-label="이전 항목 보기"
          >
            <div className={s['svg-box']}>
              <Arrow width="100%" height="100%" viewBox="0 0 24 24" />
            </div>
          </button>
          <button
            className={`${s['nav-btn']} ${s['next']}`}
            onClick={() => swiperInstance?.slideNext()}
            aria-label="다음 항목 보기"
          >
            <div className={s['svg-box']}>
              <Arrow width="100%" height="100%" viewBox="0 0 24 24" />
            </div>
          </button>
        </div>
      </div>

      <div className={s['slider-container']}>
        <Swiper
          onSwiper={setSwiperInstance}
          spaceBetween={12}
          slidesPerView={3.78} /* 기본 4개 */
          grabCursor={true} /* 마우스 오버시 손바닥 모양 (스와이프 가능 표시) */
          // breakpoints={{
          //   // 화면 크기에 따른 반응형 설정
          //   0: { slidesPerView: 2, spaceBetween: 12 },
          //   768: { slidesPerView: 3, spaceBetween: 12 },
          //   1024: { slidesPerView: 4, spaceBetween: 12 },
          // }}
        >
          {cars.map((item) => {
            const info = item.detail_info;
            const regDate = info?.initial_registration_date;
            const formattedRegDate =
              regDate && regDate.length >= 7
                ? `${regDate.substring(2, 4)}/${regDate.substring(5, 7)}`
                : '';
            const mileageValue = info?.mileage;
            const formattedMileage = mileageValue
              ? `${(mileageValue / 10000).toFixed(1)}만km`
              : '0만km';

            return (
              // 🌟 각각의 아이템을 SwiperSlide로 감싸줍니다
              <SwiperSlide key={item.hash_id}>
                <article className={s['slide-card']}>
                  <Link
                    href={`/buy/${item.hash_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={s['thumbnail-area']}>
                      <div className={s['img-wrap']}>
                        {info?.image_urls?.[0] ? (
                          <Image
                            src={info.image_urls[0]}
                            alt={info.model_name}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        ) : (
                          <div className={s['dummy-img']}>이미지 준비중</div>
                        )}
                      </div>
                    </div>

                    <div className={s['info-container']}>
                      <div className={s['main-info']}>
                        <h3 className={s['item-title']}>
                          {info?.model_name} {info?.grade_part_name}{' '}
                          {info?.detail_name}
                        </h3>
                        <p className={s['item-spec']}>
                          {info?.year}년 ({formattedRegDate}) ㆍ{' '}
                          {formattedMileage}
                        </p>
                      </div>

                      <span className={s['item-price']}>
                        {item.price?.toLocaleString()}만원
                      </span>
                    </div>
                  </Link>

                  <FavoriteButton
                    hashId={item.hash_id}
                    className={s['favorite-button-wrap']}
                  />
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

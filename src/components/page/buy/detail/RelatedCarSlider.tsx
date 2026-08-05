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
  title: string;
  cars: any[];
}

export default function RelatedCarSlider({
  title,
  cars,
}: RelatedCarSliderProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  // 💡 코드 중복을 막기 위해 카드 UI를 별도 함수로 분리
  const renderCard = (item: any) => {
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
                  sizes="(max-width: 1500px) 220px, 25vw"
                  draggable={
                    false
                  } /* 모바일 네이티브 스와이프 이미지 드래그 방지 */
                />
              ) : (
                <div className={s['dummy-img']}>이미지 준비중</div>
              )}
            </div>
          </div>

          <div className={s['info-container']}>
            <div className={s['main-info']}>
              <h3 className={s['item-title']}>
                {info?.model_name} {info?.grade_part_name} {info?.detail_name}
              </h3>
              <p className={s['item-spec']}>
                {info?.year}년 ({formattedRegDate}) ㆍ {formattedMileage}
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
    );
  };

  return (
    <div className={s['slider-wrapper']}>
      <div className={s['header-section']}>
        <h2 className={s['category-title']}>{title}</h2>

        {/* 좌우 네비게이션 버튼 (모바일에서는 숨김 처리) */}
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
        {/* 💻 PC: Swiper가 렌더링되는 영역 (1500px 이상) */}
        <div className={s['pc-swiper']}>
          <Swiper
            onSwiper={setSwiperInstance}
            spaceBetween={12}
            slidesPerView={3.78}
            grabCursor={true}
          >
            {cars.map((item) => (
              <SwiperSlide key={item.hash_id}>{renderCard(item)}</SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 📱 모바일: 순수 HTML Grid 네이티브 스크롤 영역 (1500px 이하) */}
        <div className={s['mobile-swiper']}>
          {cars.map((item) => (
            <div key={item.hash_id} className={s['mobile-slide-item']}>
              {renderCard(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

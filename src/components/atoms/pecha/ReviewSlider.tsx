'use client';

import React, { useRef, useState, useEffect } from 'react';
import s from './ReviewSlider.module.scss';
import Image from 'next/image';
import Arrow from '/public/svg/filter-arrow.svg';
import Star from '/public/svg/star.svg';
import StarHalf from '/public/svg/star-half.svg';

export interface ReviewData {
  id: number;
  modelName: string;
  rating: number;
  content: string;
  price: number;
  imageUrl: string;
}

interface ReviewSliderProps {
  reviews: ReviewData[];
}

export default function ReviewSlider({ reviews }: ReviewSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const handleScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;

    setIsAtStart(scrollLeft <= 0);

    setIsAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 1);
  };

  useEffect(() => {
    handleScroll(); // 초기 렌더링 시 확인
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [reviews]);

  const formatPrice = (price: number) => {
    return `${Math.floor(price / 10000)}만원`;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(
          <span key={i} className={s['star-full']}>
            <div className={s['svg-box']}>
              <Star width="100%" height="100%" viewBox="0 0 24 24" />
            </div>
          </span>,
        );
      } else if (rating === i - 0.5) {
        stars.push(
          <span key={i} className={s['star-half']}>
            <div className={s['svg-box']}>
              <StarHalf width="100%" height="100%" viewBox="0 0 24 24" />
            </div>
          </span>,
        );
      } else {
        stars.push(
          <span key={i} className={s['star-empty']}>
            <div className={s['svg-box']}>
              <Star width="100%" height="100%" viewBox="0 0 24 24" />
            </div>
          </span>,
        );
      }
    }
    return stars;
  };

  const handlePrev = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -304, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 304, behavior: 'smooth' });
    }
  };

  return (
    <div className={s['slider-wrap']}>
      <div className={s['nav-buttons']}>
        <button
          onClick={handlePrev}
          className={`${s['nav-btn']} ${s['prev']}`}
          style={{ visibility: isAtStart ? 'hidden' : 'visible' }}
        >
          <div className={s['svg-box']}>
            <Arrow width="100%" height="100%" viewBox="0 0 24 24" />
          </div>
        </button>
        <button
          onClick={handleNext}
          className={s['nav-btn']}
          style={{ visibility: isAtEnd ? 'hidden' : 'visible' }}
        >
          <div className={s['svg-box']}>
            <Arrow width="100%" height="100%" viewBox="0 0 24 24" />
          </div>
        </button>
      </div>

      <div className={s['slider-container']}>
        <div
          className={s['slider-track']}
          ref={trackRef}
          onScroll={handleScroll}
        >
          {reviews.map((review) => (
            <div key={review.id} className={s['review-slide']}>
              <div className={s['review-card']}>
                <div className={s['info-box']}>
                  <div className={s['info-header']}>
                    <h3 className={s['model-name']}>{review.modelName}</h3>

                    <span className={s['stars']}>
                      {renderStars(review.rating)}
                    </span>
                  </div>

                  <div className={s['info-footer']}>
                    <p className={s['review-content']}>{review.content}</p>

                    <div className={s['price-box']}>
                      판매가
                      <span className={s['price']}>
                        {formatPrice(review.price)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={s['image-box']}>
                  <div className={`${s['img-wrap']} img-wrap`}>
                    <Image
                      src={review.imageUrl}
                      alt={review.modelName}
                      fill
                      sizes="10vw"
                      style={{
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// src/components/page/buy/ResultList.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import s from './ResultList.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import FavoriteButton from '@/components/atoms/buttons/FavoriteButton';

interface ResultListProps {
  cars: any[];
  viewType: 'grid' | 'list' | 'simple';
  isLoading?: boolean;
}

export default function ResultList({
  cars,
  viewType,
  isLoading,
}: ResultListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const hasDragged = useRef<boolean>(false); // 🌟 드래그 여부 판별용 ref
  const startX = useRef<number>(0);
  const scrollLeft = useRef<number>(0);

  const velocity = useRef<number>(0);
  const lastX = useRef<number>(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewType !== 'list' || !scrollRef.current) return;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    isDragging.current = true;
    hasDragged.current = false; // 클릭 시 드래그 상태 초기화
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    lastX.current = e.pageX;
    velocity.current = 0;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || viewType !== 'list' || !scrollRef.current)
      return;
    e.preventDefault();

    const currentX = e.pageX;
    const x = currentX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;

    // 🌟 이동 거리가 5px 이상이면 드래그로 간주 (클릭 방지 목적)
    if (Math.abs(walk) > 5) {
      hasDragged.current = true;
    }

    scrollRef.current.scrollLeft = scrollLeft.current - walk;
    velocity.current = currentX - lastX.current;
    lastX.current = currentX;
  };

  const onMouseUpOrLeave = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const applyMomentum = () => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollLeft -= velocity.current;
      velocity.current *= 0.92;

      if (Math.abs(velocity.current) > 0.5) {
        animationRef.current = requestAnimationFrame(applyMomentum);
      }
    };

    animationRef.current = requestAnimationFrame(applyMomentum);
  };

  if (isLoading) {
    return (
      <div className={`${s['result-list-container']} ${s[`view-${viewType}`]}`}>
        <div className={s['grid-layout']}>
          {Array.from({ length: 12 }).map((_, idx) => (
            <article
              key={idx}
              className={`${s['product-card']} ${s[`card-${viewType}`]} ${s['skeleton-card']}`}
            >
              <div className={s['card-link-area']}>
                {/* 단순형 뷰가 아닐 때 썸네일 스켈레톤 노출 */}
                {viewType !== 'simple' && (
                  <div className={s['thumbnail-area']}>
                    <div
                      className={`${s['img-wrap']} img-wrap ${s['skeleton-box']}`}
                    />
                  </div>
                )}

                <div className={s['info-container']}>
                  <div className={s['info-row-top']}>
                    <div className={`${s['skeleton-text']} ${s['sk-title']}`} />
                    <div className={`${s['skeleton-text']} ${s['sk-spec']}`} />
                  </div>
                  <div className={s['info-row-bottom']}>
                    <div className={`${s['skeleton-text']} ${s['sk-price']}`} />
                    <div
                      className={`${s['skeleton-text']} ${s['sk-factory']}`}
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  // 🌟 2. 로딩이 완료되었는데 차가 없는 경우
  if (cars.length === 0) {
    return (
      <div className={s['empty-message']}>
        <div className={`${s['img-wrap']} img-wrap`}>
          <Image
            src={'/img/ui/noitem-DW77nzIj.png'}
            alt="Image"
            fill
            priority
          />
        </div>
        찾으시는 차가 없어요.
      </div>
    );
  }

  return (
    // 뷰타입 클래스를 동적으로 주입하여 컨테이너 레이아웃 구조 변경
    <div className={`${s['result-list-container']} ${s[`view-${viewType}`]}`}>
      <div
        className={s['grid-layout']}
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUpOrLeave}
        onMouseLeave={onMouseUpOrLeave}
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

          // 💡 공통 카드 내용물 (UI) 변수화
          const CardInnerContent = (
            <>
              {/* 단순형(simple) 뷰어일 때는 썸네일 노출 제거 */}
              <div className={s['thumbnail-area']}>
                <div className={`${s['img-wrap']} img-wrap`}>
                  {info?.image_urls?.[0] ? (
                    <Image
                      src={info.image_urls[0]}
                      alt={info.model_name}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  ) : (
                    <div className={s['dummy-img']}>이미지 준비중</div>
                  )}
                </div>

                {viewType !== 'list' && info?.image_urls?.[1] && (
                  <div className={`${s['sub-img-wrap']} img-wrap`}>
                    <div className={s['secondary-thumb']}>
                      <Image
                        src={info.image_urls[1]}
                        alt="서브"
                        fill
                        sizes="15vw"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className={s['info-container']}>
                <div className={s['info-row-top']}>
                  <h3 className={s['item-title']}>
                    {info?.model_name} {info?.grade_part_name}{' '}
                    {info?.detail_name}
                  </h3>

                  <p className={s['item-spec']}>
                    {info?.year}년 ({formattedRegDate}) ㆍ {formattedMileage}
                  </p>
                </div>

                <div className={s['info-row-bottom']}>
                  <div className={s['price-block']}>
                    <span className={s['item-price']}>
                      {item.price?.toLocaleString()}만원
                    </span>
                    {viewType === 'grid' &&
                      info?.tags &&
                      info.tags.length > 0 && (
                        <div className={s['tags-container']}>
                          {info.tags.map((tag: any, idx: number) => (
                            <span
                              key={idx}
                              className={`${s['tag-badge']} ${s[tag.style || 'gray']}`}
                            >
                              {tag.text}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                  <div className={s['price-block']}>
                    <span className={s['factory-price']}>
                      신차 {info?.factory_price?.toLocaleString()}
                    </span>
                    {viewType === 'simple' &&
                      info?.tags &&
                      info.tags.length > 0 && (
                        <div className={s['tags-container']}>
                          {info.tags.map((tag: any, idx: number) => (
                            <span
                              key={idx}
                              className={`${s['tag-badge']} ${s[tag.style || 'gray']}`}
                            >
                              {tag.text}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </>
          );

          return (
            <article
              key={item.hash_id}
              className={`${s['product-card']} ${s[`card-${viewType}`]}`}
            >
              {/* 💡 1. 데스크탑용 링크 (새 탭) */}
              <Link
                href={`/buy/${item.hash_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${s['card-link-area']} ${s['desktop-link']}`}
                onClick={(e) => {
                  if (hasDragged.current) {
                    e.preventDefault(); // 드래그 중이었다면 페이지 이동 취소
                  }
                }}
              >
                {CardInnerContent}
              </Link>

              {/* 💡 2. 모바일용 링크 (현재 창) */}
              <Link
                href={`/buy/${item.hash_id}`}
                target="_self"
                className={`${s['card-link-area']} ${s['mobile-link']}`}
                onClick={(e) => {
                  if (hasDragged.current) {
                    e.preventDefault(); // 드래그 중이었다면 페이지 이동 취소
                  }
                }}
              >
                {CardInnerContent}
              </Link>

              <FavoriteButton
                hashId={item.hash_id}
                className={s['favorite-button-wrap']}
              />

              <span className={s['line']} />
            </article>
          );
        })}
      </div>
    </div>
  );
}

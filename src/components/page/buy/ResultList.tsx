// src/components/page/buy/ResultList.tsx
'use client';

import React from 'react';
import s from './ResultList.module.scss';
import Image from 'next/image';
import FavoriteButton from '@/components/atoms/buttons/FavoriteButton';

interface ResultListProps {
  cars: any[];
  viewType: 'grid' | 'list' | 'simple'; // 🌟 상위 뷰 타입 주입 수신
}

export default function ResultList({ cars, viewType }: ResultListProps) {
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
      <div className={s['grid-layout']}>
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
            <article
              key={item.hash_id}
              className={`${s['product-card']} ${s[`card-${viewType}`]}`}
            >
              {/* 단순형(simple) 뷰어일 때는 썸네일 노출 제거 */}
              {viewType !== 'simple' && (
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
                  <FavoriteButton hashId={item.hash_id} />
                  {viewType === 'grid' && info?.image_urls?.[1] && (
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
              )}

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
                    {info?.tags && info.tags.length > 0 && (
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
                  <span className={s['factory-price']}>
                    신차 {info?.factory_price?.toLocaleString()}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

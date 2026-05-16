'use client';

import React from 'react';
import s from './ResultList.module.scss';
import Image from 'next/image';
import SubDisabled from '/public/svg/sub-disabled.svg';
import SubActive from '/public/svg/sub-active.svg';

interface ResultListProps {
  cars: any[];
}

export default function ResultList({ cars }: ResultListProps) {
  if (cars.length === 0) {
    return (
      <div className={s['empty-message']}>
        조건에 맞는 매물 차량이 존재하지 않습니다.
      </div>
    );
  }

  return (
    <div className={s['result-list-container']}>
      <div className={s['grid-layout']}>
        {cars.map((item) => {
          const info = item.detail_info;

          // 최초 등록일 가공 (예: "2016-12-15 00:00:00" -> "16/12")
          const regDate = info?.initial_registration_date;
          const formattedRegDate =
            regDate && regDate.length >= 7
              ? `${regDate.substring(2, 4)}/${regDate.substring(5, 7)}`
              : '';

          // 주행거리 가공 (예: 94561 -> "9.5만km")
          const mileageValue = info?.mileage;
          const formattedMileage = mileageValue
            ? `${(mileageValue / 10000).toFixed(1)}만km`
            : '0만km';

          return (
            <article key={item.hash_id} className={s['product-card']}>
              {/* [이미지 상위 컨테이너] */}
              <div className={s['thumbnail-area']}>
                {/* 1. 이미지 배열 1번 (기본 베이스 바닥에 깔림) */}
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

                {/* 2. 이미지 배열 1번 위에 공중 부양할 즐겨찾기 버튼 */}
                <div className={s['button-wrap']}>
                  <button
                    type="button"
                    className={s['favorite-btn']}
                    aria-label="즐겨찾기 등록"
                  >
                    <div className={s['svg-box']}>
                      <SubDisabled
                        width="100%"
                        height="100%"
                        viewBox="0 0 24 24"
                      />
                    </div>
                  </button>
                </div>

                {/* 3. 이미지 배열 1번 위에 공중 부양할 이미지 배열 2번 */}
                <div className={`${s['sub-img-wrap']} img-wrap`}>
                  {info?.image_urls?.[1] && (
                    <div className={s['secondary-thumb']}>
                      <Image
                        src={info.image_urls[1]}
                        alt={`${info.model_name} 서브 이미지`}
                        fill
                        sizes="(max-width: 768px) 25vw, 15vw"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* [큰 컨테이너] */}
              <div className={s['info-container']}>
                {/* 작은 컨테이너 1번째 줄 */}
                <div className={s['info-row-top']}>
                  <h3 className={s['item-title']}>
                    {info?.model_name} {info?.grade_part_name}{' '}
                    {info?.detail_name}
                  </h3>
                  <p className={s['item-spec']}>
                    {info?.year}년 ({formattedRegDate}) ㆍ {formattedMileage}
                  </p>
                </div>

                {/* 작은 컨테이너 2번째 줄 */}
                <div className={s['info-row-bottom']}>
                  {/* 왼쪽: 가격 그룹 */}
                  <div className={s['price-block']}>
                    <span className={s['item-price']}>
                      {item.price?.toLocaleString()}만원
                    </span>

                    {/* 오른쪽: 반대편 태그 배열 */}
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

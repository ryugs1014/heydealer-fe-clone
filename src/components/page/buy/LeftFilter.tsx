// src/components/page/buy/LeftFilter.tsx
'use client';

import React, { useState, useMemo } from 'react';
import s from './LeftFilter.module.scss';
import Image from 'next/image';
import FilterClose from '/public/svg/filter-close.svg';

interface ModelGroup {
  hash_id: string;
  name: string;
  count: number;
  is_subscribed: boolean;
}

interface BrandData {
  hash_id: string;
  name: string;
  image_url: string;
  count: number;
  is_domestic: boolean;
  is_subscribed: boolean;
  model_groups: ModelGroup[];
}

interface LeftFilterProps {
  allBrands: BrandData[];
  currentBrandDetail: BrandData | null;
  selectedModelId: string | null;
  onSelectBrand: (brandId: string) => void;
  onSelectModel: (modelId: string) => void;
  onClearBrand: () => void;
}

export default function LeftFilter({
  allBrands,
  currentBrandDetail,
  selectedModelId,
  onSelectBrand,
  onSelectModel,
  onClearBrand,
}: LeftFilterProps) {
  const [excludeZero, setExcludeZero] = useState(false);

  // 💡 토글 상태에 따라 브랜드 목록 필터링
  const filteredBrands = useMemo(() => {
    if (!excludeZero) return allBrands;
    return allBrands.filter((brand) => brand.count > 0);
  }, [allBrands, excludeZero]);

  // 💡 토글 상태에 따라 현재 브랜드의 하위 모델 목록 필터링
  const filteredModels = useMemo(() => {
    if (!currentBrandDetail) return [];
    if (!excludeZero) return currentBrandDetail.model_groups;
    return currentBrandDetail.model_groups.filter((model) => model.count > 0);
  }, [currentBrandDetail, excludeZero]);

  return (
    <div className={s['left-filter']}>
      <div className={s['filter-header']}>
        <div className={s['title-header-container']}>
          <h3 className={s['title']}>브랜드 ∙ 모델</h3>

          <div className={s['toggle-wrapper']}>
            <span className={s['toggle-label']}>0대 제외</span>
            <button
              type="button"
              className={`${s['toggle-switch']} ${excludeZero ? s['is-active'] : ''}`}
              onClick={() => setExcludeZero((prev) => !prev)}
              aria-label="0대 매물 제외 토글"
            >
              <span className={s['toggle-handle']} />
            </button>
          </div>
        </div>
      </div>

      <div className={s['scroll-container']}>
        {currentBrandDetail && (
          <>
            <div className={s['brand-title-item']}>
              <span className={s['brand-name']}>{currentBrandDetail.name}</span>
              <button
                type="button"
                className={s['close-btn']}
                onClick={onClearBrand}
              >
                <div className={s['svg-box']}>
                  <FilterClose width="100%" height="100%" viewBox="0 0 16 16" />
                </div>
              </button>
            </div>

            <span className={s['line']} />
          </>
        )}

        <div className={s['filter-body']}>
          {!currentBrandDetail ? (
            <ul className={s['list']}>
              {filteredBrands.map((brand) => {
                const logoSrc = `/img/brands/${brand.hash_id}.png`;

                return (
                  <li key={brand.hash_id} className={s['item']}>
                    <button
                      type="button"
                      onClick={() => onSelectBrand(brand.hash_id)}
                      className={s['item-button']}
                    >
                      <div className={s['name-box']}>
                        <div className={`${s['img-wrap']} img-wrap`}>
                          <Image
                            src={logoSrc}
                            alt={`${brand.name} 로고`}
                            width={28}
                            height={28}
                            sizes="28px"
                            style={{
                              objectFit: 'contain',
                            }}
                            priority
                          />
                        </div>
                        <span className={s['name']}>{brand.name}</span>
                      </div>
                      <span className={s['count']}>{brand.count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className={`${s['list']} ${s['model']}`}>
              {filteredModels.map((model) => {
                const isCurrentModelActive = selectedModelId === model.hash_id;

                return (
                  <li
                    key={model.hash_id}
                    className={`${s['item']} ${isCurrentModelActive ? s['active'] : ''}`}
                  >
                    <button
                      type="button"
                      disabled={model.count === 0}
                      onClick={() => onSelectModel(model.hash_id)}
                      style={
                        isCurrentModelActive
                          ? { fontWeight: 'bold', color: '#0070f3' }
                          : {}
                      }
                      className={s['item-button']}
                    >
                      <div className={s['name-box']}>
                        <span className={s['name']}>{model.name}</span>
                      </div>
                      <span className={s['count']}>{model.count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

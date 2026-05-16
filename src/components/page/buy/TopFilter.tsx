// src/components/page/buy/TopFilter.tsx
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import s from './TopFilter.module.scss';
import FilterOption from '/public/svg/filter-option.svg';
import TableBlock from '/public/svg/table-block.svg';
import TableTower from '/public/svg/table-tower.svg';
import TableBoard from '/public/svg/table-board.svg';
import FilterArrow from '/public/svg/filter-arrow.svg';
import { FilterState } from './BuySection';

interface TopFilterProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  totalCount: number;
  viewType: 'grid' | 'list' | 'simple';
  onViewTypeChange: (value: 'grid' | 'list' | 'simple') => void;
  globalCars: any[];
  globalFilters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  checkFilterMatch: (car: any, currentFilters: FilterState) => boolean;
}

const YEAR_STEPS = [
  2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
];
const MILEAGE_STEPS = [
  10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000,
];
const PRICE_STEPS = [100, 200, 300, 500, 1000, 2000, 3000, 5000, 7000, 10000]; // 10000은 1억원

const CONSTANTS = {
  fuel: [
    { name: '휘발유', value: 'gasoline' },
    { name: '경유', value: 'diesel' },
    { name: 'LPG', value: 'lpg' },
    { name: '바이퓨얼', value: 'bifuel' },
    { name: '전기', value: 'electric' },
    { name: '수소', value: 'hydrogen' },
    { name: '하이브리드', value: 'hybrid' },
  ],
  carShape: [
    { name: '경 ∙ 소형', value: 'small' },
    { name: '세단', value: 'sedan' },
    { name: 'SUV ∙ RV', value: 'suv_rv' },
    { name: '쿠페', value: 'coupe' },
    { name: '리무진', value: 'limousine' },
    { name: '컨버터블', value: 'convertible' },
    { name: '해치백', value: 'hatchback' },
  ],
};

const FILTER_LABEL_MAP = {
  year: '연식',
  mileage: '주행거리',
  price: '가격',
  fuel: '연료',
  carShape: '차체',
};

const SORT_OPTIONS = [
  { value: 'latest', label: '최근 등록 순' },
  { value: 'price-low', label: '낮은 가격 순' },
  { value: 'price-high', label: '높은 가격 순' },
  { value: 'mileage-low', label: '짧은 주행 순' },
  { value: 'mileage-high', label: '긴 주행 순' },
  { value: 'year-high', label: '최신 연식 순' },
];

export default function TopFilter({
  sortBy,
  onSortChange,
  totalCount,
  viewType,
  onViewTypeChange,
  globalCars,
  globalFilters,
  onApplyFilters,
  checkFilterMatch,
}: TopFilterProps) {
  const [openedModal, setOpenedModal] = useState<string | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false); // 🌟 커스텀 셀렉트 Open 상태
  const dropdownRef = useRef<HTMLDivElement>(null); // 🌟 바깥 클릭 감지용 Ref

  const [localFilters, setLocalFilters] = useState<FilterState>({
    ...globalFilters,
  });

  useEffect(() => {
    setLocalFilters({ ...globalFilters });
  }, [globalFilters, openedModal]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // 현재 정렬 값의 한글 레이블 찾기
  const currentSortLabel = useMemo(() => {
    return (
      SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || '최근등록순'
    );
  }, [sortBy]);

  const handleOpenModal = (type: string) => {
    setOpenedModal(openedModal === type ? null : type);
  };

  const handleResetLocal = (type: keyof FilterState) => {
    setLocalFilters((prev) => ({
      ...prev,
      [type]: type === 'fuel' || type === 'carShape' ? [] : 'all',
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    setOpenedModal(null);
  };

  // 실시간 필터 대수 프리뷰 카운트
  const previewCount = useMemo(() => {
    return globalCars.filter((car) => checkFilterMatch(car, localFilters))
      .length;
  }, [globalCars, localFilters, checkFilterMatch]);

  // 📌 2. 헬퍼 기능: 타입별 스텝 매핑 반환
  const getSteps = (type: 'year' | 'mileage' | 'price') => {
    if (type === 'year') return YEAR_STEPS;
    if (type === 'mileage') return MILEAGE_STEPS;
    return PRICE_STEPS;
  };

  // 📌 3. 부모의 실제 값 -> 슬라이더용 인덱스 [왼쪽 thumb, 오른쪽 thumb] 변환
  const getSliderIndices = (type: 'year' | 'mileage' | 'price') => {
    const steps = getSteps(type);
    const maxIdx = steps.length + 1; // 가상 최대 인덱스
    const currentVal = localFilters[type];

    if (currentVal === 'all') return [0, maxIdx];

    const [minVal, maxVal] = currentVal;
    const leftIdx = minVal === 0 ? 0 : steps.indexOf(minVal) + 1;
    const rightIdx = maxVal === Infinity ? maxIdx : steps.indexOf(maxVal) + 1;

    return [leftIdx === 0 ? 0 : leftIdx, rightIdx === 0 ? maxIdx : rightIdx];
  };

  // 📌 4. 단 단위 한글 치환 포맷터
  const formatValueLabel = (
    type: 'year' | 'mileage' | 'price',
    val: number,
  ) => {
    if (type === 'year') return `${val}년`;
    if (type === 'mileage') return `${val / 10000}만km`;
    if (type === 'price') {
      if (val === 10000) return '1억원';
      return `${val}만원`;
    }
    return String(val);
  };

  // 📌 5. 요구사항 구현: 0~11 가상 단계를 바탕으로 동적 레이블 텍스트 렌더링
  const getRangeLabel = (type: 'year' | 'mileage' | 'price') => {
    const steps = getSteps(type);
    const [leftIdx, rightIdx] = getSliderIndices(type);
    const maxIdx = steps.length + 1;

    if (leftIdx === 0 && rightIdx === maxIdx) return '전체';

    const leftText =
      leftIdx === 0 ? '' : formatValueLabel(type, steps[leftIdx - 1]);
    const rightText =
      rightIdx === maxIdx ? '' : formatValueLabel(type, steps[rightIdx - 1]);

    if (leftIdx === 0) return `~ ${rightText}`;
    if (rightIdx === maxIdx) return `${leftText} ~`;
    return `${leftText} ~ ${rightText}`;
  };

  // 📌 6. 슬라이더 바 변경 핸들러 (인덱스 -> 부모의 실 데이터 규격으로 역산)
  const handleSliderChange = (
    type: 'year' | 'mileage' | 'price',
    side: 'left' | 'right',
    value: number,
  ) => {
    const steps = getSteps(type);
    const maxIdx = steps.length + 1;
    const [currentLeft, currentRight] = getSliderIndices(type);

    let nextLeft = currentLeft;
    let nextRight = currentRight;

    if (side === 'left') {
      nextLeft = Math.min(value, currentRight - 1); // 우측 thumb 충돌 방지
    } else {
      nextRight = Math.max(value, currentLeft + 1); // 좌측 thumb 충돌 방지
    }

    // 인덱스를 활용해 실제 데이터값 치환 생성
    if (nextLeft === 0 && nextRight === maxIdx) {
      setLocalFilters((p) => ({ ...p, [type]: 'all' }));
    } else {
      const realMin = nextLeft === 0 ? 0 : steps[nextLeft - 1];
      const realMax = nextRight === maxIdx ? Infinity : steps[nextRight - 1];
      setLocalFilters((p) => ({ ...p, [type]: [realMin, realMax] }));
    }
  };

  return (
    <div className={s['top-filter']}>
      <div className={s['option-filter-container']}>
        <button type="button" className={s['filter-btn-main']}>
          전체 필터
          <div className={s['svg-box']}>
            <FilterOption width="100%" height="100%" viewBox="0 0 24 24" />
          </div>
        </button>

        <span className={s['line']} />

        <div className={s['modal-trigger-wrapper']}>
          {(['year', 'mileage', 'price', 'fuel', 'carShape'] as const).map(
            (type) => {
              const labelMap = {
                year: '연식',
                mileage: '주행거리',
                price: '가격',
                fuel: '연료',
                carShape: '차체',
              };
              const isRangeType =
                type === 'year' || type === 'mileage' || type === 'price';

              // 필터가 활성화 상태(all이 아니거나 배열에 값이 있을 때)인지 체크
              const hasActiveValue = isRangeType
                ? globalFilters[type] !== 'all'
                : globalFilters[type].length > 0;

              return (
                <div key={type} className={s['modal-anchor']}>
                  <button
                    type="button"
                    className={`${s['filter-pill']} ${openedModal === type ? s['is-open'] : ''} ${hasActiveValue ? s['has-value'] : ''}`}
                    onClick={() => handleOpenModal(type)}
                  >
                    {labelMap[type]}
                  </button>

                  {openedModal === type && (
                    <div className={s['filter-modal-window']}>
                      <div className={s['modal-body']}>
                        {/* 🌟 수정 구역: 연식 / 주행거리 / 가격 가상 1단계 오버 플로우 슬라이더 엔진 */}
                        {isRangeType && (
                          <div className={s['slider-container']}>
                            <div className={s['modal-row']}>
                              <div className={s['range-title']}>
                                {FILTER_LABEL_MAP[type]}
                              </div>

                              <label className={s['range-display-text']}>
                                {getRangeLabel(type)}
                              </label>
                            </div>

                            <div className={s['range-slider-box']}>
                              {/* 🌟 [수정] 두 Thumb 사이의 영역에 채워질 색상을 linear-gradient 백그라운드로 동적 계산 처리 */}
                              {(() => {
                                const [leftIdx, rightIdx] =
                                  getSliderIndices(type);
                                const maxSteps = getSteps(type).length + 1;
                                const leftPercent = (leftIdx / maxSteps) * 100;
                                const rightPercent =
                                  (rightIdx / maxSteps) * 100;

                                return (
                                  <div
                                    className={s['slider-track-bar']}
                                    style={{
                                      background: `linear-gradient(to right, var(--color-line-normal, #e5e5e5) ${leftPercent}%, var(--color-label-normal, #0d0d0eff) ${leftPercent}%, var(--color-label-normal, #0d0d0eff) ${rightPercent}%, var(--color-line-normal, #e5e5e5) ${rightPercent}%)`,
                                    }}
                                  />
                                );
                              })()}

                              <input
                                type="range"
                                min="0"
                                max={getSteps(type).length + 1}
                                value={getSliderIndices(type)[0]}
                                onChange={(e) =>
                                  handleSliderChange(
                                    type,
                                    'left',
                                    Number(e.target.value),
                                  )
                                }
                                className={`${s['range-input']} ${s['left-thumb']}`}
                              />
                              <input
                                type="range"
                                min="0"
                                max={getSteps(type).length + 1}
                                value={getSliderIndices(type)[1]}
                                onChange={(e) =>
                                  handleSliderChange(
                                    type,
                                    'right',
                                    Number(e.target.value),
                                  )
                                }
                                className={`${s['range-input']} ${s['right-thumb']}`}
                              />
                            </div>
                          </div>
                        )}

                        {/* 연료 / 차체 다중 선택형 버튼 격자 UI */}
                        {!isRangeType && (
                          <div className={s['grid-modal-container']}>
                            <div className={s['range-title']}>
                              {FILTER_LABEL_MAP[type]}
                            </div>

                            <div className={s['grid-selector-box']}>
                              {CONSTANTS[type as 'fuel' | 'carShape'].map(
                                (opt) => {
                                  const isChecked = (
                                    localFilters[
                                      type as 'fuel' | 'carShape'
                                    ] as string[]
                                  ).includes(opt.value);
                                  return (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      className={`${s['select-tile']} ${isChecked ? s['is-checked'] : ''}`}
                                      onClick={() => {
                                        const currentList = localFilters[
                                          type as 'fuel' | 'carShape'
                                        ] as string[];
                                        const nextList = currentList.includes(
                                          opt.value,
                                        )
                                          ? currentList.filter(
                                              (v) => v !== opt.value,
                                            )
                                          : [...currentList, opt.value];
                                        setLocalFilters((p) => ({
                                          ...p,
                                          [type]: nextList,
                                        }));
                                      }}
                                    >
                                      {opt.name}
                                    </button>
                                  );
                                },
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className={s['modal-footer']}>
                        <button
                          type="button"
                          className={s['reset-btn']}
                          onClick={() => handleResetLocal(type)}
                        >
                          초기화
                        </button>
                        <button
                          type="button"
                          className={s['submit-btn']}
                          onClick={handleApply}
                        >
                          {previewCount.toLocaleString()}대 보기
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            },
          )}
        </div>

        <button className={s['filter-btn-sub']} type="button">
          옵션
        </button>
        <button className={s['filter-btn-sub']} type="button">
          실외 색상
        </button>
        <button className={s['filter-btn-sub']} type="button">
          실내 색상
        </button>
      </div>

      <div className={s['table-filter']}>
        <div className={s['count']}>{totalCount.toLocaleString()} 대</div>

        <div className={s['filter-end']}>
          <div className={s['custom-select-container']} ref={dropdownRef}>
            <button
              type="button"
              className={`${s['select-trigger']} ${isSortOpen ? s['is-open'] : ''}`}
              onClick={() => setIsSortOpen((prev) => !prev)}
            >
              <span>{currentSortLabel}</span>
              <span className={s['arrow-icon']}>
                <div className={s['svg-box']}>
                  <FilterArrow width="100%" height="100%" viewBox="0 0 24 24" />
                </div>
              </span>
            </button>

            {isSortOpen && (
              <ul className={s['select-options-list']}>
                {SORT_OPTIONS.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      className={`${s['option-btn']} ${sortBy === opt.value ? s['is-selected'] : ''}`}
                      onClick={() => {
                        onSortChange(opt.value);
                        setIsSortOpen(false);
                      }}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <span className={s['line']} />

          <div className={s['layout-switcher-group']}>
            <button
              type="button"
              className={`${s['switch-btn']} ${viewType === 'grid' ? s['is-active'] : ''}`}
              onClick={() => onViewTypeChange('grid')}
              aria-label="바둑판형 보기"
            >
              <div className={s['svg-box']}>
                <TableBlock width="100%" height="100%" viewBox="0 0 24 24" />
              </div>
            </button>
            <button
              type="button"
              className={`${s['switch-btn']} ${viewType === 'list' ? s['is-active'] : ''}`}
              onClick={() => onViewTypeChange('list')}
              aria-label="리스트형 보기"
            >
              <div className={s['svg-box']}>
                <TableTower width="100%" height="100%" viewBox="0 0 24 24" />
              </div>
            </button>
            <button
              type="button"
              className={`${s['switch-btn']} ${viewType === 'simple' ? s['is-active'] : ''}`}
              onClick={() => onViewTypeChange('simple')}
              aria-label="단순형 보기"
            >
              <div className={s['svg-box']}>
                <TableBoard width="100%" height="100%" viewBox="0 0 24 24" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

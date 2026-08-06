// src/components/page/buy/TopFilter.tsx
'use client';

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import s from './TopFilter.module.scss';
import { FilterState } from './BuySection';
import { ToastItem } from '@/components/atoms/modal/ToastItem';
import { Modal } from '@/components/atoms/modal/Modal';

import FilterOption from '/public/svg/filter-option.svg';
import TableBlock from '/public/svg/table-block.svg';
import TableTower from '/public/svg/table-tower.svg';
import TableBoard from '/public/svg/table-board.svg';
import FilterArrow from '/public/svg/filter-arrow.svg';
import FilterReset from '/public/svg/filter-reset.svg';
import FilterClose from '/public/svg/filter-close.svg';
import ModalClose from '/public/svg/modal-close.svg';

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
  onOpenFilter: () => void;
}

interface FilterToast {
  id: number;
  message: string;
}

const YEAR_STEPS = [
  2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
];
const MILEAGE_STEPS = [
  10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000,
];
const PRICE_STEPS = [
  100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1400, 1600, 1800,
  2000, 2200, 2400, 2600, 2800, 3000, 3200, 3400, 3600, 3800, 4000, 4200, 4400,
  4600, 4800, 5000, 6000, 6500, 7000, 7500, 8000, 9000, 10000,
];

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
  onOpenFilter,
}: TopFilterProps) {
  const [openedModal, setOpenedModal] = useState<string | null>(null);
  const [isAllFilterOpen, setIsAllFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterWrapperRef = useRef<HTMLDivElement>(null);

  const [toasts, setToasts] = useState<FilterToast[]>([]);
  const [localFilters, setLocalFilters] = useState<FilterState>({
    ...globalFilters,
  });

  useEffect(() => {
    setLocalFilters({ ...globalFilters });
  }, [globalFilters, openedModal, isAllFilterOpen]);

  useEffect(() => {
    if (isAllFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAllFilterOpen]);

  const isAnyFilterActive = useMemo(() => {
    return (['year', 'mileage', 'price', 'fuel', 'carShape'] as const).some(
      (type) => {
        if (type === 'year' || type === 'mileage' || type === 'price') {
          return globalFilters[type] !== 'all';
        }
        return globalFilters[type].length > 0;
      },
    );
  }, [globalFilters]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsSortOpen(false);
      }

      if (
        filterWrapperRef.current &&
        !filterWrapperRef.current.contains(target)
      ) {
        setOpenedModal(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    // 💡 isAllFilterOpen 뿐만 아니라 openedModal이 있을 때도 스크롤을 막습니다.
    if (isAllFilterOpen || openedModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAllFilterOpen, openedModal]);

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

  const handleResetAllGlobal = () => {
    const baseFilters: FilterState = {
      year: 'all',
      mileage: 'all',
      price: 'all',
      fuel: [],
      carShape: [],
    };
    onApplyFilters(baseFilters);
    setLocalFilters(baseFilters);
  };

  const handleResetAllLocal = () => {
    setLocalFilters({
      year: 'all',
      mileage: 'all',
      price: 'all',
      fuel: [],
      carShape: [],
    });
  };

  const renderAllFilterFooter = () => (
    <div className={s['all-filter-footer']}>
      <button
        type="button"
        className={s['reset-all-btn']}
        onClick={handleResetAllLocal}
      >
        초기화
      </button>
      <button
        type="button"
        className={s['submit-all-btn']}
        onClick={handleApply}
      >
        {previewCount.toLocaleString()}대 보기
      </button>
    </div>
  );

  const handleApply = () => {
    onApplyFilters(localFilters);
    setOpenedModal(null);
    setIsAllFilterOpen(false);
  };

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSubFilterClick = (filterName: string) => {
    const newToast: FilterToast = {
      id: Date.now() + Math.random(),
      message: `모델을 선택하면 검색할 수 있어요.`,
    };

    setToasts((prev) => {
      const nextToasts = [...prev, newToast];
      return nextToasts.length > 8 ? nextToasts.slice(1) : nextToasts;
    });
  };

  const previewCount = useMemo(() => {
    return globalCars.filter((car) => checkFilterMatch(car, localFilters))
      .length;
  }, [globalCars, localFilters, checkFilterMatch]);

  const getSteps = (type: 'year' | 'mileage' | 'price') => {
    if (type === 'year') return YEAR_STEPS;
    if (type === 'mileage') return MILEAGE_STEPS;
    return PRICE_STEPS;
  };

  const getSliderIndices = (type: 'year' | 'mileage' | 'price') => {
    const steps = getSteps(type);
    const maxIdx = steps.length + 1;
    const currentVal = localFilters[type];

    if (currentVal === 'all') return [0, maxIdx];

    const [minVal, maxVal] = currentVal;
    const leftIdx = minVal === 0 ? 0 : steps.indexOf(minVal) + 1;
    const rightIdx = maxVal === Infinity ? maxIdx : steps.indexOf(maxVal) + 1;

    return [leftIdx === 0 ? 0 : leftIdx, rightIdx === 0 ? maxIdx : rightIdx];
  };

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

  const getRangeLabel = (
    type: 'year' | 'mileage' | 'price' | 'fuel' | 'carShape',
  ) => {
    const isRangeType =
      type === 'year' || type === 'mileage' || type === 'price';

    if (isRangeType) {
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
    }

    const selectedValues = localFilters[type] as string[];

    if (!selectedValues || selectedValues.length === 0) {
      return '전체';
    }

    const firstOption = CONSTANTS[type].find(
      (opt) => opt.value === selectedValues[0],
    );
    const firstOptionName = firstOption ? firstOption.name : '';

    if (selectedValues.length === 1) {
      return firstOptionName;
    }

    return `${firstOptionName} 외 ${selectedValues.length - 1}`;
  };

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
      nextLeft = Math.min(value, currentRight - 1);
    } else {
      nextRight = Math.max(value, currentLeft + 1);
    }

    if (nextLeft === 0 && nextRight === maxIdx) {
      setLocalFilters((p) => ({ ...p, [type]: 'all' }));
    } else {
      const realMin = nextLeft === 0 ? 0 : steps[nextLeft - 1];
      const realMax = nextRight === maxIdx ? Infinity : steps[nextRight - 1];
      setLocalFilters((p) => ({ ...p, [type]: [realMin, realMax] }));
    }
  };

  const renderFilterContent = (
    type: 'year' | 'mileage' | 'price' | 'fuel' | 'carShape',
  ) => {
    const isRangeType =
      type === 'year' || type === 'mileage' || type === 'price';

    if (isRangeType) {
      const [leftIdx, rightIdx] = getSliderIndices(type);
      const maxSteps = getSteps(type).length + 1;
      const leftPercent = (leftIdx / maxSteps) * 100;
      const rightPercent = (rightIdx / maxSteps) * 100;

      return (
        <div className={s['slider-container']}>
          <div className={s['modal-row']}>
            <div className={s['title-wrapper']}>
              {openedModal === type && (
                <div className={s['button-wrapper']}>
                  <button
                    className={s['modal-close-button']}
                    type="button"
                    onClick={() => setOpenedModal(null)}
                  >
                    <div className={s['svg-box']}>
                      <ModalClose
                        width="100%"
                        height="100%"
                        viewBox="0 0 24 24"
                      />
                    </div>
                  </button>
                </div>
              )}

              <div className={s['range-title']}>{FILTER_LABEL_MAP[type]}</div>
            </div>

            <div className={`${s['range-title']} ${s['mobile-title']}`}>
              {FILTER_LABEL_MAP[type]}
            </div>

            <label className={s['range-display-text']}>
              {getRangeLabel(type)}
            </label>
          </div>
          <div className={s['range-slider-box']}>
            <div
              className={s['slider-track-bar']}
              style={{
                background: `linear-gradient(to right, var(--color-line-normal, #e5e5e5) ${leftPercent}%, var(--color-label-normal, #0d0d0eff) ${leftPercent}%, var(--color-label-normal, #0d0d0eff) ${rightPercent}%, var(--color-line-normal, #e5e5e5) ${rightPercent}%)`,
              }}
            />
            <input
              type="range"
              min="0"
              max={maxSteps}
              value={leftIdx}
              onChange={(e) =>
                handleSliderChange(type, 'left', Number(e.target.value))
              }
              className={`${s['range-input']} ${s['left-thumb']}`}
            />
            <input
              type="range"
              min="0"
              max={maxSteps}
              value={rightIdx}
              onChange={(e) =>
                handleSliderChange(type, 'right', Number(e.target.value))
              }
              className={`${s['range-input']} ${s['right-thumb']}`}
            />
          </div>
        </div>
      );
    }

    return (
      <div className={s['grid-modal-container']}>
        <div className={s['title-wrapper']}>
          {openedModal === type && (
            <div className={s['button-wrapper']}>
              <button
                className={s['modal-close-button']}
                type="button"
                onClick={() => setOpenedModal(null)}
              >
                <div className={s['svg-box']}>
                  <ModalClose width="100%" height="100%" viewBox="0 0 24 24" />
                </div>
              </button>
            </div>
          )}

          <div className={s['range-title']}>{FILTER_LABEL_MAP[type]}</div>
        </div>

        <div className={`${s['range-title']} ${s['mobile-title']}`}>
          {FILTER_LABEL_MAP[type]}
        </div>

        <div className={s['grid-selector-box']}>
          {CONSTANTS[type as 'fuel' | 'carShape'].map((opt) => {
            const isChecked = (
              localFilters[type as 'fuel' | 'carShape'] as string[]
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
                  const nextList = currentList.includes(opt.value)
                    ? currentList.filter((v) => v !== opt.value)
                    : [...currentList, opt.value];
                  setLocalFilters((p) => ({ ...p, [type]: nextList }));
                }}
              >
                {opt.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${s['top-filter']} ${openedModal ? s['has-open-modal'] : ''}`}
    >
      <div className={s['option-filter-container']}>
        <div className={s['sticky-wrap']}>
          <div className={s['option-filter-wrap']} ref={filterWrapperRef}>
            <button
              type="button"
              className={`${s['filter-btn-main']} ${isAnyFilterActive && s['active-filter']}`}
              onClick={() => setIsAllFilterOpen(true)}
            >
              전체 필터
              <div className={s['svg-box']}>
                <FilterOption width="100%" height="100%" viewBox="0 0 24 24" />
              </div>
            </button>

            <span className={s['line']} />

            <button
              type="button"
              className={`${s['filter-btn-main']} ${s['mobile-filter-open-btn']}`}
              onClick={onOpenFilter}
            >
              <div className={s['svg-box']}>
                <FilterOption width="100%" height="100%" viewBox="0 0 24 24" />
              </div>
              모델 검색
            </button>

            <div className={s['modal-trigger-wrapper']}>
              {(['year', 'mileage', 'price', 'fuel', 'carShape'] as const).map(
                (type) => {
                  const isRangeType =
                    type === 'year' || type === 'mileage' || type === 'price';
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
                        {hasActiveValue
                          ? getRangeLabel(type)
                          : FILTER_LABEL_MAP[type]}
                      </button>

                      {openedModal === type && (
                        <>
                          <div className={s['pc-modal-only']}>
                            <div
                              className={`${s['filter-modal-window']} ${openedModal && s['active']}`}
                            >
                              <div className={s['modal-body']}>
                                {renderFilterContent(type)}
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
                          </div>
                        </>
                      )}
                    </div>
                  );
                },
              )}
            </div>

            <button
              className={s['filter-btn-sub']}
              type="button"
              onClick={() => handleSubFilterClick('옵션')}
            >
              옵션
            </button>
            <button
              className={s['filter-btn-sub']}
              type="button"
              onClick={() => handleSubFilterClick('실외 색상')}
            >
              실외 색상
            </button>
            <button
              className={s['filter-btn-sub']}
              type="button"
              onClick={() => handleSubFilterClick('실내 색상')}
            >
              실내 색상
            </button>
          </div>
        </div>

        {isAnyFilterActive && (
          <button
            type="button"
            className={s['clear-all-pill-btn']}
            onClick={handleResetAllGlobal}
          >
            필터 초기화{' '}
            <div className={s['svg-box']}>
              <FilterReset width="100%" height="100%" viewBox="0 0 15 15" />
            </div>
          </button>
        )}
      </div>

      <Modal
        className={s['all-modal-body']}
        isOpen={isAllFilterOpen}
        onClose={() => setIsAllFilterOpen(false)}
        title="전체 필터"
        footer={renderAllFilterFooter()}
      >
        {(['year', 'mileage', 'price', 'fuel', 'carShape'] as const).map(
          (type, index, array) => (
            <React.Fragment key={`all-${type}`}>
              <div className={s['all-filter-section']}>
                {renderFilterContent(type)}
              </div>
              {index < array.length && <hr className={s['filter-divider']} />}
            </React.Fragment>
          ),
        )}

        <div className={s['slider-container']}>
          <div className={s['modal-row']}>
            <div className={s['range-title']}>옵션</div>
          </div>

          <div className={s['range-slider-box']}>
            <div className={s['option-text']}>
              모델을 선택하면 검색할 수 있어요
            </div>
          </div>
        </div>

        <hr className={s['filter-divider']} />

        <div className={s['slider-container']}>
          <div className={s['modal-row']}>
            <div className={s['range-title']}>실외 색상</div>
          </div>

          <div className={s['range-slider-box']}>
            <div className={s['option-text']}>
              모델을 선택하면 검색할 수 있어요
            </div>
          </div>
        </div>

        <hr className={s['filter-divider']} />

        <div className={s['slider-container']}>
          <div className={s['modal-row']}>
            <div className={s['range-title']}>실내 색상</div>
          </div>

          <div className={s['range-slider-box']}>
            <div className={s['option-text']}>
              모델을 선택하면 검색할 수 있어요
            </div>
          </div>
        </div>
      </Modal>

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

      {openedModal && (
        <div className={s['mobile-modal-only']}>
          <div
            className={s['modal-overlay']}
            onClick={() => setOpenedModal(null)}
          />
          <div className={`${s['filter-modal-window']} ${s['active']}`}>
            <div className={s['modal-body']}>
              {renderFilterContent(openedModal as any)}
            </div>
            <div className={s['modal-footer']}>
              <button
                type="button"
                className={s['reset-btn']}
                onClick={() => handleResetLocal(openedModal as any)}
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
        </div>
      )}

      {toasts.length > 0 && (
        <div className={s['toast-container']}>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onExpiry={removeToast} />
          ))}
        </div>
      )}
    </div>
  );
}

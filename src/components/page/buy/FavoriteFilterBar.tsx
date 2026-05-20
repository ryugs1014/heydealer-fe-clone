// src/components/page/buy/FavoriteFilterBar.tsx
'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import s from './FavoriteFilterbar.module.scss';
import TableBlock from '/public/svg/table-block.svg';
import TableTower from '/public/svg/table-tower.svg';
import TableBoard from '/public/svg/table-board.svg';
import FilterArrow from '/public/svg/filter-arrow.svg';

interface FavoriteFilterBarProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  totalCount: number;
  viewType: 'grid' | 'list' | 'simple';
  onViewTypeChange: (value: 'grid' | 'list' | 'simple') => void;
}

const SORT_OPTIONS = [
  { value: 'latest', label: '최근 등록 순' },
  { value: 'price-low', label: '낮은 가격 순' },
  { value: 'price-high', label: '높은 가격 순' },
  { value: 'mileage-low', label: '짧은 주행 순' },
  { value: 'mileage-high', label: '긴 주행 순' },
  { value: 'year-high', label: '최신 연식 순' },
];

export default function FavoriteFilterBar({
  sortBy,
  onSortChange,
  totalCount,
  viewType,
  onViewTypeChange,
}: FavoriteFilterBarProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 감지 (모달 내부 드롭다운 차단 대응)
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

  const currentSortLabel = useMemo(() => {
    return (
      SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || '최근 등록 순'
    );
  }, [sortBy]);

  return (
    <div className={s['table-filter']}>
      {/* 💡 요구사항 반영: 찜한 차량 총 개수 출력 */}
      <div className={s['count']}>
        찜한 차 <span>{totalCount.toLocaleString()}</span>
      </div>

      <div className={s['filter-end']}>
        {/* 커스텀 정렬 셀렉트 박스 */}
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

        {/* 독립형 레이아웃 스위처 */}
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
  );
}

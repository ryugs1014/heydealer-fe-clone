// src/components/page/buy/TopFilter.tsx
'use client';

import React from 'react';
import s from './TopFilter.module.scss';
import FilterOption from '/public/svg/filter-option.svg';

interface TopFilterProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  totalCount: number; // 📌 부모에게 전달받을 총 차량 개수
}

export default function TopFilter({
  sortBy,
  onSortChange,
  totalCount,
}: TopFilterProps) {
  return (
    <div className={s['top-filter']}>
      <div className={s['option-filter-container']}>
        <button type="button">
          전체 필터{' '}
          <div className={s['svg-box']}>
            <FilterOption width="100%" height="100%" viewBox="0 0 24 24" />
          </div>
        </button>

        <span className={s['line']} />

        <button type="button">연식</button>
        <button type="button">주행거리</button>
        <button type="button">가격</button>
        <button type="button">연료</button>
        <button type="button">차체</button>
        <button type="button">옵션</button>
        <button type="button">실외 색상</button>
        <button type="button">실내 색상</button>
      </div>

      <div className={s['table-filter']}>
        <div className={s['count']}>{totalCount.toLocaleString()} 대</div>

        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          <option value="latest">최근등록순</option>
          <option value="price-low">가격낮은순</option>
          <option value="price-high">가격높은순</option>
        </select>
      </div>
    </div>
  );
}

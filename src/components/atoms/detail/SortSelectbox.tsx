'use client';

import React, { useState, useRef, useEffect } from 'react';
import s from './SortSelectbox.module.scss';
import Arrow from '/public/svg/filter-arrow.svg';

interface Option {
  label: string;
  value: string;
}

interface SortSelectboxProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SortSelectbox({
  options,
  value,
  onChange,
  className = '',
}: SortSelectboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectboxRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectboxRef.current &&
        !selectboxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  // 현재 선택된 값의 label 찾기
  const currentLabel = options.find((opt) => opt.value === value)?.label || '';

  return (
    <div
      className={`${s['sort-selectbox-container']} ${className}`.trim()}
      ref={selectboxRef}
    >
      <button
        type="button"
        className={`${s['trigger-btn']} ${isOpen ? s['open'] : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentLabel}
        <span className={`${s['icon']}  ${isOpen ? s['open'] : ''}`}>
          <Arrow width="100%" height="100%" viewBox="0 0 24 24" />
        </span>
      </button>

      {isOpen && (
        <ul className={s['dropdown-list']}>
          {options.map((option) => (
            <li
              key={option.value}
              className={`${s['dropdown-item']} ${option.value === value ? s['selected'] : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

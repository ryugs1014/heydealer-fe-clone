'use client';

import React, { useState, useRef, useEffect } from 'react';
import s from './Selectbox.module.scss';
import Arrow from '/public/svg/filter-arrow.svg';
import Check from '/public/svg/check.svg';

interface SelectboxProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export default function Selectbox({
  options,
  value,
  onChange,
  className = '',
}: SelectboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectboxRef = useRef<HTMLDivElement>(null);

  // 드롭다운 내부에서만 조작되는 임시 선택 상태
  const [tempSelected, setTempSelected] = useState<string[]>(value);

  // 드롭다운이 열릴 때마다 부모의 value 값으로 임시 상태 동기화
  useEffect(() => {
    if (isOpen) {
      if (value.length === 1 && value[0] === '등급 전체') {
        setTempSelected([]);
      } else {
        setTempSelected(value);
      }
    }
  }, [isOpen, value]);

  // 외부 클릭 시 드롭다운 닫기
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

  // 체크박스 토글 로직
  const handleToggleOption = (option: string) => {
    if (option === '등급 전체') {
      const isAllChecked = options.every((o) => tempSelected.includes(o));

      if (isAllChecked) {
        setTempSelected([]);
      } else {
        setTempSelected([...options]);
      }
    } else {
      let next = [...tempSelected];

      if (next.includes(option)) {
        next = next.filter((o) => o !== option && o !== '등급 전체');
      } else {
        next.push(option);

        const allOthers = options.filter((o) => o !== '등급 전체');
        const hasAllOthers = allOthers.every((o) => next.includes(o));
        if (hasAllOthers) {
          next.push('등급 전체');
        }
      }
      setTempSelected(next);
    }
  };

  // 초기화 버튼: UI 상으론 모두 체크 해제 (빈 배열)
  const handleReset = () => {
    setTempSelected([]);
  };

  // 적용 버튼: 빈 배열(아무것도 선택 안 됨)이면 기능적으로 ['전체']를 부모에게 전달
  const handleApply = () => {
    const finalSelection =
      tempSelected.length === 0 ? ['등급 전체'] : tempSelected;
    onChange(finalSelection);
    setIsOpen(false);
  };

  // 버튼에 보여줄 텍스트 가공
  const displayValue = () => {
    if (value.includes('등급 전체') || value.length === 0) return '등급 전체';
    if (value.length === 1) return value[0];
    return `${value[0]} 외 ${value.length - 1}`;
  };

  return (
    <div
      className={`${s['selectbox-container']} ${className}`.trim()}
      ref={selectboxRef}
    >
      <button
        type="button"
        className={`${s['trigger-btn']} ${isOpen ? s['open'] : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {displayValue()}
        <span className={`${s['icon']}  ${isOpen ? s['open'] : ''}`}>
          <Arrow width="100%" height="100%" viewBox="0 0 24 24" />
        </span>
      </button>

      {isOpen && (
        <div className={s['dropdown-panel']}>
          <div className={s['dropdown-wrap']}>
            <ul className={s['dropdown-list']}>
              {options.map((option) => {
                const isChecked = tempSelected.includes(option);

                return (
                  <React.Fragment key={option}>
                    <li
                      className={s['dropdown-item']}
                      onClick={() => handleToggleOption(option)}
                    >
                      <label className={s['checkbox-label']}>
                        {/* ⭐ 커스텀 SVG 체크박스 영역 */}
                        <div
                          className={`${s['checkbox-wrap']} ${isChecked ? s['active'] : ''}`}
                        >
                          {isChecked ? (
                            <div className={s['svg-box']}>
                              <Check
                                width="100%"
                                height="100%"
                                viewBox="0 0 20 20"
                              />
                            </div>
                          ) : (
                            ''
                          )}
                        </div>

                        <span>{option}</span>
                      </label>
                    </li>

                    {/* 구분선 */}
                    {option === '등급 전체' && (
                      <div className={s['divider-line']} />
                    )}
                  </React.Fragment>
                );
              })}
            </ul>
          </div>

          <div className={s['dropdown-footer']}>
            <button className={s['reset-btn']} onClick={handleReset}>
              초기화
            </button>
            <button className={s['apply-btn']} onClick={handleApply}>
              적용
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

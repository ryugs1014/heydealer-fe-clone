// src/components/atoms/detail/InfoRow.tsx
import React from 'react';
import Image from 'next/image';
import s from './InfoRow.module.scss';
import Info from '/public/svg/info.svg';

// 툴팁 구조 정의
interface LabelTooltip {
  title?: string;
  text?: string;
}
interface ValueTooltip {
  text?: string;
  imageUrl?: string;
}

interface InfoRowProps {
  label?: string;
  value?: React.ReactNode;
  labelTooltip?: LabelTooltip; // 라벨 툴팁 텍스트 (존재하면 아이콘 표시)
  valueTooltip?: ValueTooltip; // 밸류 툴팁 데이터 (텍스트 및 이미지)
  small?: boolean;
}

// 기본 Info 아이콘 (필요시 프로젝트 내 svg 파일로 교체하세요)
const InfoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 16V12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="8" r="1.5" fill="currentColor" />
  </svg>
);

export default function InfoRow({
  label,
  value,
  labelTooltip,
  valueTooltip,
  small = false,
}: InfoRowProps) {
  return (
    <div
      className={`${s['row-wrap']} ${!label ? s['label-only'] : ''} ${!value ? s['value-only'] : ''} ${small ? s['small'] : ''}`}
    >
      {label && (
        <div className={s['item-wrap']}>
          <span className={s['label']}>{label}</span>
          {labelTooltip && (
            <div className={s['tooltip-container']}>
              <button type="button" className={s['info-icon']}>
                <Info width="100%" height="100%" viewBox="0 0 24 24" />
              </button>
              <div className={s['tooltip']}>
                {labelTooltip.title && (
                  <p className={s['tooltip-title']}>{labelTooltip.title}</p>
                )}
                {labelTooltip.text && (
                  <pre className={s['tooltip-text']}>{labelTooltip.text}</pre>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Value 영역 */}
      {value && (
        <div className={s['item-wrap']}>
          <span className={s['value']}>{value}</span>
          {valueTooltip && (
            <div className={s['tooltip-container']}>
              <button type="button" className={s['info-icon']}>
                <Info width="100%" height="100%" viewBox="0 0 24 24" />
              </button>
              <div className={`${s['tooltip']} ${s['value-tooltip']}`}>
                {valueTooltip.text && (
                  <p className={s['tooltip-text']}>{valueTooltip.text}</p>
                )}

                {valueTooltip.imageUrl && (
                  <div className={s['tooltip-image']}>
                    <div className={`${s['img-wrap']} img-wrap`}>
                      <Image
                        src={valueTooltip.imageUrl}
                        alt="tooltip detail"
                        width={1}
                        height={1}
                        sizes="(max-width: 1200px) 100vw, auto"
                        style={{
                          width: 'auto',
                          height: 'auto',
                          maxWidth: '100%',
                        }}
                        unoptimized
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

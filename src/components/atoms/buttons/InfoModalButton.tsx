// src/components/atoms/buttons/InfoModalButton.tsx
import React from 'react';
import s from './InfoModalButton.module.scss';
import Arrow from '/public/svg/filter-arrow.svg';
import Star from '/public/img/ui/star.png';
import Image from 'next/image';

interface InfoModalButtonProps {
  textBefore?: string;
  highlightText?: string;
  textAfter?: string;
  onClick?: () => void;
  className?: string;
}

export default function InfoModalButton({
  textBefore,
  highlightText,
  textAfter,
  onClick,
  className = '',
}: InfoModalButtonProps) {
  return (
    <button
      type="button"
      className={`${s['info-modal-button']} ${className}`.trim()}
      onClick={onClick}
    >
      <div className={s['button-forward']}>
        <div className={`${s['img-wrap']} img-wrap`}>
          <Image src={Star} alt={`star`} fill sizes="15vw" />
        </div>

        <div className={s['button-text']}>
          {textBefore && `${textBefore} `}
          {highlightText && <span>{highlightText}</span>}
          {textAfter && ` ${textAfter}`}
        </div>
      </div>

      <div className={s['svg-box']}>
        <Arrow width="100%" height="100%" viewBox="0 0 24 24" />
      </div>
    </button>
  );
}

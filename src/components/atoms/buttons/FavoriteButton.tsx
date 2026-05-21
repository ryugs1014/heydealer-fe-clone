// src/components/atoms/buttons/FavoriteButton.tsx
'use client';

import React from 'react';
import s from './FavoriteButton.module.scss';
import SubDisabled from '/public/svg/sub-disabled.svg';
import SubActive from '/public/svg/sub-active.svg';
import { useFavorite } from '@/hooks/useFavorite';

interface FavoriteButtonProps {
  hashId: string; // 차량 고유 ID 필수
  className?: string;
}

export default function FavoriteButton({
  hashId,
  className,
}: FavoriteButtonProps) {
  // 전역 상태 및 토글 로직을 커스텀 훅에서 가져옴
  const { isFavorite, toggleFavorite } = useFavorite(hashId);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 카드 클릭 버블링 방지
    toggleFavorite();
  };

  return (
    <div className={`${s['button-wrap']} ${className || ''}`.trim()}>
      <button
        type="button"
        className={`${s['favorite-btn']} ${isFavorite ? s['is-active'] : ''}`}
        aria-label="즐겨찾기 등록"
        onClick={handleToggle}
      >
        <div className={s['svg-box']}>
          {isFavorite ? (
            <SubActive width="100%" height="100%" viewBox="0 0 24 24" />
          ) : (
            <SubDisabled width="100%" height="100%" viewBox="0 0 24 24" />
          )}
        </div>
      </button>
    </div>
  );
}

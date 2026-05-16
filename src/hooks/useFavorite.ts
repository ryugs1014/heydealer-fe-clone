// src/hooks/useFavorite.ts
'use client';

import { useState, useEffect } from 'react';

export function useFavorite(hashId: string) {
  // SSR 하이드레이션 에러 방지를 위해 초기값은 false
  const [isFavorite, setIsFavorite] = useState(false);

  // 1. 컴포넌트 마운트 시 로컬스토리지에서 기존 캐시 가져오기
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('car_favorites');
    if (saved) {
      try {
        const list: string[] = JSON.parse(saved);
        const hasId = list.includes(hashId);
        setIsFavorite(hasId);
        console.log(
          `[useFavorite 초기화] ID: ${hashId} | 즐겨찾기 상태: ${hasId}`,
        );
      } catch (e) {
        console.error('[useFavorite 초기화 오류]', e);
      }
    }
  }, [hashId]);

  // 2. 다른 컴포넌트나 다른 탭에서 일어난 변경 사항 구독 및 실시간 동기화
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = () => {
      const saved = localStorage.getItem('car_favorites');
      if (saved) {
        try {
          const list: string[] = JSON.parse(saved);
          setIsFavorite(list.includes(hashId));
        } catch (e) {
          console.error(e);
        }
      } else {
        setIsFavorite(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favorite_update', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favorite_update', handleStorageChange);
    };
  }, [hashId]);

  // 3. 즐겨찾기 토글 동작 함수
  const toggleFavorite = () => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('car_favorites');
    let list: string[] = [];

    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {
        list = [];
      }
    }

    let nextState = false;

    // 정상적인 if-else 문 구조로 수정 완료
    if (list.includes(hashId)) {
      // 이미 목록에 있으면 삭제
      list = list.filter((id) => id !== hashId);
      nextState = false;
    } else {
      // 목록에 없으면 추가
      list = [...list, hashId];
      nextState = true;
    }

    localStorage.setItem('car_favorites', JSON.stringify(list));
    setIsFavorite(nextState); // 현재 컴포넌트 상태 즉시 반영

    console.log(
      `[useFavorite 클릭 세션 발생] ID: ${hashId} -> 변경 완료 상태: ${nextState}`,
    );

    // 같은 창 안의 다른 컴포넌트(동일 차량 버튼 등)로 전파
    const event = new Event('favorite_update');
    window.dispatchEvent(event);
  };

  return { isFavorite, toggleFavorite };
}

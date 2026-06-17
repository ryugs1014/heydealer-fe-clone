// src/components/page/buy/RelatedCars.tsx
'use client';

import React, { useState, useEffect } from 'react';
import RelatedCarSlider from '@/components/page/buy/detail/RelatedCarSlider';
import s from './RelatedCars.module.scss';

interface RelatedCarsProps {
  currentCarId: string;
  targetModelId: string;
  targetPrice: number;
}

export default function RelatedCars({
  currentCarId,
  targetModelId,
  targetPrice,
}: RelatedCarsProps) {
  const [similarCars, setSimilarCars] = useState<any[]>([]);
  const [budgetCars, setBudgetCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchRelatedCars() {
      try {
        const res = await fetch('/api/cars');
        const carsData = await res.json();

        const otherCars = carsData.filter(
          (car: any) => car.hash_id !== currentCarId,
        );

        const similar = otherCars.filter(
          (car: any) => car.model_id === targetModelId,
        );

        const budget = otherCars.filter((car: any) => {
          const carPrice = car.price || 0;
          return carPrice >= targetPrice - 50 && carPrice <= targetPrice + 50;
        });

        setSimilarCars(similar);
        setBudgetCars(budget);
      } catch (error) {
        console.error('추천 차량 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRelatedCars();
  }, [currentCarId, targetModelId, targetPrice]);

  if (isLoading) {
    return <div className={s['loading']}>추천 차량을 불러오는 중입니다...</div>;
  }

  return (
    <section className={s['related-cars-section']}>
      {similarCars.length > 0 ? (
        <RelatedCarSlider title="비슷한 차" cars={similarCars} />
      ) : (
        ''
      )}

      {budgetCars.length > 0 ? (
        <RelatedCarSlider title="같은 예산대 추천" cars={budgetCars} />
      ) : (
        ''
      )}
    </section>
  );
}

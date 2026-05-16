// src/components/page/buy/BuySection.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import s from './BuySection.module.scss';
import LeftFilter from './LeftFilter';
import TopFilter from './TopFilter';
import ResultList from './ResultList';
import AdList from '@/components/page/buy/AdList';
import AdCardList from '@/components/page/buy/AdCardList';
import Container from '@/components/layout/Container';

export default function BuySection() {
  // 📌 API 데이터 상태 관리
  const [cars, setCars] = useState<any[]>([]);
  const [brandMap, setBrandMap] = useState<Record<string, any>>({});
  const [allBrandsList, setAllBrandsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 필터 및 정렬 상태
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('latest');

  // 📌 클라이언트 마운트 시 API 비동기 병렬 호출 실행
  useEffect(() => {
    async function initFetch() {
      try {
        const [carsRes, brandsRes] = await Promise.all([
          fetch('/api/cars'),
          fetch('/api/brands'),
        ]);

        const carsData = await carsRes.json();
        const brandsData = await brandsRes.json();

        setCars(carsData);
        setBrandMap(brandsData.brandMap);
        setAllBrandsList(brandsData.allBrandsList);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }
    initFetch();
  }, []);

  const currentBrandDetail = useMemo(() => {
    if (!selectedBrandId) return null;
    return brandMap[selectedBrandId] || null;
  }, [selectedBrandId, brandMap]);

  const handleSelectBrand = (brandId: string) => {
    setSelectedBrandId(brandId);
    setSelectedModelId(null);
  };

  const handleSelectModel = (modelId: string) => {
    setSelectedModelId(modelId);
  };

  const handleClearBrand = () => {
    setSelectedBrandId(null);
    setSelectedModelId(null);
  };

  // 💡 새롭게 바뀐 헤이딜러형 JSON 구조에 최적화된 필터 및 정렬 엔진
  const filteredAndSortedCars = useMemo(() => {
    let result = [...cars];

    // [Step A] 세부 모델 필터
    if (selectedModelId) {
      result = result.filter((car) => car.model_id === selectedModelId);
    }
    // [Step B] 브랜드 필터
    else if (selectedBrandId && currentBrandDetail) {
      const allowedModelIds = currentBrandDetail.model_groups.map(
        (m: any) => m.hash_id,
      );
      result = result.filter((car) => allowedModelIds.includes(car.model_id));
    }

    // [Step C] 고속 정렬 (기존 정규식 replace 파싱 제거로 CPU 연산 속도 대폭 개선)
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // 최근등록순 (제공된 날짜 타임스탬프 기반 정렬)
      result.sort((a, b) => {
        const dateA = new Date(a.detail_info?.offered_at || 0).getTime();
        const dateB = new Date(b.detail_info?.offered_at || 0).getTime();
        return dateB - dateA;
      });
    }

    return result;
  }, [cars, selectedBrandId, selectedModelId, currentBrandDetail, sortBy]);

  if (isLoading) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center' }}>
        데이터를 안전하게 불러오는 중입니다...
      </div>
    );
  }

  return (
    <section className={s['buy-section']}>
      <Container size={'md'}>
        <div className={s['content-container']}>
          <aside className={s['left-aside']}>
            <div className={s['ad-list-container']}>
              <AdList />
              <AdCardList />
            </div>
            <span className={s['line']} />
            <LeftFilter
              allBrands={allBrandsList}
              currentBrandDetail={currentBrandDetail}
              selectedModelId={selectedModelId}
              onSelectBrand={handleSelectBrand}
              onSelectModel={handleSelectModel}
              onClearBrand={handleClearBrand}
            />
          </aside>

          <div className={s['right-content']}>
            <TopFilter
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalCount={filteredAndSortedCars.length}
            />
            <ResultList cars={filteredAndSortedCars} />
          </div>
        </div>
      </Container>
    </section>
  );
}

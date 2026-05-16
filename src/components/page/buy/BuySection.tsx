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

export interface FilterState {
  year: [number, number] | 'all';
  mileage: [number, number] | 'all';
  price: [number, number] | 'all';
  fuel: string[];
  carShape: string[];
}

export default function BuySection() {
  const [cars, setCars] = useState<any[]>([]);
  const [brandMap, setBrandMap] = useState<Record<string, any>>({});
  const [allBrandsList, setAllBrandsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 기존 필터 및 정렬 상태
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('latest');

  // 🌟 1. 레이아웃 뷰타입 상태 ('grid' | 'list' | 'simple')
  const [viewType, setViewType] = useState<'grid' | 'list' | 'simple'>('grid');

  // 🌟 2. 상단 상점용 다차원 필터 통합 상태
  const [filters, setFilters] = useState<FilterState>({
    year: 'all',
    mileage: 'all',
    price: 'all',
    fuel: [],
    carShape: [],
  });

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

  // 🌟 3. 데이터 필터링 조건 전용 헬퍼 함수 (Live Count 연산과 공유)
  const checkFilterMatch = (car: any, currentFilters: FilterState) => {
    const info = car.detail_info;

    // [가상 가공] 제공된 Mock 데이터에 없는 연료/차체 속성을 테스트용으로 매핑
    const mockFuel =
      car.hash_id === 'Oyo53DQD'
        ? 'hybrid'
        : car.hash_id === 'Vym1K7y6'
          ? 'lpg'
          : 'gasoline';
    const mockShape = info?.model_name?.includes('스파크') ? 'small' : 'sedan';

    // A. 연식 필터링
    if (currentFilters.year !== 'all') {
      const yearVal = info?.year || 0;
      if (yearVal < currentFilters.year[0] || yearVal > currentFilters.year[1])
        return false;
    }

    // B. 주행거리 필터링
    if (currentFilters.mileage !== 'all') {
      const mileageVal = info?.mileage || 0;
      if (
        mileageVal < currentFilters.mileage[0] ||
        mileageVal > currentFilters.mileage[1]
      )
        return false;
    }

    // C. 가격 필터링
    if (currentFilters.price !== 'all') {
      const priceVal = car.price || 0;
      if (
        priceVal < currentFilters.price[0] ||
        priceVal > currentFilters.price[1]
      )
        return false;
    }

    // D. 연료 필터링
    if (
      currentFilters.fuel.length > 0 &&
      !currentFilters.fuel.includes(mockFuel)
    )
      return false;

    // E. 차체 필터링
    if (
      currentFilters.carShape.length > 0 &&
      !currentFilters.carShape.includes(mockShape)
    )
      return false;

    return true;
  };

  // 🌟 4. 최종 필터링 및 정렬 처리 엔진
  const filteredAndSortedCars = useMemo(() => {
    let result = cars.filter((car) => checkFilterMatch(car, filters));

    // 세부 모델 및 브랜드 필터 결합
    if (selectedModelId) {
      result = result.filter((car) => car.model_id === selectedModelId);
    } else if (selectedBrandId && currentBrandDetail) {
      const allowedModelIds = currentBrandDetail.model_groups.map(
        (m: any) => m.hash_id,
      );
      result = result.filter((car) => allowedModelIds.includes(car.model_id));
    }

    // 정렬 엔진
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else {
      result.sort((a, b) => {
        const dateA = new Date(a.detail_info?.offered_at || 0).getTime();
        const dateB = new Date(b.detail_info?.offered_at || 0).getTime();
        return dateB - dateA;
      });
    }

    return result;
  }, [
    cars,
    selectedBrandId,
    selectedModelId,
    currentBrandDetail,
    sortBy,
    filters,
  ]);

  if (isLoading) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center' }}>
        데이터를 불러오는 중입니다...
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
              onSelectBrand={setSelectedBrandId}
              onSelectModel={setSelectedModelId}
              onClearBrand={() => {
                setSelectedBrandId(null);
                setSelectedModelId(null);
              }}
            />
          </aside>

          <div className={s['right-content']}>
            {/* 상단 통합 필터 바 컴포넌트 */}
            <TopFilter
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalCount={filteredAndSortedCars.length}
              viewType={viewType}
              onViewTypeChange={setViewType}
              globalCars={cars}
              globalFilters={filters}
              onApplyFilters={setFilters}
              checkFilterMatch={checkFilterMatch}
            />
            {/* 동적 뷰타입 클래스를 전달받는 리스트 컴포넌트 */}
            <ResultList cars={filteredAndSortedCars} viewType={viewType} />
          </div>
        </div>
      </Container>
    </section>
  );
}

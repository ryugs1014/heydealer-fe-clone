// src/app/buy/[hash_id]/page.tsx
import React from 'react';
import s from '@/components/page/buy/BuySection.module.scss';
import Container from '@/components/layout/Container';
import CarDetailWrapper from '@/components/page/buy/detail/CarDetailWrapper';

interface DetailPageProps {
  params: {
    hash_id: string;
  };
}

// 🌟 데이터를 안전하게 가져오는 함수
async function getCarDetail(hashId: string) {
  try {
    // 개발 환경과 배포 환경의 호스트 주소를 동적으로 설정합니다.
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = process.env.NEXT_PUBLIC_SITE_URL || 'localhost:3000';

    // 서버 컴포넌트이므로 절대 경로(http://...)로 호출해야 합니다.
    const res = await fetch(`${protocol}://${host}/api/cars`, {
      cache: 'no-store', // 항상 최신 데이터를 불러옴
    });

    if (!res.ok) return null;

    const cars: any[] = await res.json();

    // 전체 차량 리스트 중에서 URL 파라미터로 넘어온 hash_id와 일치하는 차량 찾기
    const targetCar = cars.find((car) => car.hash_id === hashId);
    return targetCar || null;
  } catch (error) {
    console.error('상세 데이터 로드 에러:', error);
    return null;
  }
}

export default async function CarDetailPage({ params }: DetailPageProps) {
  const { hash_id } = params;
  const carData = await getCarDetail(hash_id);

  // 실제로 데이터가 없을 때만 404 처리
  if (!carData) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        <h2>차량 정보를 찾을 수 없습니다.</h2>
        <p>ID: {hash_id}</p>
        <p>
          API 호출이 정상적으로 이루어졌는지, 혹은 데이터에 해당 hash_id가
          존재하는지 확인해 주세요.
        </p>
      </div>
    );
    // API 연결이 확실해지면 아래의 주석을 풀고 위 div를 지우시면 됩니다.
    // notFound();
  }

  const info = carData.detail_info;

  // const sampleVideoUrl = '/video/car-360.mp4';

  return (
    <section className={s['buy-section']}>
      <Container size={'detail'}>
        <CarDetailWrapper carData={carData} />
      </Container>
    </section>
  );
}

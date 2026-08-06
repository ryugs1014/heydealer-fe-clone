// src/components/page/buy/detail/CarDetailWrapper.tsx
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import s from './CarDetailWrapper.module.scss';
import Image from 'next/image';

import Car360Viewer from './Car360Viewer';
import MobileCarViewer from './MobileCarViewer';
import DetailModal from './DetailModal';
import Lightbox from './Lightbox';
import DetailHeader from '@/components/atoms/detail/DetailHeader';
import InfoRow from '@/components/atoms/detail/InfoRow';
import InfoModalButton from '@/components/atoms/buttons/InfoModalButton';
import DraggableCarousel from '@/components/atoms/detail/DraggableCarousel';
import FaqAccordion from '@/components/atoms/detail/FaqAccordion';
import { Modal } from '@/components/atoms/modal/Modal';
import FavoriteFilterBar from '@/components/page/buy/FavoriteFilterBar';
import ResultList from '@/components/page/buy/ResultList';
import CarReviewSection from '@/components/page/buy/detail/CarReviewSection';
import PurchaseReviewSection from '@/components/page/buy/detail/PurchaseReviewSection';
import EyeCertReport from '@/components/page/buy/detail/EyeCertReport';
import ServiceSection from '@/components/page/buy/detail/ServiceSection';
import RelatedCars from '@/components/page/buy/detail/RelatedCars';
import PurchaseInfoPanel from '@/components/page/buy/detail/PurchaseInfoPanel';

import EyeIcon from '/public/svg/eye-icon.svg';
import SubActive from '/public/svg/sub-active.svg';
import Chat from '/public/svg/chat.svg';

import faqData from '@/data/detail/faq.json';
import carReviewData from '@/data/detail/car_review.json';
import purchaseReviewData from '@/data/detail/purchase_review.json';
import Link from 'next/link';
import ArrowLeft from '/public/svg/arrow-left-big.svg';
import Arrow from '/public/svg/filter-arrow.svg';

interface CarDetailWrapperProps {
  carData: any;
}

const SECTION_MAP: { [key: string]: string } = {
  inside: '실내',
  outside: '외부',
  underbody: '하부',
  scratch: '스크래치',
};

// 1. 살균 세차 슬라이더 더미 데이터
const CARWASH_DATA = [
  {
    id: 1,
    videoUrl: '/video/detail/seat-DSFM4SWX.mp4',
    description: '시트',
  },
  {
    id: 2,
    videoUrl: '/video/detail/interior-detail-BFZd17w0.mp4',
    description: '실내 디테일',
  },
  {
    id: 3,
    videoUrl: '/video/detail/exterior-1YjOeAX4.mp4',
    description: '외관',
  },
  {
    id: 4,
    videoUrl: '/video/detail/floor-mat-BB7XapQ8.mp4',
    description: '발매트',
  },
  {
    id: 5,
    videoUrl: '/video/detail/wax-dressing-D9AeAam2.mp4',
    description: '드레싱 ∙ 물왁스',
  },
  {
    id: 6,
    videoUrl: '/video/detail/glass-cleaning-0xGXeCuv.mp4',
    description: '유리 세정',
  },
];

export default function CarDetailWrapper({ carData }: CarDetailWrapperProps) {
  // 🌟 [수정 2] Hydration 에러 방지용 마운트 상태 추가
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [targetSection, setTargetSection] = useState<string | null>(null);

  const [cars, setCars] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] =
    useState<boolean>(false);
  const [modalSortBy, setModalSortBy] = useState<string>('latest');
  const [modalViewType, setModalViewType] = useState<
    'grid' | 'list' | 'simple'
  >('grid');

  const [viewType, setViewType] = useState<'grid' | 'list' | 'simple'>('grid');

  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMobileButtonActive, setIsMobileButtonActive] =
    useState<boolean>(false);

  const info = carData?.detail_info;
  const detailImageUrls = info?.detail_image_urls || {};

  const DETAIL_SECTIONS = Object.keys(SECTION_MAP)
    .filter((key) => detailImageUrls[key] && detailImageUrls[key].length > 0)
    .map((key) => ({
      id: key,
      title: SECTION_MAP[key],
      images: detailImageUrls[key],
    }));

  const mainSections = DETAIL_SECTIONS.filter(
    (sec) => sec.id === 'outside' || sec.id === 'inside',
  );
  const scratchSection = DETAIL_SECTIONS.find((sec) => sec.id === 'scratch');
  const ALL_DETAIL_IMAGES = DETAIL_SECTIONS.flatMap(
    (section) => section.images,
  ) as string[];

  const sampleVideoUrl = '/video/car-360.mp4';

  const handleLightboxNavigate = (direction: 'prev' | 'next') => {
    if (lightboxIndex === null) return;
    if (direction === 'prev') {
      setLightboxIndex(
        (lightboxIndex - 1 + ALL_DETAIL_IMAGES.length) %
          ALL_DETAIL_IMAGES.length,
      );
    } else {
      setLightboxIndex((lightboxIndex + 1) % ALL_DETAIL_IMAGES.length);
    }
  };

  const regDate = info?.initial_registration_date;
  const formattedRegDate =
    regDate && regDate.length >= 7
      ? `${regDate.substring(0, 4)}.${regDate.substring(5, 7)}`
      : '';
  const mileageValue = info?.mileage;
  const formattedMileage = mileageValue
    ? `${mileageValue.toLocaleString()}km`
    : '0km';

  useEffect(() => {
    async function fetchAllCars() {
      try {
        const res = await fetch('/api/cars');
        const data = await res.json();
        setCars(data);
      } catch (error) {
        console.error('차량 데이터 로드 실패:', error);
      }
    }
    fetchAllCars();

    const updateFavoriteList = () => {
      const saved = localStorage.getItem('car_favorites');
      if (saved) {
        try {
          setFavoriteIds(JSON.parse(saved));
        } catch (e) {
          setFavoriteIds([]);
        }
      } else {
        setFavoriteIds([]);
      }
    };

    updateFavoriteList();

    window.addEventListener('favorite_update', updateFavoriteList);
    window.addEventListener('storage', updateFavoriteList);

    return () => {
      window.removeEventListener('favorite_update', updateFavoriteList);
      window.removeEventListener('storage', updateFavoriteList);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!gridRef.current) return;
      const gridTop = gridRef.current.getBoundingClientRect().top;
      setIsMobileButtonActive(gridTop <= 56);
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
      capture: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, []);

  // 🌟 [수정 3] 마운트 여부와 미디어쿼리 체크를 동시에 수행
  useEffect(() => {
    setIsMounted(true); // 클라이언트 렌더링이 시작되었음을 표시

    const mediaQuery = window.matchMedia('(max-width: 1500px)');
    setIsMobileScreen(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobileScreen(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const favoriteCars = useMemo(() => {
    return cars.filter((car) => favoriteIds.includes(car.hash_id));
  }, [cars, favoriteIds]);

  const sortedFavoriteCars = useMemo(() => {
    const result = [...favoriteCars];

    if (modalSortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (modalSortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (modalSortBy === 'mileage-low') {
      result.sort(
        (a, b) => (a.detail_info?.mileage || 0) - (b.detail_info?.mileage || 0),
      );
    } else if (modalSortBy === 'mileage-high') {
      result.sort(
        (a, b) => (b.detail_info?.mileage || 0) - (a.detail_info?.mileage || 0),
      );
    } else if (modalSortBy === 'year-high') {
      result.sort(
        (a, b) => (b.detail_info?.year || 0) - (a.detail_info?.year || 0),
      );
    } else {
      result.sort((a, b) => {
        const dateA = new Date(a.detail_info?.offered_at || 0).getTime();
        const dateB = new Date(b.detail_info?.offered_at || 0).getTime();
        return dateB - dateA;
      });
    }
    return result;
  }, [favoriteCars, modalSortBy]);

  const carPrice = carData?.price || 0;
  const acquisitionTax = Math.floor(carPrice * 0.07);
  const adminFee = 44;
  const insuranceFee = 5;
  const transferTotalFee = acquisitionTax + adminFee + insuranceFee;

  const transferTooltipText = `차를 구매할 때 발생하는 취등록 세금 등 구매 부대비용이에요. 예상 비용으로 정확한 금액은 명의이전시 알 수 있어요.\n차액은 이전 후 환급해드려요.\n\n[예상 비용]\n- 취등록세 : ${acquisitionTax.toLocaleString()}만원\n- 관리비용 : ${adminFee.toLocaleString()}만원\n- 성능보험료 : ${insuranceFee.toLocaleString()}만원`;

  const warrantyFee = 50;
  const deliveryFee = 5;
  const totalPurchasePrice = carPrice + transferTotalFee;

  return (
    <>
      <div className={s['main-sticky-container']}>
        <div className={s['main-content']}>
          <div className={s['video-wrap']}>
            {/* 🌟 [수정 4] dynamic 대신 직접 렌더링. 마운트 전에는 기본 뷰어(Car360Viewer)의 HTML을 미리 내려보내어 버튼이 처음부터 보이게 유지 */}
            {!isMounted || !isMobileScreen ? (
              <Car360Viewer
                videoSrc={sampleVideoUrl}
                carData={carData}
                onThumbClick={() => setIsDetailOpen(true)}
              />
            ) : (
              <MobileCarViewer
                videoSrc={sampleVideoUrl}
                carData={carData}
                onThumbClick={() => setIsDetailOpen(true)}
              />
            )}

            {info?.tags && info.tags.length > 0 && (
              <div className={s['certification-bar']}>
                <div className={s['icon']}>
                  <div className={s['svg-box']}>
                    <EyeIcon width="100%" height="100%" viewBox="0 0 70 13" />
                  </div>
                  인증
                </div>

                <span className={s['line']} />

                <div className={s['tags-container']}>
                  {info.tags.map((tag: any, idx: number) => (
                    <span key={idx} className={`${s['tag-badge']}`}>
                      {tag.text}{' '}
                      {idx !== info.tags.length - 1 && <span>·</span>}{' '}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={s['grid-container']} ref={gridRef}>
            <div className={s['detail-container']}>
              <section className={s['section-info']}>
                <DetailHeader
                  title={`${info?.model_name}`}
                  subtitle={`${info?.grade_part_name}`}
                />

                <div className={s['content-wrap']}>
                  <div className={s['data-grid']}>
                    <InfoRow
                      label="연식"
                      value={`${info?.year}년형 (${formattedRegDate})`}
                    />
                    <InfoRow label="주행거리" value={`${formattedMileage}`} />
                    <InfoRow label="변속기" value={`오토(A/T)`} />
                    <InfoRow
                      label="사고"
                      value={
                        <button className={s['modal-button']}>
                          완전무사고
                        </button>
                      }
                    />
                    <InfoRow
                      label="자차 보험처리"
                      value={<button className={s['modal-button']}>0건</button>}
                    />
                    <InfoRow
                      label="헤이딜러 보증"
                      value={<span>{carPrice.toLocaleString()}만원</span>}
                    />
                    <InfoRow label="환불" value={`구매 후 3일까지 무료`} />
                    <InfoRow label="실내 세차" value={`고온 스팀 살균 완료`} />
                  </div>
                </div>
              </section>

              <span className={s['section-line']} />

              <section className={s['section-info']}>
                <DetailHeader title={`색상`} />

                <div className={s['content-wrap']}>
                  <div className={`${s['data-grid']} ${s['column']}`}>
                    <InfoRow label="외부" value={`밀키 베이지`} />
                    <InfoRow label="실내" value={`검정, 인조 가죽`} />
                  </div>

                  <div className={s['image-grid']}>
                    {mainSections.map((section) => (
                      <div
                        className={s['image-container']}
                        key={section.id}
                        onClick={() => {
                          setTargetSection(section.id);
                          setIsDetailOpen(true);
                        }}
                      >
                        <div className={`${s['img-wrap']} img-wrap`}>
                          <Image
                            src={section.images[0]}
                            alt={section.title}
                            fill
                            sizes="100vw"
                          />
                        </div>

                        <div className={s['img-title']}>
                          {section.title} {section.images.length}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <span className={s['section-line']} />

              <section className={s['section-info']}>
                <DetailHeader title={`주요 옵션`} />

                <div className={s['content-wrap']}>
                  <div className={s['data-grid']}>
                    <InfoRow
                      value={`선루프`}
                      valueTooltip={{
                        text: '앞좌석 지붕에만 유리가 있는 선루프 입니다. (파노라마 선루프X)',
                        imageUrl:
                          'https://heydealer-api.s3.amazonaws.com/media/car_meta/option/2020/09/15/1355_982e729c-4ad2-46cf-b5e4-7b6c5a56cfd2.PNG',
                      }}
                    />

                    <InfoRow value={`전동접이미러`} />
                    <InfoRow
                      value={`풀오토에어컨`}
                      valueTooltip={{
                        text: '온도를 설정해두면 자동으로 유지시키는 기능(AUTO버튼 있음)과 온도, 풍량 등을 표시하는 액정이 포함된 전자식 에어컨입니다.',
                        imageUrl:
                          'https://heydealer-api.s3.amazonaws.com/media/car_meta/option/2020/09/15/1359_6ffd124e-bc13-4626-bf56-d1165ddbd762.PNG',
                      }}
                    />
                    <InfoRow
                      value={`가죽시트`}
                      valueTooltip={{
                        imageUrl:
                          'https://heydealer-api.s3.amazonaws.com/media/car_meta/option/2020/09/15/1361_6690afc4-95b0-4493-9abd-12be9eeb4d62.PNG',
                      }}
                    />
                    <InfoRow
                      value={`내비게이션(정품)`}
                      valueTooltip={{
                        text: '매립형이 아닌, 거치형 내비는 제외',
                        imageUrl:
                          'https://heydealer-api.s3.amazonaws.com/media/car_meta/option/2020/09/15/1356_5c523f3b-7c5d-4f46-acc2-cfa3bf38128f.PNG',
                      }}
                    />
                    <InfoRow
                      value={`버튼시동`}
                      valueTooltip={{
                        text: '버튼을 눌러 시동을 켜고 끌 수 있는 스마트키 기능입니다.',
                        imageUrl:
                          'https://heydealer-api.s3.amazonaws.com/media/car_meta/option/2020/09/15/1358_a99c3961-9424-4eb4-9b46-8d1849e6a1da.PNG',
                      }}
                    />
                    <InfoRow
                      value={`열선핸들`}
                      valueTooltip={{
                        text: '핸들이 따뜻해지는 기능으로 기어봉 상단 중간에 버튼이 있습니다.',
                        imageUrl:
                          'https://heydealer-api.s3.amazonaws.com/media/car_meta/option/2020/09/15/1360_c0f3c607-bc61-4a29-8f8c-9788f55b34f4.PNG',
                      }}
                    />
                    <InfoRow value={`열선시트(앞좌석)`} />
                  </div>

                  <span className={s['content-line']} />

                  <div className={s['sub-content']}>
                    <div className={s['sub-title']}>출고 정보</div>
                    <div className={s['sub-text']}>1) 내비게이션</div>
                  </div>

                  <div className={s['recommend-info']}>
                    <div className={s['sub-title']}>
                      <div className={s['svg-box']}>
                        <Chat width="100%" height="100%" viewBox="0 0 20 20" />
                      </div>
                      추천하는 이유
                    </div>

                    <pre className={s['recommend-detail']}>
                      ・ 신차 출고 후 1인 소유로 사용된 차량이에요.
                      <br />
                      <br />
                      ・ 입고 후 엔진 오일을 교환하여 소모품 교체 비용을 절감할
                      수 있어요.
                      <br />
                      <br />・ 내비게이션과 후방 카메라 등 주행 편의성을
                      더해주는 옵션들이 적용되어 있어요.
                    </pre>
                  </div>
                </div>
              </section>

              <span className={s['section-line']} />

              <section className={s['section-info']}>
                <DetailHeader title={`관리 상태`} />

                <div className={s['content-wrap']}>
                  <div className={`${s['data-grid']} ${s['info']}`}>
                    <InfoRow label="타이어" value={`앞 65%, 뒤 75% 남음`} />
                    <InfoRow
                      label="틴팅"
                      labelTooltip={{
                        title: '틴팅 농도',
                        text:
                          '자동차 창문에 특수 필름을 입히는 것으로, ‘가시광선 투과율’을 의미해요.\n' +
                          '\n' +
                          '숫자가 낮을수록 어두워지고, 높을수록 밝고 투명해져요.\n' +
                          '\n' +
                          '보통 전면 30%, 옆/후면 15%가 가장 많이 쓰이는 ‘국민 농도’예요.\n' +
                          '\n' +
                          '※ 측정값이 70% 이상이라면 틴팅이 없을 수 있어요. (제조사 기본 유리 농도 값은 7~80%입니다.)',
                      }}
                      value={`앞 35%, 옆 11%, 뒤 9%`}
                    />

                    <InfoRow label="차 키" value={`일반키 2`} />
                  </div>

                  <div className={s['sub-text']}>
                    ・ 애프터마켓 전면 엠블럼이 장착되어 있어요.
                    <br />
                    ・ 도어 선바이저가 장착되어 있어요.
                    <br />
                    <br />
                    사진으로 자세한 사용감을 확인하세요.
                  </div>

                  {scratchSection && scratchSection.images.length > 0 && (
                    <div className={`${s['image-grid']} ${s['scratch']}`}>
                      {scratchSection.images
                        .slice(0, 4)
                        .map((img: string, idx: number, array: string[]) => {
                          const isLastVisible = idx === array.length - 1;

                          return (
                            <div
                              className={s['image-container']}
                              key={idx}
                              onClick={() => {
                                setTargetSection(scratchSection?.id || null);
                                setIsDetailOpen(true);
                              }}
                            >
                              <div className={`${s['img-wrap']} img-wrap`}>
                                <Image
                                  src={img}
                                  alt={`스크래치 ${idx + 1}`}
                                  fill
                                  sizes="100vw"
                                />
                              </div>

                              {isLastVisible && (
                                <div className={s['img-title']}>+전체보기</div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </section>

              <span className={s['section-line']} />

              <section className={`${s['section-info']} ${s['single']}`}>
                <div className={s['content-wrap']}>
                  <EyeCertReport />
                </div>
              </section>

              <span className={s['section-line']} />

              <section className={s['section-info']}>
                <DetailHeader title={`보증`} />

                <div className={s['guarantee-wrap']}>
                  <div className={s['guarantee-info']}>
                    <div className={s['text-info']}>
                      <div className={s['subject']}>차체/일반 부품</div>
                      <div className={s['detail']}>보증 종료</div>
                    </div>

                    <div className={s['percent-info']}>
                      <div className={s['bar']} />
                    </div>
                  </div>

                  <div className={s['guarantee-info']}>
                    <div className={s['text-info']}>
                      <div className={s['subject']}>엔진/주요 부품</div>
                      <div className={s['detail']}>보증 종료</div>
                    </div>

                    <div className={s['percent-info']}>
                      <div className={s['bar']} />
                    </div>
                  </div>

                  <InfoModalButton
                    textBefore="모든 차량 1년"
                    highlightText="무료 보증"
                  />
                </div>
              </section>

              <span className={s['section-line']} />

              <section className={s['section-info']}>
                <DetailHeader title={`99.9% 살균 세차`} />

                <div className={s['content-wrap']}>
                  <DraggableCarousel items={CARWASH_DATA} />

                  <InfoModalButton
                    textBefore="25만원 상당"
                    highlightText="디테일링 세차 완료"
                  />
                </div>
              </section>

              <span className={s['section-line']} />

              <section className={`${s['section-info']} ${s['mobile']}`}>
                <PurchaseInfoPanel
                  carData={carData}
                  carPrice={carPrice}
                  factoryPrice={info?.factory_price}
                  transferTotalFee={transferTotalFee}
                  transferTooltipText={transferTooltipText}
                  warrantyFee={warrantyFee}
                  deliveryFee={deliveryFee}
                  totalPurchasePrice={totalPurchasePrice}
                />
              </section>

              <section className={`${s['section-info']} ${s['pc']}`}>
                <DetailHeader
                  title={`${info?.model_name}`}
                  subtitle={`타 본 사람들 이야기`}
                  subTitleSize={true}
                />

                <div className={s['content-wrap']}>
                  <CarReviewSection
                    reviews={carReviewData}
                    modelName={info?.model_name}
                  />
                </div>
              </section>

              <span className={`${s['section-line']} ${s['pc']}`} />

              <section className={`${s['section-info']} ${s['pc']}`}>
                <DetailHeader title={`구매 후기`} />

                <div className={s['content-wrap']}>
                  <PurchaseReviewSection reviews={purchaseReviewData} />
                </div>
              </section>

              <span className={s['section-line']} />

              <section className={s['section-info']}>
                <DetailHeader title={`자주 묻는 질문`} />

                <FaqAccordion data={faqData} />
              </section>

              <span className={s['section-line']} />
            </div>

            <div className={`${s['sticky-container']} ${s['pc']}`}>
              <div className={s['sticky-wrap']}>
                <PurchaseInfoPanel
                  carData={carData}
                  carPrice={carPrice}
                  factoryPrice={info?.factory_price}
                  transferTotalFee={transferTotalFee}
                  transferTooltipText={transferTooltipText}
                  warrantyFee={warrantyFee}
                  deliveryFee={deliveryFee}
                  totalPurchasePrice={totalPurchasePrice}
                />
              </div>
            </div>
          </div>

          <DetailModal
            isOpen={isDetailOpen}
            onClose={() => {
              setIsDetailOpen(false);
              setTargetSection(null);
            }}
            sections={DETAIL_SECTIONS}
            allImages={ALL_DETAIL_IMAGES}
            onImageClick={(index) => setLightboxIndex(index)}
            initialScrollId={targetSection}
          />

          <Lightbox
            index={lightboxIndex}
            images={ALL_DETAIL_IMAGES}
            onClose={() => setLightboxIndex(null)}
            onNavigate={handleLightboxNavigate}
          />
        </div>

        <div className={s['favorite-sticky-wrap']}>
          <div
            className={`${s['sticky-favorite-content']} ${viewType === 'list' ? s['list'] : ''}`}
          >
            <button
              type="button"
              className={s['favorite-modal-btn']}
              onClick={() => setIsFavoriteModalOpen(true)}
            >
              <div className={s['svg-box']}>
                <SubActive width="100%" height="100%" viewBox="0 0 24 24" />
              </div>

              <div className={s['text-box']}>
                찜한 차 <span>{favoriteCars.length}</span>
              </div>
            </button>

            <span className={s['line']} />
          </div>
        </div>

        <div className={s['connect-section']}>
          <RelatedCars
            currentCarId={carData.hash_id}
            targetModelId={carData.model_id}
            targetPrice={carData.price}
          />

          <ServiceSection />
        </div>
      </div>

      <Modal
        isOpen={isFavoriteModalOpen}
        onClose={() => setIsFavoriteModalOpen(false)}
        title="찜한차"
        showTitle={false}
        showCloseButton={true}
        className={s['favorite-modal-body']}
        maxWidth={'1064px'}
        scrollPadding={true}
      >
        <div className={s['favorite-result-wrapper']}>
          <FavoriteFilterBar
            sortBy={modalSortBy}
            onSortChange={setModalSortBy}
            totalCount={sortedFavoriteCars.length}
            viewType={modalViewType}
            onViewTypeChange={setModalViewType}
          />
          <ResultList cars={sortedFavoriteCars} viewType={modalViewType} />
        </div>
      </Modal>

      <div
        className={`${s['mobile-button-wrap']} ${isMobileButtonActive ? s['active'] : ''}`}
      >
        <Link href="/" className={s['back-link']}>
          <div className={s['back-box']}>
            <ArrowLeft width="100%" height="100%" viewBox="0 0 24 24" />
          </div>
        </Link>
      </div>
    </>
  );
}

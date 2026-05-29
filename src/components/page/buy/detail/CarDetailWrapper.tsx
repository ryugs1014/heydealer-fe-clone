// src/components/page/buy/detail/CarDetailWrapper.tsx
'use client';

import React, { useState } from 'react';
import s from './CarDetailWrapper.module.scss'; // 필요시 경로 수정

import Car360Viewer from './Car360Viewer';
import DetailModal from './DetailModal';
import Lightbox from './Lightbox';
import DetailHeader from '@/components/atoms/detail/DetailHeader';
import InfoRow from '@/components/atoms/detail/InfoRow';

import EyeIcon from '/public/svg/eye-icon.svg';
import Image from 'next/image';

interface CarDetailWrapperProps {
  carData: any;
}

// 🌟 1. '하부(underbody)'를 제외하고 맵핑 테이블을 구성합니다.
const SECTION_MAP: { [key: string]: string } = {
  outside: '외부',
  inside: '실내',
  scratch: '스크래치',
};

export default function CarDetailWrapper({ carData }: CarDetailWrapperProps) {
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [targetSection, setTargetSection] = useState<string | null>(null);

  const info = carData?.detail_info;
  const detailImageUrls = info?.detail_image_urls || {};

  const DETAIL_SECTIONS = Object.keys(SECTION_MAP)
    .filter((key) => detailImageUrls[key] && detailImageUrls[key].length > 0)
    .map((key) => ({
      id: key,
      title: SECTION_MAP[key],
      images: detailImageUrls[key],
    }));

  // 🌟 2. 외부/실내(main) 그룹과 스크래치(scratch) 그룹을 분리합니다.
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

  return (
    <>
      <div className={s['video-wrap']}>
        <Car360Viewer
          videoSrc={sampleVideoUrl}
          carData={carData}
          onThumbClick={() => setIsDetailOpen(true)}
        />

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

      <div className={s['grid-container']}>
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
                <InfoRow label="사고" value={<button>완전무사고</button>} />
                <InfoRow label="자차 보험처리" value={<button>0건</button>} />
                <InfoRow
                  label="헤이딜러 보증"
                  value={<span>{carData.price?.toLocaleString()}만원</span>}
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
            <DetailHeader
              title={`${info?.model_name}`}
              subtitle={`${info?.grade_part_name}`}
            />

            <div className={s['content-wrap']}>
              <div className={s['data-grid']}>
                <InfoRow value={`선루프`} />
                <InfoRow value={`전동접이미러`} />
                <InfoRow value={`풀오토에어컨`} />
                <InfoRow value={`가죽시트`} />
                <InfoRow value={`내비게이션(정품)`} />
                <InfoRow value={`버튼시동`} />
                <InfoRow value={`열선핸들`} />
                <InfoRow value={`열선시트(앞좌석)`} />
              </div>
            </div>
          </section>

          <span className={s['section-line']} />

          <section className={s['section-info']}>
            <DetailHeader title={`관리 상태`} />

            <div className={s['content-wrap']}>
              <div className={`${s['data-grid']} ${s['info']}`}>
                <InfoRow label="타이어" value={`앞 65%, 뒤 75% 남음`} />
                <InfoRow label="틴팅" value={`앞 35%, 옆 11%, 뒤 9%`} />
                <InfoRow label="차 키" value={`일반키 2`} />
              </div>

              <div className={s['sub-text']}>
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
        </div>

        <div className={s['sticky-container']}>
          <div className={s['sticky-content']}>스티키입니다</div>
        </div>
      </div>

      {/* 모달 및 라이트박스 */}
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
    </>
  );
}

// src/components/page/buy/detail/CarReviewSection.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/atoms/modal/Modal';
import { getTimeAgo } from '@/utils/buy/detail/dateUtils';
import Selectbox from '@/components/atoms/detail/Selectbox';
import SortSelectbox from '@/components/atoms/detail/SortSelectbox';
import s from './CarReviewSection.module.scss';

interface ReviewData {
  hash_id: string;
  owner_category: string | null;
  owner_description: string | null;
  ownership_period: string | null;
  content: string | null;
  image_url: string | null;
  year: number;
  fuel_display: string | null;
  mileage: number | null;
  grade_name: string;
  likes_count: number;
  is_liked: boolean;
  created_at: string;
}

interface CarReviewSectionProps {
  reviews: ReviewData[];
  modelName?: string;
}

const SORT_OPTIONS = [
  { label: '좋아요 많은 순', value: 'likes' },
  { label: '최신순', value: 'latest' },
];

export default function CarReviewSection({
  reviews,
  modelName,
}: CarReviewSectionProps) {
  // 모달 제어 상태
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // 필터 및 정렬 상태
  const [mainSelectedGrade, setMainSelectedGrade] =
    useState<string>('등급 전체');
  const [modalSelectedGrade, setModalSelectedGrade] = useState<string[]>([
    '등급 전체',
  ]);
  const [tempSelectedGrade, setTempSelectedGrade] =
    useState<string>('등급 전체'); // 필터 모달용 임시 상태
  const [sortBy, setSortBy] = useState<'latest' | 'likes'>('latest');

  // 스크롤 제어용
  const [targetReviewId, setTargetReviewId] = useState<string | null>(null);

  // 중복 없는 등급(grade_name) 리스트 추출
  const grades = useMemo(() => {
    const uniqueGrades = Array.from(new Set(reviews.map((r) => r.grade_name)));
    return ['등급 전체', ...uniqueGrades];
  }, [reviews]);

  // 메인 화면 미리보기 데이터 (최대 4개)
  const previewReviews = useMemo(() => {
    const filtered =
      mainSelectedGrade === '등급 전체'
        ? reviews
        : reviews.filter((r) => r.grade_name === mainSelectedGrade);
    return filtered.slice(0, 4);
  }, [reviews, mainSelectedGrade]);

  // 모달 내부 데이터 (필터 및 정렬 적용)
  const modalReviews = useMemo(() => {
    let filtered = modalSelectedGrade.includes('등급 전체')
      ? [...reviews]
      : reviews.filter((r) => modalSelectedGrade.includes(r.grade_name));

    filtered.sort((a, b) => {
      if (sortBy === 'latest') {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      return b.likes_count - a.likes_count;
    });
    return filtered;
  }, [reviews, modalSelectedGrade, sortBy]);

  // 특정 위치로 스크롤
  useEffect(() => {
    if (isReviewModalOpen && targetReviewId) {
      // 모달 렌더링 후 DOM 업데이트를 기다리기 위해 약간의 지연(setTimeout) 사용
      const timer = setTimeout(() => {
        const element = document.getElementById(`review-${targetReviewId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setTargetReviewId(null); // 스크롤 후 초기화
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isReviewModalOpen, targetReviewId, modalReviews]);

  // --- 이벤트 핸들러 ---
  const handleOpenModalWithGrade = (grade: string) => {
    setModalSelectedGrade([grade]); // 배열로 감싸기!
    setSortBy('latest');
    setIsReviewModalOpen(true);
  };

  const handleOpenModalWithReview = (hashId: string, grade: string) => {
    setModalSelectedGrade([grade]); // 배열로 감싸기!
    setTargetReviewId(hashId);
    setIsReviewModalOpen(true);
  };

  const handleOpenModalAll = () => {
    setModalSelectedGrade(['등급 전체']); // 배열로 감싸기!
    setSortBy('latest');
    setIsReviewModalOpen(true);
  };

  return (
    <div className={s['review-section']}>
      <div className={s['grade-filters']}>
        {grades.map((grade) => (
          <button
            key={grade}
            className={`${s['filter-btn']} ${mainSelectedGrade === grade ? s['active'] : ''}`}
            onClick={() => handleOpenModalWithGrade(grade)}
          >
            {grade}
          </button>
        ))}
      </div>

      <div className={s['preview-list']}>
        {previewReviews.map((review) => (
          <div
            key={review.hash_id}
            className={s['preview-item']}
            onClick={() =>
              handleOpenModalWithReview(review.hash_id, '등급 전체')
            }
          >
            <div className={s['preview-content']}>{review.content}</div>

            <div className={s['preview-meta']}>
              <span>
                {review.owner_description ? review.owner_description : ''}
              </span>
              <span>
                {review.created_at ? getTimeAgo(review.created_at) : ''}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className={s['show-all-btn']} onClick={handleOpenModalAll}>
        {reviews.length}개 모두 보기
      </button>

      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="구매 후기"
        showTitle={false}
        showCloseButton={true}
        maxWidth="742px"
        maxHeight={false}
      >
        <div className={s['modal-body']}>
          {modelName && (
            <div className={s['header-wrap']}>
              {modelName}
              <br />타 본 사람들 이야기
            </div>
          )}

          <div className={s['modal-header-actions']}>
            <Selectbox
              options={grades}
              value={modalSelectedGrade}
              onChange={(val) => setModalSelectedGrade(val)}
            />
          </div>

          <div className={s['modal-header-actions']}>
            <div className={s['review-count']}>
              <span>{modalReviews.length}</span>개
            </div>

            <SortSelectbox
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={(val) => setSortBy(val as 'latest' | 'likes')}
            />
          </div>

          <div className={s['full-review-list']}>
            {modalReviews.map((review) => (
              <div
                key={review.hash_id}
                id={`review-${review.hash_id}`}
                className={s['full-review-item']}
              >
                <div className={s['main-info-wrap']}>
                  {(review.owner_description || review.ownership_period) && (
                    <div className={s['owner-info']}>
                      {review.owner_description}{' '}
                      {review.owner_description && review.ownership_period && (
                        <span className={s['divider']}>∙</span>
                      )}{' '}
                      {review.ownership_period}
                    </div>
                  )}

                  <pre className={s['content']}>{review.content}</pre>

                  <div className={s['car-profile']}>
                    {review.image_url && (
                      <div className={`${s['img-wrap']} img-wrap`}>
                        <Image
                          src={review.image_url}
                          alt="리뷰 이미지"
                          fill
                          className={s['img']}
                        />
                      </div>
                    )}

                    <div className={s['car-specs']}>
                      <span className={s['grade']}>{review.grade_name}</span>{' '}
                      <div className={s['detail']}>
                        {review.year}년형{' '}
                        <span className={s['divider']}>∙</span>{' '}
                        {Math.floor((review.mileage ?? 0) / 10000)}만km{' '}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={s['footer-meta']}>
                  <div className={s['likes']}>
                    좋아요 ∙ {review.likes_count}
                  </div>
                  <div className={s['date']}>
                    {getTimeAgo(review.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

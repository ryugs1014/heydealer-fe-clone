'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/atoms/modal/Modal';
import { getTimeAgo } from '@/utils/buy/detail/dateUtils';
import s from './PurchaseReviewSection.module.scss';

interface PurchaseReviewData {
  hash_id: string;
  model_part_name: string;
  description: string;
  image_url: string;
  created_at: string;
  satisfaction: string;
  grade_part_name: string;
}

interface PurchaseReviewSectionProps {
  reviews: PurchaseReviewData[];
}

export default function PurchaseReviewSection({
  reviews,
}: PurchaseReviewSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);

  // 최신순으로 정렬된 전체 리뷰 데이터
  const sortedReviews = useMemo(() => {
    return [...reviews].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [reviews]);

  // 메인 화면 미리보기 (최대 4개)
  const previewReviews = sortedReviews.slice(0, 4);

  // 모달 오픈 후 특정 리뷰 위치로 스크롤
  useEffect(() => {
    if (isModalOpen && targetId) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`purchase-review-${targetId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setTargetId(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen, targetId]);

  const handleOpenModal = (hashId?: string) => {
    if (hashId) setTargetId(hashId);
    setIsModalOpen(true);
  };

  return (
    <div className={s['purchase-review-section']}>
      {/* 미리보기 리스트 */}
      <div className={s['preview-list']}>
        {previewReviews.map((review) => (
          <div
            key={review.hash_id}
            className={s['review-card']}
            onClick={() => handleOpenModal(review.hash_id)}
          >
            <div className={s['car-profile']}>
              {review.image_url && (
                <div className={`${s['img-wrap']} img-wrap`}>
                  <Image
                    src={review.image_url}
                    alt={review.model_part_name}
                    fill
                    className={s['img']}
                  />
                </div>
              )}

              <div className={s['car-specs']}>
                <span className={s['grade']}>{review.model_part_name}</span>{' '}
                <div className={s['detail']}>
                  {getTimeAgo(review.created_at)}
                </div>
              </div>
            </div>

            <pre className={s['content']}>{review.description}</pre>
          </div>
        ))}
      </div>

      <button className={s['show-all-btn']} onClick={() => handleOpenModal()}>
        {reviews.length}개 모두 보기
      </button>

      {/* 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="구매 후기"
        showTitle={false}
        showCloseButton={true}
        maxWidth="742px"
        maxHeight={false}
      >
        <div className={s['modal-body']}>
          <div className={s['header-wrap']}>
            구매 후기 <span>{reviews.length}</span>
          </div>

          <div className={s['modal-list']}>
            {sortedReviews.map((review, index) => (
              <React.Fragment key={review.hash_id}>
                {index > 0 && <hr className={s['divider']} />}

                <div
                  id={`purchase-review-${review.hash_id}`}
                  className={s['modal-card']}
                >
                  <div className={s['car-profile']}>
                    {review.image_url && (
                      <div className={`${s['img-wrap']} img-wrap`}>
                        <Image
                          src={review.image_url}
                          alt={review.model_part_name}
                          fill
                          className={s['img']}
                        />
                      </div>
                    )}

                    <div className={s['car-specs']}>
                      <span className={s['grade']}>
                        {review.model_part_name}
                      </span>{' '}
                      <div className={s['detail']}>
                        {getTimeAgo(review.created_at)}
                      </div>
                    </div>
                  </div>

                  <pre className={s['content']}>{review.description}</pre>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

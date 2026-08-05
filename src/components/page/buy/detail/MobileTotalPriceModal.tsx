'use client';

import React from 'react';
import s from './MobileTotalPriceModal.module.scss';
import Arrow from '/public/svg/filter-arrow.svg';

interface MobileTotalPriceModalProps {
  carData: any;
}

export default function MobileTotalPriceModal({
  carData,
}: MobileTotalPriceModalProps) {
  const info = carData?.detail_info;
  const carPrice = carData?.price || 0;

  return (
    <div className={s['mobile-total-price-modal']}>
      <div className={s['modal-button-wrap']}>
        <button type="button" className={`${s['info-modal-button']}`}>
          <div className={s['button-forward']}>
            <div className={s['button-icon']}>👀</div>
            <div className={s['button-text']}>이 차의 숨은이력까지 확인</div>
          </div>

          <div className={s['arrow-box']}>
            앱으로
            <div className={s['svg-box']}>
              <Arrow width="100%" height="100%" viewBox="0 0 24 24" />
            </div>
          </div>
        </button>
      </div>

      <div className={s['main-info']}>
        <div className={s['info-header']}>
          <div className={s['price']}>{carPrice.toLocaleString()}만원</div>
          <div className={s['origin-price']}>
            신차 {info?.factory_price?.toLocaleString()}
          </div>
        </div>

        <button className={s['reserve-button']}>바로 구매예약</button>
      </div>
    </div>
  );
}

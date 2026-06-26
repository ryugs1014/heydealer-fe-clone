'use client';

import React, { useState } from 'react';
import s from './PechaForm.module.scss';
import type { Sido, Sigungu } from '@/types/location';

import Warning from '/public/svg/modal-info.svg';
import Location from '/public/svg/location.svg';
import InputClose from '/public/svg/input-close.svg';
import Arrow from '/public/svg/filter-arrow-up.svg';

interface PechaFormProps {
  vehicleNumber: string;
  setVehicleNumber: (val: string) => void;
  selectedSido: Sido | null;
  setSelectedSido: (val: Sido | null) => void;
  selectedSigungu: Sigungu | null;
  setSelectedSigungu: (val: Sigungu | null) => void;
  buttonText?: string;
  onSubmitSuccess: () => void;
  modalOption?: boolean;
  onLocationClick: () => void;
  onShowToast: (message: string) => void;
}

export default function PechaForm({
  vehicleNumber,
  setVehicleNumber,
  selectedSido,
  setSelectedSido,
  selectedSigungu,
  setSelectedSigungu,
  buttonText = '⚡️ 카톡으로 견적받기',
  onSubmitSuccess,
  modalOption = false,
  onLocationClick,
  onShowToast,
}: PechaFormProps) {
  const [vehicleError, setVehicleError] = useState<React.ReactNode>('');

  const vehicleRegex = /^\d{2,3}[가-힣]\d{4}$/;

  const handleSubmit = () => {
    setVehicleError('');
    if (!vehicleNumber.trim()) {
      setVehicleError(
        <>
          차량번호가 잘못입력됐어요.
          <br />
          <b>차량번호만 정확히 입력해주세요.</b>
        </>,
      );
      return;
    }
    if (!vehicleRegex.test(vehicleNumber)) {
      setVehicleError(
        <>
          차량번호가 잘못입력됐어요.
          <br />
          <b>차량번호만 정확히 입력해주세요.</b>
        </>,
      );
      return;
    }
    if (!selectedSigungu) {
      onShowToast('판매지역을 선택해주세요.');
      return;
    }

    onSubmitSuccess();
  };

  return (
    <div
      className={`${s['detail-content']} ${modalOption ? s['modal-option'] : ''}`}
    >
      <div className={`${s['pecha-section']}`}>
        {modalOption && (
          <h2>
            차량번호과 지역을
            <br />
            입력해 주세요.
          </h2>
        )}
        <div className={s['input-section']}>
          <div
            className={`${s['input-wrap']} ${vehicleError ? s['error'] : ''}`}
          >
            {modalOption && <label>차량번호</label>}

            <div className={s['input-box']}>
              <input
                placeholder="12바5033 (차량번호)"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                maxLength={9}
              />

              {vehicleNumber.length > 0 && (
                <div
                  className={s['close-svg-box']}
                  onClick={() => setVehicleNumber('')}
                  style={{ cursor: 'pointer' }}
                >
                  <InputClose width="100%" height="100%" viewBox="0 0 24 24" />
                </div>
              )}
            </div>
            {vehicleError && (
              <div className={s['error-wrap']}>
                <div className={s['error-svg-box']}>
                  <Warning width="100%" height="100%" viewBox="0 0 24 24" />
                </div>
                <div className={s['error-text']}>{vehicleError}</div>
              </div>
            )}
          </div>

          <div className={s['input-wrap']} onClick={onLocationClick}>
            {modalOption && <label>판매지역</label>}

            <div className={s['input-box']}>
              <button
                className={`${s['location-button']} ${selectedSigungu ? s['selected'] : ''}`}
              >
                <div className={s['svg-box']}>
                  <Location width="100%" height="100%" viewBox="0 0 24 24" />
                </div>

                {selectedSigungu ? selectedSigungu.full_name : '판매지역 선택'}
              </button>

              {selectedSigungu && (
                <div
                  className={s['close-svg-box']}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSido(null);
                    setSelectedSigungu(null);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <InputClose width="100%" height="100%" viewBox="0 0 24 24" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={s['button-section']}>
        <button className={s['submit-button']} onClick={handleSubmit}>
          {buttonText}

          <div className={s['svg-box']}>
            <Arrow width="100%" height="100%" viewBox="0 0 24 24" />
          </div>
        </button>
      </div>
    </div>
  );
}

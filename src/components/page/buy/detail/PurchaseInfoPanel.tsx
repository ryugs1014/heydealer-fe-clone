'use client';

import React from 'react';
import s from './CarDetailWrapper.module.scss';
import Image from 'next/image';

import FavoriteButton from '@/components/atoms/buttons/FavoriteButton';
import InfoRow from '@/components/atoms/detail/InfoRow';
import InfoModalButton from '@/components/atoms/buttons/InfoModalButton';

import QR from '/public/svg/qr.svg';
import ContactProfile from '/public/img/ui/manager-CgY0PyKE.png';

interface PurchaseInfoPanelProps {
  carData: any;
  carPrice: number;
  factoryPrice?: number;
  transferTotalFee: number;
  transferTooltipText: string;
  warrantyFee: number;
  deliveryFee: number;
  totalPurchasePrice: number;
}

export default function PurchaseInfoPanel({
  carData,
  carPrice,
  factoryPrice,
  transferTotalFee,
  transferTooltipText,
  warrantyFee,
  deliveryFee,
  totalPurchasePrice,
}: PurchaseInfoPanelProps) {
  return (
    <div className={s['content-wrap']}>
      <div className={s['sticky-content']}>
        <div className={s['main-info']}>
          <div className={s['info-header']}>
            <div className={s['price']}>{carPrice.toLocaleString()}만원</div>

            <FavoriteButton
              hashId={carData?.hash_id}
              className={s['favorite-button-wrap']}
            />
          </div>

          {factoryPrice ? (
            <div className={s['origin-price']}>
              신차 {factoryPrice?.toLocaleString()}
            </div>
          ) : (
            ''
          )}
        </div>

        <span className={s['content-line']} />

        <div className={s['detail-info']}>
          <div className={s['detail-price']}>
            <div className={s['detail-title']}>총 구매 비용</div>

            <ul className={s['price-list']}>
              <li className={s['list']}>
                <span className={s['label']}>차량가</span>
                <span className={s['price']}>
                  {carPrice.toLocaleString()}만원
                </span>
              </li>

              <li className={s['list']}>
                <InfoRow
                  label="이전관리지"
                  labelTooltip={{
                    text: transferTooltipText,
                  }}
                  small={true}
                />

                <span className={s['price']}>
                  {transferTotalFee.toLocaleString()}만원
                </span>
              </li>

              <li className={s['list']}>
                <span className={s['label']}>보증 가입비</span>
                <span className={s['price']}>
                  <del>{warrantyFee}만원</del>
                  무료
                </span>
              </li>

              <li className={s['list']}>
                <span className={s['label']}>탁송비</span>
                <span className={s['price']}>
                  <del>{deliveryFee}만원</del>
                  무료
                </span>
              </li>
            </ul>

            <span className={s['mobile-content-line']} />

            <ul className={s['mobile-price-list']}>
              <li className={s['list']}>
                <span className={s['label']}>총 구매비</span>
                <span className={s['price']}>
                  {totalPurchasePrice.toLocaleString()}만원
                </span>
              </li>
            </ul>

            <div className={s['total-price']}>
              <span>{totalPurchasePrice.toLocaleString()}만원</span>
            </div>
          </div>

          <InfoModalButton
            textBefore="단순 변심도"
            highlightText="무료 환불"
            textAfter="가능"
            // onClick={() => setIsInfoModalOpen(true)}
          />

          <span className={s['mobile-content-line']} />

          <div className={s['mobile-button-title']}>부대비용, 최저가 비교</div>

          <div className={s['button-wrap']}>
            <button className={s['research-button']}>
              보험료 조회
              <div className={s['mobile-text']}>주유권 3만원 혜택</div>
            </button>
            <button className={s['research-button']}>
              할부한도 조회
              <div className={s['mobile-text']}>1분만에 간편 확인</div>
            </button>
          </div>
        </div>

        <span className={s['content-line']} />

        <button className={s['reserve-button']}>
          <div className={s['svg-box']}></div>
          바로 구매예약
        </button>
      </div>

      <div className={s['qr-section']}>
        <div className={s['qr-text-info']}>
          {/* 차량 번호는 추후 carData.car_number 등으로 동적 바인딩 하시면 좋습니다 */}
          <span className={s['app-guide-text']}>앱에서 [24서5560] 보기</span>

          <span className={s['qr-guide-text']}>
            휴대폰 카메라로 QR코드를
            <br /> 촬영해 보세요.
          </span>
        </div>

        <div className={s['svg-box']}>
          <QR width="100%" height="100%" viewBox="0 0 61 61" />
        </div>
      </div>

      <div className={s['chat-button-wrap']}>
        <button className={s['chat-contact']}>
          <div className={s['chat-profile-img']}>
            <div className={`${s['img-wrap']} img-wrap`}>
              <Image src={ContactProfile} alt={`star`} fill sizes="15vw" />
            </div>
          </div>
          채팅 문의
        </button>
      </div>
    </div>
  );
}

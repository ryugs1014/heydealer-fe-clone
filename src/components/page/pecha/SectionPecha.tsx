'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import s from './SectionPecha.module.scss';
import Section_01 from '@/components/page/pecha/app/Section_01';
import Section_02 from '@/components/page/pecha/app/Section_02';
import Section_03 from '@/components/page/pecha/app/Section_03';
import Section_04 from '@/components/page/pecha/app/Section_04';
import Section_05 from '@/components/page/pecha/app/Section_05';
import Section_06 from '@/components/page/pecha/app/Section_06';
import Section_07 from '@/components/page/pecha/app/Section_07';
import Section_08 from '@/components/page/pecha/app/Section_08';

import PechaForm from '@/components/atoms/pecha/PechaForm';
import DetailModal from '@/components/atoms/modal/DetailModal';
import LocationModal from '@/components/atoms/modal/LocationModal';

import LOCATION_DATA from '@/data/pecha/location.json';
import type { Sido, Sigungu } from '@/types/location';

import ModalClose from '/public/svg/modal-close.svg';
import ModalInfo from '/public/svg/modal-info.svg';
import Arrow from '/public/svg/filter-arrow-up.svg';

const ANIM_DURATION = 300; // CSS transition (0.3s)

export default function SectionPecha() {
  const [showFixedButton, setShowFixedButton] = useState(false);
  const section1Ref = useRef<HTMLDivElement>(null);

  const [vehicleNumber, setVehicleNumber] = useState('');
  const [selectedSido, setSelectedSido] = useState<Sido | null>(null);
  const [selectedSigungu, setSelectedSigungu] = useState<Sigungu | null>(null);

  // 모달 마운트 & 애니메이션 상태 관리
  const [isPechaMounted, setIsPechaMounted] = useState(false);
  const [pechaAnim, setPechaAnim] = useState<'down' | 'visible' | 'left'>(
    'down',
  );

  const [isDetailMounted, setIsDetailMounted] = useState(false);
  const [detailAnim, setDetailAnim] = useState<'right' | 'visible' | 'down'>(
    'down',
  );

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isFromPechaModal, setIsFromPechaModal] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const openPecha = () => {
    setPechaAnim('down');
    setIsPechaMounted(true);
    setTimeout(() => setPechaAnim('visible'), 10);
  };

  const handleNextToDetail = () => {
    setIsFromPechaModal(true);
    setPechaAnim('left');

    setDetailAnim('right');
    setIsDetailMounted(true);

    setTimeout(() => setDetailAnim('visible'), 10);

    setTimeout(() => setIsPechaMounted(false), ANIM_DURATION);
  };

  const handleBackToPecha = () => {
    setDetailAnim('right');

    setPechaAnim('left');
    setIsPechaMounted(true);

    setTimeout(() => setPechaAnim('visible'), 10);

    setTimeout(() => setIsDetailMounted(false), ANIM_DURATION);
  };

  const closePecha = () => {
    setPechaAnim('down');
    setTimeout(() => setIsPechaMounted(false), ANIM_DURATION);
  };

  const closeDetail = () => {
    setDetailAnim('down');
    setTimeout(() => setIsDetailMounted(false), ANIM_DURATION);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFixedButton(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    if (section1Ref.current) {
      observer.observe(section1Ref.current);
    }

    return () => {
      if (section1Ref.current) observer.unobserve(section1Ref.current);
    };
  }, []);

  useEffect(() => {
    if (isPechaMounted || isDetailMounted || isLocationModalOpen) {
      // 💡 1. body와 html 모두 overflow 제어
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      // 💡 2. iOS 바운스(고무줄) 효과 차단
      document.body.style.overscrollBehavior = 'none';
      document.documentElement.style.overscrollBehavior = 'none';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehavior = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehavior = '';
    };
  }, [isPechaMounted, isDetailMounted, isLocationModalOpen]);

  const isAnyModalMounted = isPechaMounted || isDetailMounted;

  const isBgVisible =
    ['visible', 'left', 'right'].includes(pechaAnim) ||
    ['visible', 'left', 'right'].includes(detailAnim);

  return (
    <div className={s['section-container']}>
      <div className={s['section-bg']} />

      <div className={s['section-flex-wrap']}>
        <div className={s['section-sticky-container']}>
          <div className={s['section-sticky-wrap']}>
            <div className={s['section-sticky-content']}>
              <div className={s['content-wrap']}>
                <div className={s['main-text']}>
                  <span>귀찮은 전화없이 맘 편하게,</span>
                  <br />
                  <span>헤이딜러 폐차로</span>
                  <br />
                  <span> 최고가 비교해보세요.</span>
                </div>
                <div className={s['hashtag-wrap']}>
                  <div className={s['hashtag']}>
                    <span>#</span> 전국 관허폐차장 인증 견적
                  </div>
                  <div className={s['hashtag']}>
                    <span>#</span> 끝까지 안전거래 보장
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={s['section-app-container']}>
          <div ref={section1Ref}>
            <Section_01
              vehicleNumber={vehicleNumber}
              setVehicleNumber={setVehicleNumber}
              selectedSido={selectedSido}
              setSelectedSido={setSelectedSido}
              selectedSigungu={selectedSigungu}
              setSelectedSigungu={setSelectedSigungu}
              onSubmitSuccess={() => {
                setIsFromPechaModal(false);
                setDetailAnim('down');
                setIsDetailMounted(true);
                setTimeout(() => setDetailAnim('visible'), 10);
              }}
              onLocationClick={() => setIsLocationModalOpen(true)}
              onShowToast={showToast}
            />
          </div>

          <div className={s['section-app-content']}>
            <Section_02 />
            <Section_03 />
            <Section_04 />
            <Section_05 />
            <Section_06 />
            <Section_07 />
          </div>

          <Section_08 />

          <div className={s['fake-fixed-item']}></div>

          <div
            className={`${s['fixed-button-container']} ${showFixedButton ? s['is-show'] : ''}`}
          >
            <div className={s['fixed-button-activation']}>
              <div className={s['fixed-button-wrap']}>
                <button className={s['fixed-button']} onClick={openPecha}>
                  ⚡️ 카톡으로 견적받기{' '}
                  <div className={s['svg-box']}>
                    <Arrow width="100%" height="100%" viewBox="0 0 24 24" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Pecha Modal */}
          {isAnyModalMounted && (
            <div className={s['modal-overlay']}>
              <div
                className={`${s['close-modal-bg']} ${isBgVisible ? s['fade-in'] : s['fade-out']}`}
                onClick={() => {
                  if (pechaAnim === 'visible') closePecha();
                  if (detailAnim === 'visible') closeDetail();
                }}
              ></div>

              {isPechaMounted && (
                <div
                  className={`${s['modal-content']} ${
                    pechaAnim === 'down'
                      ? s['slide-down']
                      : pechaAnim === 'left'
                        ? s['slide-left']
                        : s['visible']
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={s['modal-header']}>
                    <div className={s['button-section']}>
                      <button className={s['close-btn']} onClick={closePecha}>
                        <div className={s['svg-box']}>
                          <ModalClose
                            width="100%"
                            height="100%"
                            viewBox="0 0 24 24"
                          />
                        </div>
                      </button>
                    </div>
                  </div>

                  <PechaForm
                    vehicleNumber={vehicleNumber}
                    setVehicleNumber={setVehicleNumber}
                    selectedSido={selectedSido}
                    setSelectedSido={setSelectedSido}
                    selectedSigungu={selectedSigungu}
                    setSelectedSigungu={setSelectedSigungu}
                    buttonText="다음"
                    onSubmitSuccess={handleNextToDetail}
                    modalOption={true}
                    onLocationClick={() => setIsLocationModalOpen(true)}
                    onShowToast={showToast}
                  />
                </div>
              )}

              <DetailModal
                isMounted={isDetailMounted}
                animState={detailAnim}
                isFromPechaModal={isFromPechaModal}
                onClose={closeDetail}
                onBack={handleBackToPecha}
              />
            </div>
          )}

          <LocationModal
            isOpen={isLocationModalOpen}
            onClose={() => setIsLocationModalOpen(false)}
            locationData={LOCATION_DATA}
            selectedSido={selectedSido}
            selectedSigungu={selectedSigungu}
            onSelect={(sido, sigungu) => {
              setSelectedSido(sido);
              setSelectedSigungu(sigungu);
            }}
          />

          <div className={s['toast-container']}>
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  className={s['custom-toast']}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={s['info-svg-box']}>
                    <ModalInfo width="100%" height="100%" viewBox="0 0 24 24" />
                  </div>

                  {toastMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

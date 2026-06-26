'use client';

import React from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import s from './RewardModal.module.scss';
import Image from 'next/image';
import ReviewImage from '/public/img/pecha/reward.png';
import ModalClose from '/public/svg/modal-close.svg';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RewardModal({ isOpen, onClose }: RewardModalProps) {
  const y = useMotionValue(0);

  const bgOpacity = useTransform(y, [0, 538], [1, 0]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={s['modal-overlay']}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className={s['close-modal-bg']}
            onClick={onClose}
            style={{ opacity: bgOpacity }}
          />

          <motion.div
            className={s['modal-content']}
            onClick={(e) => e.stopPropagation()}
            style={{ y }}
            drag="y"
            dragConstraints={{ top: 0, bottom: Number.MAX_VALUE }}
            dragElastic={{ top: 0.1, bottom: 0 }}
            onDragEnd={(event, info) => {
              const displacementThreshold = 50;
              const velocityThreshold = 0;

              const isSignificantDisplacement =
                info.offset.y > displacementThreshold;
              const isFastSwipeDown = info.velocity.y > velocityThreshold;

              if (isSignificantDisplacement || isFastSwipeDown) {
                onClose();
              }
            }}
            variants={{
              hidden: { y: 1000 },
              visible: { y: 0 },
            }}
            transition={{
              type: 'tween',
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <div className={s['modal-header']}>
              <div className={s['button-section']}>
                <button className={s['close-btn']} onClick={onClose}>
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

            <div className={s['modal-body']}>
              <div className={s['body-header-wrap']}>
                <h2 className={s['title']}>
                  이번달에 폐차하면
                  <br />
                  투썸 베이글 세트 드려요.
                </h2>

                <p>소금 프레첼 베이글 + 아메리카노 R</p>

                <div className={s['img-section']}>
                  <div className={`${s['img-wrap']} img-wrap`}>
                    <Image
                      src={ReviewImage}
                      alt={'ReviewImage'}
                      fill
                      sizes="10vw"
                      style={{
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className={s['content-wrap']}>
                <ul>
                  <li>
                    <div className={s['list-title']}>대상</div>
                    <div className={s['list-text']}>헤이딜러로 폐차한 고객</div>
                  </li>
                  <li>
                    <div className={s['list-title']}>지급일</div>
                    <div className={s['list-text']}>말소 완료 후 3일 내</div>
                  </li>
                  <li>
                    <div className={s['list-title']}>지급방법</div>
                    <div className={s['list-text']}>카카오톡 자동 발송</div>
                  </li>
                  <li>
                    <div className={s['list-title']}>기간</div>
                    <div className={s['list-text']}>~ 이번달까지</div>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

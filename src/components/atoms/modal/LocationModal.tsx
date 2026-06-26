'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import s from './LocationModal.module.scss';
import type { Sido, Sigungu } from '@/types/location';

import Arrow from '/public/svg/filter-arrow-up.svg';
import ModalClose from '/public/svg/modal-close.svg';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationData: Sido[];
  selectedSido: Sido | null;
  selectedSigungu: Sigungu | null;
  onSelect: (sido: Sido | null, sigungu: Sigungu | null) => void;
}

export default function LocationModal({
  isOpen,
  onClose,
  locationData,
  selectedSido,
  selectedSigungu,
  onSelect,
}: LocationModalProps) {
  const [openSidoIds, setOpenSidoIds] = useState<number[]>([]);

  const toggleAccordion = (id: number) => {
    setOpenSidoIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

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
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className={s['modal-content']}
            onClick={(e) => e.stopPropagation()}
            variants={{
              hidden: { y: '100%' },
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

            <h2>판매지역을 선택해 주세요.</h2>

            <div className={s['accordion-wrapper']}>
              {locationData.map((sido) => {
                const isOpenAccordion = openSidoIds.includes(sido.id);

                return (
                  <div key={sido.id} className={s['accordion-item']}>
                    <button
                      className={s['accordion-header']}
                      onClick={() => toggleAccordion(sido.id)}
                    >
                      <span
                        className={`${s['sido-name']} ${isOpenAccordion ? s['open'] : ''}`}
                      >
                        {sido.name}
                      </span>

                      <span
                        className={`${s['icon']} ${isOpenAccordion ? s['open'] : ''}`}
                      >
                        <Arrow width="100%" height="100%" viewBox="0 0 24 24" />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpenAccordion && (
                        <motion.div
                          initial="collapsed"
                          animate="open"
                          exit="collapsed"
                          variants={{
                            open: { height: 'auto' },
                            collapsed: { height: 0 },
                          }}
                          className={s['accordion-content-container']}
                        >
                          <ul className={s['sigungu-list']}>
                            {sido.location_second_parts.map((sigungu) => (
                              <li
                                key={sigungu.id}
                                onClick={() => {
                                  onSelect(sido, sigungu);
                                  onClose();
                                }}
                                className={
                                  selectedSigungu?.id === sigungu.id
                                    ? s['active']
                                    : ''
                                }
                              >
                                <div className={s['line-wrap']}>
                                  {sigungu.name}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

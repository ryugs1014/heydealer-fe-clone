import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import s from './AppFaqAccordion.module.scss';
import Arrow from '/public/svg/filter-arrow-up.svg';
import FAQ from '/public/svg/faq.svg';

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  data: FaqItem[];
}

export default function AppFaqAccordion({ data }: FaqAccordionProps) {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <div className={s['faq-wrapper']}>
      {data.map((faq, index) => {
        const isOpen = openIndices.includes(index);

        return (
          <div key={faq.id} className={s['faq-item']}>
            <button
              className={s['faq-question']}
              onClick={() => toggleAccordion(index)}
            >
              <div className={s['question-header']}>
                <div className={s['svg-box']}>
                  {' '}
                  <FAQ width="100%" height="100%" viewBox="0 0 24 24" />
                </div>
                <span
                  className={`${s['question-title']} ${isOpen ? s['open'] : ''}`}
                >
                  {faq.question}
                </span>
              </div>
              <span className={`${s['icon']} ${isOpen ? s['open'] : ''}`}>
                <Arrow width="100%" height="100%" viewBox="0 0 24 24" />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { height: 'auto' },
                    collapsed: { height: 0 },
                  }}
                  className={s['faq-answer-container']}
                >
                  <pre className={s['faq-answer']}>{faq.answer}</pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

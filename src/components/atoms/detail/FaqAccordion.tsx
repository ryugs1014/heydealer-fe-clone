import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import s from './FaqAccordion.module.scss';
import Arrow from '/public/svg/filter-arrow-up.svg';

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  data: FaqItem[];
}

export default function FaqAccordion({ data }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={s['faq-wrapper']}>
      {data.map((faq, index) => (
        <div key={faq.id} className={s['faq-item']}>
          <button
            className={s['faq-question']}
            onClick={() => toggleAccordion(index)}
          >
            <span
              className={`${s['question-title']} ${openIndex === index ? s['open'] : ''}`}
            >
              {faq.question}
            </span>
            <span
              className={`${s['icon']} ${openIndex === index ? s['open'] : ''}`}
            >
              <Arrow width="100%" height="100%" viewBox="0 0 24 24" />
            </span>
          </button>

          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, height: 'auto' },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                className={s['faq-answer-container']}
              >
                <pre className={s['faq-answer']}>{faq.answer}</pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

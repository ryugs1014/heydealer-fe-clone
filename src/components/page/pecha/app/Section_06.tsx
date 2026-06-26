'use client';

import React from 'react';
import s from './Section_06.module.scss';
import AppFaqAccordion from '@/components/atoms/pecha/AppFaqAccordion';
import faqData from '@/data/pecha/faq.json';

export default function Section_06() {
  return (
    <div className={s['section-content']}>
      <div className={s['content-wrap']}>
        <div className={s['text-wrap']}>자주묻는 질문</div>

        <AppFaqAccordion data={faqData} />
      </div>
    </div>
  );
}

// app/page.tsx

import type { Metadata } from 'next';
import s from './page.module.scss';
import SectionPecha from '@/components/page/pecha/SectionPecha';

export const metadata: Metadata = {
  title: '헤이딜러 폐차 – 폐차 비교견적',
  description:
    '헤이딜러 인증중고차 출시! 내차팔기는 헤이딜러 zero, 중고차 숨은이력 조회, 폐차 비교견적',
};

export default async function Pecha() {
  return (
    <main className={s['main']}>
      <SectionPecha />
    </main>
  );
}

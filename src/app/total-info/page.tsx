// app/page.tsx

import type { Metadata } from 'next';
import s from './page.module.scss';
import Section_01 from '@/components/page/total-info/Section_01';
import Section_02 from '@/components/page/total-info/Section_02';
import Section_03 from '@/components/page/total-info/Section_03';
import Section_04 from '@/components/page/total-info/Section_04';

export const metadata: Metadata = {
  title: '헤이딜러 – 인증중고차, 내차팔기, [번호판]시세',
  description:
    '헤이딜러 인증중고차 출시! 내차팔기는 헤이딜러 zero, 중고차 숨은이력 조회, 폐차 비교견적',
};

export default async function TotalInfo() {
  return (
    <main className={s['main']}>
      <Section_01 />
      <Section_02 />
      <Section_03 />
      <Section_04 />
    </main>
  );
}

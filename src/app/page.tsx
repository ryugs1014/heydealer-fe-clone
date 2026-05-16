// app/page.tsx

import type { Metadata } from 'next';
import s from './page.module.scss';
import BuySection from '@/components/page/buy/BuySection';
import Marquee from '@/components/page/buy/Marquee';

export const metadata: Metadata = {
  title: '헤이딜러 – 인증중고차, 내차팔기, [번호판]시세',
  description:
    '헤이딜러 인증중고차 출시! 내차팔기는 헤이딜러 zero, 중고차 숨은이력 조회, 폐차 비교견적',
};

export default async function Home() {
  return (
    <main className={s['main']}>
      <Marquee />
      <BuySection />
    </main>
  );
}

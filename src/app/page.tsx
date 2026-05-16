// app/page.tsx

import type { Metadata } from 'next';
import s from './page.module.scss';
import BuySection from '@/components/page/buy/BuySection';
import Marquee from '@/components/page/buy/Marquee';

export const metadata: Metadata = {
  title: '내차사기 검색',
  description: '다양한 필터로 원하는 중고차를 검색해보세요.',
};

export default async function Home() {
  return (
    <main className={s['main']}>
      <Marquee />
      <BuySection />
    </main>
  );
}

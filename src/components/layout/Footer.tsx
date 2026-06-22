'use client';

import React, { useState, useEffect } from 'react';
import s from './Footer.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_GROUPS = [
  {
    category: '서비스',
    items: [
      { label: '내차팔기', href: '/sell' },
      { label: '폐차 견적받기', href: '/scrap-car' },
      { label: '중고차 숨은 이력', href: '/total-info' },
    ],
  },
  {
    category: '회사',
    items: [
      { label: '자주 묻는 질문', href: '/faq' },
      { label: 'PRND 채용', href: '/recruit' },
    ],
  },
];

export default function Footer() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 961px)');

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    if (mediaQuery.matches) {
      setIsMobileMenuOpen(false);
    }

    // 미디어 쿼리 상태 변화 리스너 등록
    mediaQuery.addEventListener('change', handleMediaChange);

    // 컴포넌트 언마운트 시 리스너 해제 (메모리 누수 방지)
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  // 👇 경로에 따라 다른 modifier 클래스를 반환하는 함수
  const getHeaderVariantClass = () => {
    // 1. 메인 페이지는 정확히 일치할 때만 적용
    if (pathname === '/') {
      return s['header--home'];
    }
    // 2. '/buy' 로 시작하는 모든 경로 (예: /buy/asdfasdf, /buy/123 등)
    if (pathname.startsWith('/buy')) {
      return s['header--buy'];
    }
    // 3. 기타 다른 페이지들
    if (pathname.startsWith('/sell-car')) {
      return s['header--sell'];
    }
    if (pathname.startsWith('/scrap-car')) {
      return s['header--scrap-car'];
    }
    if (pathname.startsWith('/total-info')) {
      return s['header--total-info'];
    }

    // 4. 매칭되는 게 없을 때 기본값
    return s['header--default'];
  };

  return (
    <footer className={`${s['footer']} ${getHeaderVariantClass() || ''}`}>
      <nav className={s['footer-nav']}>
        {NAV_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} className={s['nav-group']}>
            <h3 className={s['group-title']}>{group.category}</h3>

            <ul className={s['group-list']}>
              {group.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link
                    href={item.href}
                    className={s['nav-link']}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className={s['nav-button']}>{item.label}</button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={s['divider']} />

      <div className={s['footer-info']}>
        <div className={s['main-info']}>
          <div className={s['company-name']}>(주) 피알앤디테크베이</div>

          <div className={s['info-wrap']}>
            <div className={s['info-top']}>
              <button className={s['per-info-button']}>
                개인정보 처리방침
              </button>
              <hr />
              <span>사업자등록번호 : 565-86-03060</span>
              <hr />
              <span>1599-4783</span>
              <hr />
              <span>대표자 : 박진우</span>
              <hr />
              <span>인천광역시 서구 북항로32번길 47-15</span>
              <hr />
              <span>contact@heydealer.com</span>
            </div>

            <div className={s['info-bottom']}>
              <span>통신판매번호 : 제2025-인천서구-3216호</span>
              <hr />
              <button className={s['company-info-button']}>
                사업자정보확인
              </button>
              <hr />
              <button className={s['company-info-button']}>
                자동차매매업정보확인
              </button>
            </div>
          </div>
        </div>

        <div className={s['text-info']}>
          헤이딜러 인증중고차는 (주)피알앤디테크베이가 운영합니다.
          (주)피알앤디컴퍼니는 통신판매중개자로 통신판매 당사자가 아니며, 상품
          및 거래정보, 거래에 대한 책임은 판매자에 있습니다.
        </div>

        <div className={s['copyright-info']}>2026 ⓒ all rights reserved.</div>
      </div>
    </footer>
  );
}

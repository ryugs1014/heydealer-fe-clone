'use client';

import React, { useState, useEffect } from 'react'; // 📌 useEffect 추가
import s from './Header.module.scss';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import Logo from '/public/svg/clip0_169_521.svg';
import MobileMenu from '/public/svg/mobile-menu.svg';
import MobileMenuClose from '/public/svg/mobile-menu-close.svg';

// 📌 메뉴 데이터 배열
const NAV_ITEMS = [
  { label: '내차사기', href: '/buy-car' },
  { label: '내차팔기', href: '/sell-car' },
  { label: '폐차 견적받기', href: '/scrap-car' },
  { label: '중고차 숨은 이력', href: '/car-history' },
];

const MOBILE_NAV_GROUPS = [
  {
    category: '서비스',
    items: [
      { label: '내차팔기', href: '/sell-car' },
      { label: '폐차 견적받기', href: '/scrap-car' },
      { label: '중고차 숨은 이력', href: '/car-history' },
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

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 📌 960px 이상일 때 모바일 메뉴를 자동으로 닫는 Effect 추가
  useEffect(() => {
    // 960px 이상인지 감시하는 미디어 쿼리 생성
    const mediaQuery = window.matchMedia('(min-width: 961px)');

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    // 컴포넌트 마운트 시 초기 체크 (처음 켰을 때 이미 960px 이상이라면 닫기)
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

  return (
    <header className={s['header']}>
      <div className={s['gnb-container']}>
        <Link href="/" className={s['logo-link']}>
          <div className={s['logo-box']}>
            <Logo width="100%" height="100%" viewBox="0 0 108 17" />
          </div>
        </Link>

        <nav className={s['pc-nav']}>
          {NAV_ITEMS.map((item, index) => (
            <Link key={index} href={item.href} className={s['nav-link']}>
              <button className={s['nav-button']}>{item.label}</button>
            </Link>
          ))}
        </nav>

        <button
          className={`${s['hamburger-btn']} ${isMobileMenuOpen ? s['is-active'] : ''}`}
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="메뉴 열기"
        >
          <MobileMenu width="100%" height="100%" viewBox="0 0 24 24" />
        </button>
      </div>

      <div
        className={`${s['mobile-sidebar']} ${isMobileMenuOpen ? s['is-open'] : ''}`}
      >
        <div className={s['gnb-header']}>
          <button
            className={`${s['hamburger-btn']} ${isMobileMenuOpen ? s['is-active'] : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="메뉴 열기"
          >
            <MobileMenuClose width="100%" height="100%" viewBox="0 0 24 24" />
          </button>
        </div>

        <nav className={s['mobile-nav']}>
          {MOBILE_NAV_GROUPS.map((group, groupIndex) => (
            <div key={groupIndex} className={s['mobile-nav-group']}>
              <h3 className={s['mobile-group-title']}>{group.category}</h3>

              <ul className={s['mobile-group-list']}>
                {group.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      className={s['mobile-nav-link']}
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
      </div>

      <div
        className={`${s['sidebar-overlay']} ${isMobileMenuOpen ? s['is-active'] : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}

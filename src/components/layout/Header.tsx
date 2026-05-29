'use client';

import React, { useState, useEffect } from 'react';
import s from './Header.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '/public/svg/clip0_169_521.svg';
import MobileMenu from '/public/svg/mobile-menu.svg';
import MobileMenuClose from '/public/svg/mobile-menu-close.svg';

const NAV_ITEMS = [
  { label: '내차사기', href: '/' },
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
      return s['header--sell-car'];
    }
    if (pathname.startsWith('/scrap-car')) {
      return s['header--scrap-car'];
    }
    if (pathname.startsWith('/car-history')) {
      return s['header--car-history'];
    }

    // 4. 매칭되는 게 없을 때 기본값
    return s['header--default'];
  };

  return (
    <header className={`${s['header']} ${getHeaderVariantClass() || ''}`}>
      <div className={s['gnb-container']}>
        <Link href="/" className={s['logo-link']}>
          <div className={s['logo-box']}>
            <Logo width="100%" height="100%" viewBox="0 0 108 17" />
          </div>
        </Link>

        <nav className={s['pc-nav']}>
          {NAV_ITEMS.map((item, index) => {
            // 현재 주소(pathname)와 메뉴의 href가 일치하는지 확인
            const isActive = pathname === item.href;

            return (
              <Link key={index} href={item.href} className={s['nav-link']}>
                <button
                  className={`${s['nav-button']} ${isActive ? s['is-active'] : ''}`}
                >
                  {item.label}
                </button>
              </Link>
            );
          })}
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

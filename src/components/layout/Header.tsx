'use client';

import React, { useState, useEffect } from 'react';
import s from './Header.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '/public/svg/clip0_169_521.svg';
import MobileMenu from '/public/svg/mobile-menu.svg';
import MobileMenuClose from '/public/svg/mobile-menu-close.svg';

interface NavItem {
  label: string;
  href: string;
  isNewTab?: boolean;
}

interface NavGroup {
  category: string;
  items: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  { label: '내차사기', href: '/' },
  { label: '내차팔기', href: '/sell' },
  { label: '폐차 견적받기', href: '/pecha', isNewTab: true },
  { label: '중고차 숨은 이력', href: '/total-info' },
];

const MOBILE_NAV_GROUPS: NavGroup[] = [
  {
    category: '서비스',
    items: [
      { label: '내차사기', href: '/' },
      { label: '내차팔기', href: '/sell' },
      { label: '폐차 견적받기', href: '/pecha', isNewTab: true },
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

    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  const getHeaderVariantClass = () => {
    if (pathname === '/') {
      return s['header--home'];
    }
    if (pathname.startsWith('/buy')) {
      return s['header--buy'];
    }
    if (pathname.startsWith('/sell')) {
      return s['header--sell'];
    }
    if (pathname.startsWith('/pecha')) {
      return s['header--pecha'];
    }
    if (pathname.startsWith('/total-info')) {
      return s['header--total-info'];
    }

    return s['header--default'];
  };

  //Header Hide
  const hiddenRoutes = ['/pecha'];

  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  return (
    <div
      className={`${s['header-container']} ${getHeaderVariantClass() || ''}`}
    >
      <header className={`${s['header']} ${getHeaderVariantClass() || ''}`}>
        <div className={s['gnb-container']}>
          <Link href="/" className={s['logo-link']}>
            <div className={s['logo-box']}>
              <Logo width="100%" height="100%" viewBox="0 0 108 17" />
            </div>
          </Link>

          <nav className={s['pc-nav']}>
            {NAV_ITEMS.map((item, index) => {
              const isActive = pathname === item.href;

              return (
                // 2. 데스크탑 Link 컴포넌트에 target과 rel 속성 조건부 추가
                <Link
                  key={index}
                  href={item.href}
                  className={s['nav-link']}
                  target={item.isNewTab ? '_blank' : undefined}
                  rel={item.isNewTab ? 'noopener noreferrer' : undefined}
                >
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
              aria-label="메뉴 닫기"
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
                      {/* 3. 모바일 Link 컴포넌트에도 동일하게 추가 */}
                      <Link
                        href={item.href}
                        className={s['mobile-nav-link']}
                        onClick={() => setIsMobileMenuOpen(false)}
                        target={item.isNewTab ? '_blank' : undefined}
                        rel={item.isNewTab ? 'noopener noreferrer' : undefined}
                      >
                        <button className={s['nav-button']}>
                          {item.label}
                        </button>
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
    </div>
  );
}

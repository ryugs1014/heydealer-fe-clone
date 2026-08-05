'use client';

import React from 'react';
import s from './Section_01.module.scss';
import Link from 'next/link';
import Logo from '/public/svg/clip0_169_521.svg';
import PechaForm from '@/components/atoms/pecha/PechaForm';
import type { Sido, Sigungu } from '@/types/location';

interface Section01Props {
  vehicleNumber: string;
  setVehicleNumber: (val: string) => void;
  selectedSido: Sido | null;
  setSelectedSido: (val: Sido | null) => void;
  selectedSigungu: Sigungu | null;
  setSelectedSigungu: (val: Sigungu | null) => void;
  onSubmitSuccess: () => void;
  onLocationClick: () => void;
  onShowToast: (message: string) => void;
}

export default function Section_01(props: Section01Props) {
  return (
    <div className={s['section-container']}>
      <div className={s['content-wrap']}>
        <div className={s['section-header']}>
          <Link href="/" className={s['logo-link']}>
            <div className={s['logo-box']}>
              <Logo width="100%" height="100%" viewBox="0 0 108 17" />
            </div>
          </Link>
        </div>

        <div className={s['section-content']}>
          <div className={s['text-wrap']}>
            내차 폐차하면
            <br />
            얼마 받을 수 있을까?
          </div>

          <div className={s['pecha-section']}>
            <PechaForm {...props} />
          </div>
        </div>
      </div>
    </div>
  );
}

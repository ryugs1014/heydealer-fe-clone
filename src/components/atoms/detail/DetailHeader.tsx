// src/components/atoms/detail/DetailHeader.tsx
import React from 'react';
import s from './DetailHeader.module.scss';

interface DetailHeaderProps {
  title: string;
  subtitle?: string;
}

export default function DetailHeader({ title, subtitle }: DetailHeaderProps) {
  return (
    <div className={s['header-wrap']}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

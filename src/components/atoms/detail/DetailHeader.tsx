// src/components/atoms/detail/DetailHeader.tsx
import React from 'react';
import s from './DetailHeader.module.scss';

interface DetailHeaderProps {
  title: string;
  subtitle?: string;
  subTitleSize?: boolean;
}

export default function DetailHeader({
  title,
  subtitle,
  subTitleSize = false,
}: DetailHeaderProps) {
  return (
    <div className={`${s['header-wrap']}`}>
      <h2 className={`${subTitleSize ? s['title-size'] : ''}`}>{title}</h2>
      {subtitle && (
        <p className={`${subTitleSize ? s['title-size'] : ''}`}>{subtitle}</p>
      )}
    </div>
  );
}

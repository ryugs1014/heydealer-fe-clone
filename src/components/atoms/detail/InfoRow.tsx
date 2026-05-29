// src/components/atoms/detail/InfoRow.tsx
import React from 'react';
import s from './InfoRow.module.scss';

interface InfoRowProps {
  label?: string;
  value?: React.ReactNode;
}

export default function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className={s['row-wrap']}>
      {label && <span className={s['label']}>{label}</span>}
      {value && <span>{value}</span>}
    </div>
  );
}

import React from 'react';
import s from './Container.module.scss';

interface Props {
  size?: 'lg' | 'md' | 'sm' | 'none' | 'detail'; // 'lg' = 1820px, 'md' = 1720px, 'sm' = 1160px
  className?: string;
  children: React.ReactNode;
}

const Container = ({ size = 'lg', className = '', children }: Props) => {
  return (
    <div className={`${s.container} ${s[size]} ${className}`}>{children}</div>
  );
};

export default Container;

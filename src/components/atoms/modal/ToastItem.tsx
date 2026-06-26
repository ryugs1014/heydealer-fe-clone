// @/components/atoms/modal/ToastItem.tsx
import React, { useEffect, useState } from 'react';
import s from './ToastItem.module.scss';

export const ToastItem = React.memo(function ToastItem({
  toast,
  onExpiry,
}: {
  toast: any;
  onExpiry: (id: number) => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2700);

    const removeTimer = setTimeout(() => {
      onExpiry(toast.id);
    }, 3000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.id, onExpiry]);

  return (
    <div className={`${s['toast-popup']} ${isExiting ? s['is-exiting'] : ''}`}>
      <span className={s['toast-text']}>{toast.message}</span>
    </div>
  );
});

// @/components/atoms/modal/ToastItem.tsx
import React, { useEffect, useState } from 'react';
import s from './ToastItem.module.scss';

// 🌟 React.memo로 감싸서 prop이 변하지 않으면 자기 자신을 리렌더링하지 않도록 방어합니다.
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
  }, [toast.id, onExpiry]); // 이제 부모의 onExpiry가 고정되었으므로 안심하고 사용하셔도 됩니다.

  return (
    <div className={`${s['toast-popup']} ${isExiting ? s['is-exiting'] : ''}`}>
      <span className={s['toast-text']}>{toast.message}</span>
    </div>
  );
});

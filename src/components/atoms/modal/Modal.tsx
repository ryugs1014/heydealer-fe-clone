// src/components/atoms/modal/Modal.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import s from './Modal.module.scss';
import MobileMenuClose from '/public/svg/mobile-menu-close.svg';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  showTitle?: boolean;
  showCloseButton?: boolean;
  maxWidth?: string;
  scrollPadding?: boolean;
  maxHeight?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
  showTitle = true,
  showCloseButton = true,
  maxWidth,
  scrollPadding = false,
  maxHeight = false,
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className={s['modal-overlay']}>
      <div className={s['modal-container']} onClick={onClose}>
        <div
          className={`${s['modal-window']} ${!maxHeight ? s['max-height'] : ''}`}
          onClick={(e) => e.stopPropagation()}
          style={maxWidth ? { maxWidth } : undefined}
        >
          <div
            className={`${s['modal-header']} ${!showCloseButton ? s['disabled-close'] : ''} ${!showTitle ? s['disabled-title'] : ''}`.trim()}
          >
            {showTitle && <h3>{title}</h3>}

            {showCloseButton && (
              <button
                type="button"
                className={s['close-btn']}
                onClick={onClose}
              >
                <div className={s['svg-box']}>
                  <MobileMenuClose
                    width="100%"
                    height="100%"
                    viewBox="0 0 24 24"
                  />
                </div>
              </button>
            )}
          </div>

          <div
            className={`${s['scroll-container']} ${scrollPadding ? s['scroll-bar'] : ''}`.trim()}
          >
            <div className={`${s['modal-body']} ${className || ''}`.trim()}>
              {children}
            </div>
            {footer && <div className={s['modal-footer']}>{footer}</div>}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

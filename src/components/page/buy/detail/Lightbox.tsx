// src/components/page/buy/detail/Lightbox.tsx
'use client';

import React from 'react';

interface LightboxProps {
  index: number | null;
  images: string[];
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export default function Lightbox({
  index,
  images,
  onClose,
  onNavigate,
}: LightboxProps) {
  if (index === null) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        userSelect: 'none',
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '15px',
          zIndex: 2010,
        }}
      >
        ✕ 닫기
      </button>

      <button
        onClick={() => onNavigate('prev')}
        style={{
          position: 'absolute',
          left: '30px',
          fontSize: '36px',
          color: '#fff',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          zIndex: 2010,
          opacity: 0.7,
        }}
      >
        ❮
      </button>

      <div
        style={{
          maxWidth: '85%',
          maxHeight: '85%',
          position: 'relative',
          textAlign: 'center',
        }}
      >
        <img
          src={images[index]}
          alt="확대 사진"
          style={{
            maxWidth: '100%',
            maxHeight: '80vh',
            objectFit: 'contain',
            borderRadius: '8px',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
          }}
        />
        <div style={{ color: '#aaa', marginTop: '15px', fontSize: '14px' }}>
          갤러리 이동 : {index + 1} / {images.length}
        </div>
      </div>

      <button
        onClick={() => onNavigate('next')}
        style={{
          position: 'absolute',
          right: '30px',
          fontSize: '36px',
          color: '#fff',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          zIndex: 2010,
          opacity: 0.7,
        }}
      >
        ❯
      </button>
    </div>
  );
}

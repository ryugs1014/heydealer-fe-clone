// src/components/page/buy/detail/DetailModal.tsx
'use client';

import React, { useEffect } from 'react';

interface Section {
  id: string;
  title: string;
  images: string[];
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
  allImages: string[];
  onImageClick: (index: number) => void;
  initialScrollId?: string | null; // ⭐ 스크롤 타겟 ID 추가
}

export default function DetailModal({
  isOpen,
  onClose,
  sections,
  allImages,
  onImageClick,
  initialScrollId, // ⭐ Props 받기
}: DetailModalProps) {
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // ⭐ 모달이 열리고 DOM이 렌더링된 후 타겟 위치로 스크롤
      if (initialScrollId) {
        setTimeout(() => {
          const target = document.getElementById(initialScrollId);
          if (target) {
            // 헤더 높이 등을 고려해 부드럽게 스크롤
            target.scrollIntoView({ behavior: 'auto', block: 'start' });
          }
        }, 0); // 렌더링 보장을 위한 0.1초 지연
      }

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, initialScrollId]);

  if (!isOpen) return null;

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        zIndex: 1000,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 상단 상단 고정 헤더 바 */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '15px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', gap: '12px' }}>
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid #d1d5db',
                backgroundColor: '#f3f4f6',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              {sec.title.split(' ')[0]}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          style={{
            padding: '8px 18px',
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          ❌ 닫기
        </button>
      </div>

      {/* 본문 이미지 리스트 컨텐츠 */}
      <div
        style={{
          padding: '40px 24px',
          maxWidth: '1000px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {sections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            style={{ marginBottom: '60px', scrollMarginTop: '80px' }}
          >
            <h2
              style={{
                borderBottom: '2px solid #374151',
                paddingBottom: '8px',
                marginBottom: '20px',
              }}
            >
              {section.title}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {section.images.map((imgSrc) => {
                const globalIdx = allImages.indexOf(imgSrc);
                return (
                  <div
                    key={imgSrc}
                    onClick={() => onImageClick(globalIdx)}
                    style={{
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'zoom-in',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                  >
                    <img
                      src={imgSrc}
                      alt="차량 스냅"
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        transition: 'transform 0.2s',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = 'scale(1.03)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = 'scale(1)')
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

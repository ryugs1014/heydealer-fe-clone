// src/components/page/buy/Car360Viewer.tsx
'use client';

import React, { useRef, useState, useEffect } from 'react';

interface Car360ViewerProps {
  videoSrc: string;
}

const TIER_DURATION = 4;
const TOTAL_TIERS = 5;

export default function Car360Viewer({ videoSrc }: Car360ViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef<boolean>(false);

  // [기본 드래그 위치 기록]
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const startProgress = useRef<number>(0);
  const startTier = useRef<number>(0);

  // 🌟 [관성(Momentum) 계산을 위한 추가 Ref]
  const lastMouseX = useRef<number>(0);
  const lastMoveTime = useRef<number>(0);
  const velocityX = useRef<number>(0); // 가로 드래그 속도
  const momentumRaf = useRef<number | null>(null); // requestAnimationFrame ID 저장용

  // 관성 루프 중에도 현재 상태를 추적하기 위한 독립적인 Ref
  const currentProgressRef = useRef<number>(0);
  const currentTierRef = useRef<number>(0);

  const [currentTier, setCurrentTier] = useState<number>(1);
  const [isCursorGrabbing, setIsCursorGrabbing] = useState<boolean>(false);

  const parseVideoTime = (currentTime: number) => {
    const tier = Math.min(
      Math.floor(currentTime / TIER_DURATION),
      TOTAL_TIERS - 1,
    );
    const progress = (currentTime % TIER_DURATION) / TIER_DURATION;
    return { tier, progress };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;

    if (momentumRaf.current) {
      cancelAnimationFrame(momentumRaf.current);
      momentumRaf.current = null;
    }

    isDragging.current = true;
    setIsCursorGrabbing(true);

    startX.current = e.pageX;
    startY.current = e.pageY;

    lastMouseX.current = e.pageX;
    lastMoveTime.current = Date.now();
    velocityX.current = 0;

    const { tier, progress } = parseVideoTime(videoRef.current.currentTime);
    startTier.current = tier;
    startProgress.current = progress;

    currentTierRef.current = tier;
    currentProgressRef.current = progress;

    videoRef.current.pause();
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !videoRef.current || !containerRef.current)
        return;

      const now = Date.now();
      const dt = now - lastMoveTime.current;
      if (dt > 0) {
        velocityX.current = (e.pageX - lastMouseX.current) / dt;
      }
      lastMouseX.current = e.pageX;
      lastMoveTime.current = now;

      const deltaX = e.pageX - startX.current;
      const deltaY = e.pageY - startY.current;

      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      // --- X축 연산 ---
      const dragRatioX = (deltaX / containerWidth) * 1.5;
      let newProgress = startProgress.current + dragRatioX;
      newProgress = newProgress % 1;
      if (newProgress < 0) newProgress += 1;

      // --- Y축 연산 ---
      const dragRatioY = deltaY / containerHeight;
      const tierOffset = Math.round(dragRatioY * TOTAL_TIERS * 2.5);
      let newTier = startTier.current + tierOffset;
      if (newTier < 0) newTier = 0;
      if (newTier >= TOTAL_TIERS) newTier = TOTAL_TIERS - 1;

      // 상태 업데이트
      currentProgressRef.current = newProgress;
      currentTierRef.current = newTier;

      let finalTime = newTier * TIER_DURATION + newProgress * TIER_DURATION;
      const videoDuration = videoRef.current.duration || 20;
      if (finalTime < 0) finalTime = 0;
      if (finalTime >= videoDuration) finalTime = videoDuration - 0.01;

      videoRef.current.currentTime = finalTime;
      setCurrentTier(newTier + 1);
    };

    // 🌟 마우스를 뗄 때 실행되는 관성 로직 수정
    const handleGlobalMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        setIsCursorGrabbing(false);

        if (Date.now() - lastMoveTime.current > 50) {
          velocityX.current = 0;
        }

        if (Math.abs(velocityX.current) > 0.05) {
          const startTime = Date.now();
          const initialVelocity = velocityX.current;
          const KEEP_ALIVE_DURATION = 300;

          // 💡 추가: 최대 회전 제한 (0.5는 전체 영상 길이의 절반, 1.0은 한 바퀴)
          const MAX_MOMENTUM_ROTATION = 0.3;
          let totalRotated = 0; // 지금까지 관성으로 이동한 총량 누적

          const applyMomentum = () => {
            if (!videoRef.current || !containerRef.current) return;

            // 1. 시간 제한 OR 2. 최대 이동 거리 제한 도달 시 정지
            if (
              Date.now() - startTime > KEEP_ALIVE_DURATION ||
              Math.abs(totalRotated) >= MAX_MOMENTUM_ROTATION
            ) {
              momentumRaf.current = null;
              return;
            }

            const containerWidth = containerRef.current.offsetWidth;
            const frameDeltaX = initialVelocity * 16;
            const dragRatioX = (frameDeltaX / containerWidth) * 1.5;

            // X축(회전) 더하기
            currentProgressRef.current += dragRatioX;
            currentProgressRef.current = currentProgressRef.current % 1;
            if (currentProgressRef.current < 0) currentProgressRef.current += 1;

            // 💡 총 이동량 누적
            totalRotated += Math.abs(dragRatioX);

            // 영상 프레임 동기화
            let finalTime =
              currentTierRef.current * TIER_DURATION +
              currentProgressRef.current * TIER_DURATION;
            const videoDuration = videoRef.current.duration || 20;
            videoRef.current.currentTime = Math.max(
              0,
              Math.min(finalTime, videoDuration - 0.01),
            );

            momentumRaf.current = requestAnimationFrame(applyMomentum);
          };

          momentumRaf.current = requestAnimationFrame(applyMomentum);
        }
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      if (momentumRaf.current) cancelAnimationFrame(momentumRaf.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '21/9',
        margin: '0 auto 30px auto',
        backgroundColor: '#000',
        overflow: 'hidden',
        cursor: isCursorGrabbing ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          padding: '5px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          pointerEvents: 'none',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        📐 수직 각도: {currentTier}단계 / 5
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '15px',
          left: '5px',
          right: '5px',
          textAlign: 'center',
          color: '#fff',
          background: 'rgba(0,0,0,0.5)',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '13px',
          pointerEvents: 'none',
          width: 'fit-content',
          margin: '0 auto',
          backdropFilter: 'blur(4px)',
        }}
      >
        ↕ 수직 조절 · ↔ 마우스를 튕겨(Flick) 등속 회전
      </div>
    </div>
  );
}

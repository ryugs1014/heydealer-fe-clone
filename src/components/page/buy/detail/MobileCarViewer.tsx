// src/components/page/buy/detail/MobileCarViewer.tsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  useGLTF,
  Environment,
  ContactShadows,
  OrbitControls,
} from '@react-three/drei';
import s from './Car360Viewer.module.scss';
import Image from 'next/image';
import Arrow from '/public/svg/arrow-left-big.svg';

interface MobileCarViewerProps {
  videoSrc: string;
  carData?: any;
  onThumbClick?: () => void;
}

const TIER_DURATION = 4;
const TOTAL_TIERS = 5;
const STEP_SIZE = 0.125; // 45도 단위 스냅

function CarModel() {
  const { scene } = useGLTF('/models/car.glb');

  return (
    <group>
      <primitive object={scene} scale={20} position={[7, -5, 1]} />
      <ContactShadows
        resolution={1024}
        scale={0}
        blur={0}
        opacity={0}
        far={0}
        color="#ffffff"
      />
    </group>
  );
}

export default function MobileCarViewer({
  videoSrc,
  carData,
  onThumbClick,
}: MobileCarViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tierTextRef = useRef<HTMLSpanElement>(null);

  const videoProgressRef = useRef<number>(0);
  const videoTierRef = useRef<number>(0);
  const canvasProgressRef = useRef<number>(0);
  const canvasTierRef = useRef<number>(0);

  const [viewMode, setViewMode] = useState<'video' | 'canvas'>('video');
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  // 터치 드래그 추적용 Ref
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const startProgress = useRef<number>(0);
  const startTier = useRef<number>(0);
  const isTouching = useRef<boolean>(false);

  const info = carData?.detail_info;

  // 타임라인 싱크 및 비디오 재생 위치 지정
  const syncViewerTimeline = () => {
    if (viewMode === 'video' && videoRef.current) {
      const finalTime =
        videoTierRef.current * TIER_DURATION +
        videoProgressRef.current * TIER_DURATION;
      const videoDuration = videoRef.current.duration || 20;
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(finalTime, videoDuration - 0.01),
      );
    }

    if (tierTextRef.current) {
      if (viewMode === 'video') {
        tierTextRef.current.innerText = `수직 각도: ${videoTierRef.current + 1}단계 / 5`;
      } else {
        tierTextRef.current.innerText = '자유 시점 (터치로 360도 및 줌 제어)';
      }
    }
  };

  // 🌟 [수정 완료] 제멋대로 재생되게 만드는 play() 호출을 제거하고, iOS 렌더링 강제를 위해 load()만 호출
  useEffect(() => {
    if (viewMode === 'video' && videoRef.current) {
      videoRef.current.load();
      syncViewerTimeline();
    }
  }, [viewMode]);

  // 터치 시작
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (viewMode === 'canvas' || e.touches.length === 0) return;
    isTouching.current = true;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    startProgress.current =
      viewMode === 'video'
        ? videoProgressRef.current
        : canvasProgressRef.current;
    startTier.current =
      viewMode === 'video' ? videoTierRef.current : canvasTierRef.current;
  };

  // 터치 이동 (가볍게 스와이프 연동)
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (
      viewMode === 'canvas' ||
      !isTouching.current ||
      !containerRef.current ||
      e.touches.length === 0
    )
      return;

    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;

    const containerWidth = containerRef.current.offsetWidth || 400;
    const containerHeight = containerRef.current.offsetHeight || 200;

    const dragRatioX = (deltaX / containerWidth) * 1.5;
    let newProgress = startProgress.current + dragRatioX;
    newProgress = ((newProgress % 1) + 1) % 1;

    const dragRatioY = deltaY / containerHeight;
    const tierOffset = Math.round(dragRatioY * TOTAL_TIERS * 2);
    let newTier = startTier.current + tierOffset;
    newTier = Math.min(TOTAL_TIERS - 1, Math.max(0, newTier));

    if (viewMode === 'video') {
      videoProgressRef.current = newProgress;
      videoTierRef.current = newTier;
    } else {
      canvasProgressRef.current = newProgress;
      canvasTierRef.current = newTier;
    }

    syncViewerTimeline();
  };

  const handleTouchEnd = () => {
    isTouching.current = false;
  };

  // 좌우 버튼 클릭 시 45도(0.125) 단위 스냅 이동
  const handleSnap = (direction: 'left' | 'right') => {
    if (viewMode === 'canvas') return;
    const activeProgressRef =
      viewMode === 'video' ? videoProgressRef : canvasProgressRef;
    const originProgress = activeProgressRef.current;

    let targetProgress =
      direction === 'right'
        ? (Math.floor(originProgress / STEP_SIZE + 0.001) + 1) * STEP_SIZE
        : (Math.ceil(originProgress / STEP_SIZE - 0.001) - 1) * STEP_SIZE;

    activeProgressRef.current = ((targetProgress % 1) + 1) % 1;
    syncViewerTimeline();
  };

  return (
    <div className={s['container']}>
      <div className={s['viewer-wrap']}>
        <div
          className={s['viewer-aspect']}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '21/9',
            backgroundColor: '#000',
            overflow: 'hidden',
            userSelect: 'none',
            touchAction: viewMode === 'canvas' ? 'auto' : 'pan-y',
          }}
        >
          {/* 🌟 [수정 완료] 조건부 렌더링 제거: video를 DOM에 항상 유지하고 display로 숨김 처리 */}
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={syncViewerTimeline}
            onLoadedData={syncViewerTimeline}
            onCanPlayThrough={syncViewerTimeline}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none',
              transform: 'translateZ(0)',
              willChange: 'transform',
              display: viewMode === 'video' ? 'block' : 'none',
            }}
          />

          {viewMode === 'canvas' && (
            <Canvas
              camera={{ position: [0, 1, 6], fov: 60 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'auto',
              }}
            >
              <ambientLight intensity={0.5} />
              <Environment preset="city" />
              <CarModel />
              <OrbitControls
                enablePan={false}
                minDistance={1}
                maxDistance={5}
                rotateSpeed={-1}
              />
            </Canvas>
          )}

          {viewMode === 'video' && (
            <>
              <button
                className={s['arrow']}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSnap('left');
                }}
              >
                <div className={s['svg-box']}>
                  <Arrow width="100%" height="100%" viewBox="0 0 24 24" />
                </div>
              </button>

              <button
                className={`${s['arrow']} ${s['right']}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSnap('right');
                }}
              >
                <div className={s['svg-box']}>
                  <Arrow width="100%" height="100%" viewBox="0 0 24 24" />
                </div>
              </button>
            </>
          )}

          {/* 외부 / 실내 전환 버튼 */}
          <div
            className={s['type-button-wrap']}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`${s['slider-bg']} ${viewMode === 'canvas' ? s['slide-right'] : ''}`}
            />

            <button
              className={`${s['type-button']} ${viewMode === 'video' && s['active-type']}`}
              onClick={() => setViewMode('video')}
            >
              외부
            </button>
            <button
              className={`${s['type-button']} ${viewMode === 'canvas' && s['active-type']}`}
              onClick={() => setViewMode('canvas')}
            >
              실내
            </button>
          </div>
        </div>

        <div
          className={`${s['sub-img-wrap']} img-wrap`}
          onClick={() => setIsDetailOpen(true)}
        >
          {info?.image_urls?.[1] && (
            <div
              className={`${s['secondary-thumb']} img-wrap`}
              onClick={onThumbClick}
            >
              <Image src={info.image_urls[1]} alt="서브" fill sizes="15vw" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

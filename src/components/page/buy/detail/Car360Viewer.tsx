// src/components/page/buy/Car360Viewer.tsx
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
import Fullscreen from '/public/svg/fullscreen.svg';
import Originscreen from '/public/svg/originscreen.svg';

interface Car360ViewerProps {
  videoSrc: string;
  carData?: any;
  onThumbClick?: () => void;
}

const TIER_DURATION = 4;
const TOTAL_TIERS = 5;

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

export default function Car360Viewer({
  videoSrc,
  carData,
  onThumbClick,
}: Car360ViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tierTextRef = useRef<HTMLSpanElement>(null);
  const isSnapAnimating = useRef<boolean>(false);
  const dragRaf = useRef<number | null>(null);

  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const startProgress = useRef<number>(0);
  const startTier = useRef<number>(0);

  const lastMouseX = useRef<number>(0);
  const lastMoveTime = useRef<number>(0);
  const velocityX = useRef<number>(0);
  const momentumRaf = useRef<number | null>(null);

  const videoProgressRef = useRef<number>(0);
  const videoTierRef = useRef<number>(0);
  const canvasProgressRef = useRef<number>(0);
  const canvasTierRef = useRef<number>(0);

  const [viewMode, setViewMode] = useState<'video' | 'canvas'>('video');
  const [isCursorGrabbing, setIsCursorGrabbing] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  const info = carData?.detail_info;

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
        tierTextRef.current.innerText =
          '자유 시점 (마우스/터치로 360도 및 줌 제어)';
      }
    }
  };

  useEffect(() => {
    syncViewerTimeline();
  }, [viewMode]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode === 'canvas') return;

    if (momentumRaf.current) {
      cancelAnimationFrame(momentumRaf.current);
      momentumRaf.current = null;
    }

    isSnapAnimating.current = false;
    isDragging.current = true;
    setIsCursorGrabbing(true);

    startX.current = e.pageX;
    startY.current = e.pageY;
    lastMouseX.current = e.pageX;
    lastMoveTime.current = Date.now();
    velocityX.current = 0;

    startProgress.current =
      viewMode === 'video'
        ? videoProgressRef.current
        : canvasProgressRef.current;
    startTier.current =
      viewMode === 'video' ? videoTierRef.current : canvasTierRef.current;
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (viewMode === 'canvas') return;
      if (!isDragging.current || !containerRef.current) return;

      const now = Date.now();
      const dt = now - lastMoveTime.current;
      if (dt > 0) {
        velocityX.current = (e.pageX - lastMouseX.current) / dt;
      }
      lastMouseX.current = e.pageX;
      lastMoveTime.current = now;

      const deltaX = e.pageX - startX.current;
      const deltaY = e.pageY - startY.current;

      const containerWidth = containerRef.current.offsetWidth || 800;
      const containerHeight = containerRef.current.offsetHeight || 400;

      const dragRatioX = (deltaX / containerWidth) * 1.5;
      let newProgress = startProgress.current + dragRatioX;
      newProgress = ((newProgress % 1) + 1) % 1;

      const dragRatioY = deltaY / containerHeight;
      const tierOffset = Math.round(dragRatioY * TOTAL_TIERS * 2.5);
      let newTier = startTier.current + tierOffset;
      newTier = Math.min(TOTAL_TIERS - 1, Math.max(0, newTier));

      if (viewMode === 'video') {
        videoProgressRef.current = newProgress;
        videoTierRef.current = newTier;
      } else {
        canvasProgressRef.current = newProgress;
        canvasTierRef.current = newTier;
      }

      if (!dragRaf.current) {
        dragRaf.current = requestAnimationFrame(() => {
          syncViewerTimeline();
          dragRaf.current = null;
        });
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        setIsCursorGrabbing(false);

        if (dragRaf.current) {
          cancelAnimationFrame(dragRaf.current);
          dragRaf.current = null;
        }

        if (Date.now() - lastMoveTime.current > 50) {
          velocityX.current = 0;
        }

        if (Math.abs(velocityX.current) > 0.05) {
          let velocity = velocityX.current;
          const friction = 0.75;

          const applyMomentum = () => {
            if (!containerRef.current) return;

            if (Math.abs(velocity) < 0.5) {
              momentumRaf.current = null;
              return;
            }

            velocity *= friction;
            const containerWidth = containerRef.current.offsetWidth || 800;
            const frameDeltaX = velocity * 16;
            const dragRatioX = (frameDeltaX / containerWidth) * 1.5;

            const activeProgressRef =
              viewMode === 'video' ? videoProgressRef : canvasProgressRef;

            activeProgressRef.current =
              (((activeProgressRef.current + dragRatioX) % 1) + 1) % 1;

            syncViewerTimeline();
            momentumRaf.current = requestAnimationFrame(applyMomentum);
          };
          momentumRaf.current = requestAnimationFrame(applyMomentum);
        }
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (momentumRaf.current) cancelAnimationFrame(momentumRaf.current);
      if (dragRaf.current) cancelAnimationFrame(dragRaf.current);
    };
  }, [viewMode]);

  const handleButtonClickSnap45 = (direction: 'left' | 'right') => {
    if (viewMode === 'canvas') return;
    if (isSnapAnimating.current) return;
    if (momentumRaf.current) cancelAnimationFrame(momentumRaf.current);

    isSnapAnimating.current = true;

    const startTime = Date.now();
    const DURATION = 250;

    const activeProgressRef =
      viewMode === 'video' ? videoProgressRef : canvasProgressRef;
    const originProgress = activeProgressRef.current;

    const STEP_SIZE = 0.125;

    let targetProgress =
      direction === 'right'
        ? (Math.floor(originProgress / STEP_SIZE + 0.001) + 1) * STEP_SIZE
        : (Math.ceil(originProgress / STEP_SIZE - 0.001) - 1) * STEP_SIZE;

    const progressDelta = targetProgress - originProgress;

    const runSnapAnim = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / DURATION, 1);

      const nextProgress = originProgress + progressDelta * t;
      activeProgressRef.current = ((nextProgress % 1) + 1) % 1;

      syncViewerTimeline();

      if (t < 1) {
        momentumRaf.current = requestAnimationFrame(runSnapAnim);
      } else {
        activeProgressRef.current = ((targetProgress % 1) + 1) % 1;
        syncViewerTimeline();
        momentumRaf.current = null;
        isSnapAnimating.current = false;
      }
    };

    momentumRaf.current = requestAnimationFrame(runSnapAnim);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .catch((err) => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className={s['container']}>
      <div
        className={`${s['viewer-wrap']} ${isFullscreen ? s['full'] : ''}`}
        ref={containerRef}
      >
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: isFullscreen ? '17/9' : '21/9',
            height: isFullscreen ? 'auto' : 'auto',
            backgroundColor: '#000',
            overflow: 'hidden',
            cursor: isCursorGrabbing ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
        >
          {viewMode === 'video' ? (
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={syncViewerTimeline}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
              }}
            />
          ) : (
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
              />
            </Canvas>
          )}
          {viewMode === 'video' && (
            <>
              <button
                className={s['arrow']}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleButtonClickSnap45('left');
                }}
              >
                <div className={s['svg-box']}>
                  <Arrow width="100%" height="100%" viewBox="0 0 24 24" />
                </div>
              </button>

              <button
                className={`${s['arrow']} ${s['right']}`}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleButtonClickSnap45('right');
                }}
              >
                <div className={s['svg-box']}>
                  <Arrow width="100%" height="100%" viewBox="0 0 24 24" />
                </div>
              </button>
            </>
          )}

          <button
            className={s['fullscreen-button']}
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
          >
            {isFullscreen ? (
              <div className={s['svg-box']}>
                <Originscreen width="100%" height="100%" viewBox="0 0 24 24" />
              </div>
            ) : (
              <div className={s['svg-box']}>
                <Fullscreen width="100%" height="100%" viewBox="0 0 24 24" />
              </div>
            )}
          </button>

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

        {isFullscreen ? (
          ''
        ) : (
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
        )}
      </div>
    </div>
  );
}

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useVideoElement } from '../useVideoElement';
import { useVideoControl } from '../useVideoControl';
import { useVideoStore } from '../store';
import { VideoPlayerProps } from '../types';
import clsx from 'clsx';

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  (
    {
      id,
      src,
      autoPlay = false,
      muted = false,
      poster,
      onLoaded,
      onTimeUpdate,
      onStatusChange,
      children,
    },
    ref
  ) => {
    const internalVideoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<HTMLDivElement>(null);
    const { videoRef, onUserInteract } = useVideoElement(id);
    const control = useVideoControl(id);
    const { getStore } = useVideoStore.getState();
    const store = getStore(id);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      if (store) {
        control.setMuted(muted);
      }
    }, [muted, control]);

    useEffect(() => {
      if (videoRef.current) {
        if (ref) {
          if (typeof ref === 'function') {
            ref(videoRef.current);
          } else {
            ref.current = videoRef.current;
          }
        }
        onLoaded?.(videoRef.current);
        setIsReady(true);
      }
    }, [videoRef.current, ref, onLoaded]);

    useEffect(() => {
      if (autoPlay && src) {
        const play = async () => {
          try {
            await videoRef.current?.play();
          } catch (e) {
            console.warn('Auto-play was prevented:', e);
          }
        };
        play();
      }
    }, [autoPlay, src]);

    useEffect(() => {
      if (store && onTimeUpdate) {
        return () => {
          onTimeUpdate(store.getState().currentTime);
        };
      }
    }, [store?.getState().currentTime, onTimeUpdate]);

    useEffect(() => {
      if (store && onStatusChange) {
        return () => {
          onStatusChange(store.getState().videoStatus);
        };
      }
    }, [store?.getState().videoStatus, onStatusChange]);

    const handleClick = (e: React.MouseEvent) => {
      onUserInteract();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      onUserInteract();
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          control.paused ? control.play() : control.pause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          control.seek(Math.max(0, control.currentTime - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          control.seek(Math.min(control.duration, control.currentTime + 10));
          break;
        case 'ArrowUp':
          e.preventDefault();
          control.setVolume(control.volume + 0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          control.setVolume(Math.max(0, control.volume - 0.1));
          break;
        case 'm':
          control.toggleMute();
          break;
        case 'f':
          if (playerRef.current) {
            control.toggleFullscreen(playerRef.current);
          }
          break;
      }
    };

    return (
      <div
        ref={playerRef}
        className={clsx('vp-player', {
          'is-ready': isReady,
          'is-playing': control.paused === false,
        })}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <video
          ref={(el) => {
            (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
          }}
          className="vp-video"
          src={src}
          poster={poster}
          playsInline
          muted={muted}
        />
        {children}
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useVideoControl } from '../../useVideoControl';
import { SeekbarProps } from '../../types';
import clsx from 'clsx';

export const Seekbar: React.FC<SeekbarProps> = ({
  id,
  className,
  showTime = true,
  showBuffered = true,
}) => {
  const {
    currentTime,
    duration,
    paused,
    seek,
    buffered,
  } = useVideoControl(id);

  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatTime = useCallback((time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const getProgress = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!progressRef.current) return 0;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    return Math.max(0, Math.min(1, x / rect.width));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    const progress = getProgress(e);
    seek(progress * duration);
  }, [duration, getProgress, seek]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const progress = getProgress(e);
    seek(progress * duration);
  }, [isDragging, duration, getProgress, seek]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={clsx('vp-seekbar-container', className)}>
      {showBuffered && buffered.length > 0 && (
        <div className="vp-seekbar-buffered">
          {buffered.map((range: { start: number; end: number }, i: number) => (
            <div
              key={i}
              className="vp-seekbar-buffered-range"
              style={{
                left: `${(range.start / duration) * 100}%`,
                width: `${((range.end - range.start) / duration) * 100}%`,
              }}
            />
          ))}
        </div>
      )}
      <div
        ref={progressRef}
        className={clsx('vp-seekbar', { 'is-dragging': isDragging })}
        onMouseDown={handleMouseDown}
      >
        <div
          className="vp-seekbar-progress"
          style={{ width: `${progress}%` }}
        />
        <div
          className="vp-seekbar-thumb"
          style={{ left: `${progress}%` }}
        />
      </div>
      {showTime && (
        <div className="vp-seekbar-times">
          <span className="vp-seekbar-current">{formatTime(currentTime)}</span>
          <span className="vp-seekbar-duration">{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
};

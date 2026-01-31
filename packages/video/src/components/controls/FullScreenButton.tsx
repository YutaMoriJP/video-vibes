import React, { useCallback } from 'react';
import { useVideoControl } from '../../useVideoControl';
import { ControlProps } from '../../types';
import clsx from 'clsx';

interface FullScreenButtonProps extends ControlProps {
  targetRef: React.RefObject<HTMLElement>;
}

export const FullScreenButton: React.FC<FullScreenButtonProps> = ({
  id,
  className,
  targetRef,
}) => {
  const { isFullscreen, toggleFullscreen } = useVideoControl(id);

  const handleClick = useCallback(async () => {
    if (targetRef.current) {
      await toggleFullscreen(targetRef.current);
    }
  }, [toggleFullscreen, targetRef]);

  return (
    <button
      className={clsx('vp-fullscreen-button', className, {
        'is-active': isFullscreen,
      })}
      onClick={handleClick}
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    >
      {isFullscreen ? (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
        </svg>
      )}
    </button>
  );
};

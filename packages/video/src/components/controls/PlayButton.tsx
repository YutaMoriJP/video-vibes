import React from 'react';
import { useVideoControl } from '../../useVideoControl';
import { ControlProps } from '../../types';
import clsx from 'clsx';

export const PlayButton: React.FC<ControlProps> = ({ id, className }) => {
  const { paused, togglePlay } = useVideoControl(id);

  return (
    <button
      className={clsx('vp-play-button', className)}
      onClick={togglePlay}
      aria-label={paused ? 'Play' : 'Pause'}
    >
      {paused ? (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      )}
    </button>
  );
};

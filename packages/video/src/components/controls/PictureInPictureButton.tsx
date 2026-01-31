import React, { useCallback } from 'react';
import { useVideoControl } from '../../useVideoControl';
import { ControlProps } from '../../types';
import clsx from 'clsx';

interface PiPButtonProps extends ControlProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const PictureInPictureButton: React.FC<PiPButtonProps> = ({
  id,
  className,
  videoRef,
}) => {
  const { isPictureInPicture, togglePictureInPicture } = useVideoControl(id);

  const handleClick = useCallback(async () => {
    if (videoRef.current) {
      await togglePictureInPicture(videoRef.current);
    }
  }, [togglePictureInPicture, videoRef]);

  return (
    <button
      className={clsx('vp-pip-button', className, {
        'is-active': isPictureInPicture,
      })}
      onClick={handleClick}
      aria-label={
        isPictureInPicture ? 'Exit picture in picture' : 'Enter picture in picture'
      }
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" />
      </svg>
    </button>
  );
};

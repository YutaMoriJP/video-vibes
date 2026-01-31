import React, { useState, useCallback } from 'react';
import { useVideoControl } from '../../useVideoControl';
import { ControlProps } from '../../types';
import clsx from 'clsx';

const RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

interface PlaybackRateButtonProps extends ControlProps {
  showMenu?: boolean;
}

export const PlaybackRateButton: React.FC<PlaybackRateButtonProps> = ({
  id,
  className,
  showMenu = true,
}) => {
  const { playbackRate, setPlaybackRate } = useVideoControl(id);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = useCallback(() => {
    if (showMenu) {
      setIsMenuOpen(!isMenuOpen);
    }
  }, [showMenu, isMenuOpen]);

  const handleRateSelect = useCallback(
    (rate: number) => {
      setPlaybackRate(rate);
      setIsMenuOpen(false);
    },
    [setPlaybackRate]
  );

  return (
    <div className={clsx('vp-playback-rate', className)}>
      <button
        className="vp-playback-rate-button"
        onClick={handleClick}
        aria-label={`Playback rate: ${playbackRate}x`}
        aria-expanded={isMenuOpen}
      >
        {playbackRate}x
      </button>
      {showMenu && isMenuOpen && (
        <div className="vp-playback-rate-menu">
          {RATES.map((rate) => (
            <button
              key={rate}
              className={clsx('vp-playback-rate-option', {
                'is-active': rate === playbackRate,
              })}
              onClick={() => handleRateSelect(rate)}
            >
              {rate}x
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

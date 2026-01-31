import React, { useCallback } from 'react';
import { useVideoControl } from '../../useVideoControl';
import { ControlProps } from '../../types';

interface TimeDisplayProps extends ControlProps {
  showDuration?: boolean;
  separator?: string;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  id,
  showDuration = true,
  separator = ' / ',
}) => {
  const { currentTime, duration } = useVideoControl(id);

  const formatTime = useCallback((time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className="vp-time-display">
      <span className="vp-time-current">{formatTime(currentTime)}</span>
      {showDuration && (
        <>
          <span className="vp-time-separator">{separator}</span>
          <span className="vp-time-duration">{formatTime(duration)}</span>
        </>
      )}
    </div>
  );
};

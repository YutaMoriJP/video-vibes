import React, { useRef } from 'react';
import { VideoPlayerProps } from '../types';
import { VideoPlayer } from './VideoPlayer';
import {
  PlayButton,
  Seekbar,
  VolumeControl,
  FullScreenButton,
  PictureInPictureButton,
  PlaybackRateButton,
  TimeDisplay,
} from './controls/index';
import clsx from 'clsx';

interface DefaultControlsProps extends VideoPlayerProps {
  showTime?: boolean;
  showBuffered?: boolean;
  showMuteToggle?: boolean;
  showVolumeSlider?: boolean;
  showPlaybackRate?: boolean;
  showPiP?: boolean;
  showFullscreen?: boolean;
  placement?: 'bottom' | 'overlay';
}

export const DefaultControls: React.FC<DefaultControlsProps> = ({
  id,
  placement = 'bottom',
  showTime = true,
  showBuffered = true,
  showMuteToggle = true,
  showVolumeSlider = true,
  showPlaybackRate = true,
  showPiP = true,
  showFullscreen = true,
  children,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const playerRef = useRef<HTMLDivElement>(null!);

  return (
    <VideoPlayer id={id} ref={videoRef} {...props}>
      <div
        className={clsx('vp-controls', `vp-controls-${placement}`, {
          'is-overlay': placement === 'overlay',
        })}
      >
        <div className="vp-controls-top">{children}</div>
        <div className="vp-controls-bottom">
          <Seekbar
            id={id}
            showTime={showTime}
            showBuffered={showBuffered}
          />
          <div className="vp-controls-row">
            <div className="vp-controls-left">
              <PlayButton id={id} />
              <VolumeControl
                id={id}
                showMuteToggle={showMuteToggle}
                vertical={!showVolumeSlider}
              />
              <TimeDisplay id={id} showDuration={showTime} />
            </div>
            <div className="vp-controls-right">
              {showPlaybackRate && <PlaybackRateButton id={id} />}
              {showPiP && (
                <PictureInPictureButton id={id} videoRef={videoRef} />
              )}
              {showFullscreen && (
                <FullScreenButton id={id} targetRef={playerRef} />
              )}
            </div>
          </div>
        </div>
      </div>
    </VideoPlayer>
  );
};

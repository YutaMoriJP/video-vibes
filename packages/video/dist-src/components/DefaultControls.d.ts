import React from 'react';
import { VideoPlayerProps } from '../types';
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
export declare const DefaultControls: React.FC<DefaultControlsProps>;
export {};

import { StoreApi } from 'zustand';
import * as React$1 from 'react';
import React__default from 'react';

type VideoStatus = 'WAITING' | 'CAN_PLAY' | 'PLAYING' | 'PAUSED' | 'ENDED' | 'ERROR' | 'SEEKING' | 'BUFFERING' | 'LOADING';
interface VideoState {
    currentTime: number;
    duration: number;
    paused: boolean;
    muted: boolean;
    volume: number;
    videoStatus: VideoStatus;
    buffered: {
        start: number;
        end: number;
    }[];
    playbackRate: number;
    isFullscreen: boolean;
    isPictureInPicture: boolean;
    error: string | null;
}
interface VideoActions {
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
    setPaused: (paused: boolean) => void;
    setMuted: (muted: boolean) => void;
    setVolume: (volume: number) => void;
    setVideoStatus: (status: VideoStatus) => void;
    setBuffered: (buffered: {
        start: number;
        end: number;
    }[]) => void;
    setPlaybackRate: (rate: number) => void;
    setFullscreen: (isFullscreen: boolean) => void;
    setPictureInPicture: (isPip: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}
interface GlobalState {
    videoInteractionOnce: boolean;
    setVideoInteractionOnce: (interacted: boolean) => void;
}
type VideoStore = VideoState & VideoActions;
interface VideoPlayerProps {
    id: string | number;
    src?: string;
    autoPlay?: boolean;
    muted?: boolean;
    poster?: string;
    onLoaded?: (videoElement: HTMLVideoElement) => void;
    onTimeUpdate?: (time: number) => void;
    onStatusChange?: (status: VideoStatus) => void;
    children?: React.ReactNode;
}
interface ControlProps {
    id: string | number;
    className?: string;
}
interface SeekbarProps extends ControlProps {
    showTime?: boolean;
    showBuffered?: boolean;
}
interface VolumeControlProps extends ControlProps {
    showMuteToggle?: boolean;
    vertical?: boolean;
}

interface VideoStoreRecord {
    [id: string | number]: StoreApi<VideoStore> | undefined;
}
interface FullState extends GlobalState {
    videos: VideoStoreRecord;
    getOrCreateStore: (id: string | number) => StoreApi<VideoStore>;
    getStore: (id: string | number) => StoreApi<VideoStore> | undefined;
    removeStore: (id: string | number) => void;
    setVideoInteractionOnce: (interacted: boolean) => void;
}
declare const useVideoStore: StoreApi<FullState>;
declare const useGlobalStore: () => {
    videoInteractionOnce: boolean;
    setVideoInteractionOnce: (interacted: boolean) => void;
};

declare function useVideoElement(id: string | number): {
    videoRef: React$1.RefObject<HTMLVideoElement | null>;
    onUserInteract: () => void;
};

declare function useVideoControl(id: string | number): {
    currentTime: number;
    duration: number;
    paused: boolean;
    muted: boolean;
    volume: number;
    videoStatus: VideoStatus;
    buffered: {
        start: number;
        end: number;
    }[];
    playbackRate: number;
    isFullscreen: boolean;
    isPictureInPicture: boolean;
    error: string | null;
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    setCurrentTime: (time: number) => void;
    seek: (time: number) => void;
    setMuted: (muted: boolean) => void;
    toggleMute: () => void;
    setVolume: (volume: number) => void;
    setPlaybackRate: (rate: number) => void;
    toggleFullscreen: (element: HTMLElement) => Promise<void>;
    togglePictureInPicture: (video: HTMLVideoElement) => Promise<void>;
    reset: () => void;
};

declare const VideoPlayer: React__default.ForwardRefExoticComponent<VideoPlayerProps & React__default.RefAttributes<HTMLVideoElement>>;

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
declare const DefaultControls: React__default.FC<DefaultControlsProps>;

declare const PlayButton: React__default.FC<ControlProps>;

declare const Seekbar: React__default.FC<SeekbarProps>;

declare const VolumeControl: React__default.FC<VolumeControlProps>;

interface FullScreenButtonProps extends ControlProps {
    targetRef: React__default.RefObject<HTMLElement>;
}
declare const FullScreenButton: React__default.FC<FullScreenButtonProps>;

interface PiPButtonProps extends ControlProps {
    videoRef: React__default.RefObject<HTMLVideoElement>;
}
declare const PictureInPictureButton: React__default.FC<PiPButtonProps>;

interface PlaybackRateButtonProps extends ControlProps {
    showMenu?: boolean;
}
declare const PlaybackRateButton: React__default.FC<PlaybackRateButtonProps>;

interface TimeDisplayProps extends ControlProps {
    showDuration?: boolean;
    separator?: string;
}
declare const TimeDisplay: React__default.FC<TimeDisplayProps>;

export { type ControlProps, DefaultControls, FullScreenButton, type GlobalState, PictureInPictureButton, PlayButton, PlaybackRateButton, Seekbar, type SeekbarProps, TimeDisplay, type VideoActions, VideoPlayer, type VideoPlayerProps, type VideoState, type VideoStatus, type VideoStore, VolumeControl, type VolumeControlProps, useGlobalStore, useVideoControl, useVideoElement, useVideoStore };

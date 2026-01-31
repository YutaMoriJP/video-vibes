export type VideoStatus = 'WAITING' | 'CAN_PLAY' | 'PLAYING' | 'PAUSED' | 'ENDED' | 'ERROR' | 'SEEKING' | 'BUFFERING' | 'LOADING';
export interface VideoState {
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
export interface VideoActions {
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
export interface GlobalState {
    videoInteractionOnce: boolean;
    setVideoInteractionOnce: (interacted: boolean) => void;
}
export type VideoStore = VideoState & VideoActions;
export interface VideoPlayerProps {
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
export interface ControlProps {
    id: string | number;
    className?: string;
}
export interface SeekbarProps extends ControlProps {
    showTime?: boolean;
    showBuffered?: boolean;
}
export interface VolumeControlProps extends ControlProps {
    showMuteToggle?: boolean;
    vertical?: boolean;
}

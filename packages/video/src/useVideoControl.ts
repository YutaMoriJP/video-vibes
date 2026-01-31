import { useCallback } from 'react';
import { useVideoStore } from './store';

export function useVideoControl(id: string | number) {
  const store = useVideoStore.getState().getOrCreateStore(id);
  const state = store.getState();

  const play = useCallback(() => {
    state.setPaused(false);
  }, [state]);

  const pause = useCallback(() => {
    state.setPaused(true);
  }, [state]);

  const togglePlay = useCallback(() => {
    state.setPaused(!state.paused);
  }, [state]);

  const setCurrentTime = useCallback((time: number) => {
    state.setCurrentTime(time);
  }, [state]);

  const seek = useCallback((time: number) => {
    state.setCurrentTime(time);
    state.setVideoStatus('SEEKING');
  }, [state]);

  const setMuted = useCallback((muted: boolean) => {
    state.setMuted(muted);
  }, [state]);

  const toggleMute = useCallback(() => {
    state.setMuted(!state.muted);
  }, [state]);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    state.setVolume(clampedVolume);
    if (clampedVolume > 0 && state.muted) {
      state.setMuted(false);
    }
  }, [state]);

  const setPlaybackRate = useCallback((rate: number) => {
    state.setPlaybackRate(rate);
  }, [state]);

  const toggleFullscreen = useCallback(async (element: HTMLElement) => {
    if (!document.fullscreenElement) {
      await element.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  const togglePictureInPicture = useCallback(async (video: HTMLVideoElement) => {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await video.requestPictureInPicture();
    }
  }, []);

  const reset = useCallback(() => {
    state.reset();
  }, [state]);

  return {
    currentTime: state.currentTime,
    duration: state.duration,
    paused: state.paused,
    muted: state.muted,
    volume: state.volume,
    videoStatus: state.videoStatus,
    buffered: state.buffered,
    playbackRate: state.playbackRate,
    isFullscreen: state.isFullscreen,
    isPictureInPicture: state.isPictureInPicture,
    error: state.error,
    play,
    pause,
    togglePlay,
    setCurrentTime,
    seek,
    setMuted,
    toggleMute,
    setVolume,
    setPlaybackRate,
    toggleFullscreen,
    togglePictureInPicture,
    reset,
  };
}

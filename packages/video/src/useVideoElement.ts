import { useEffect, useRef, useCallback } from "react";
import { useVideoStore } from "./store";

export function useVideoElement(id: string | number) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const store = useVideoStore.getState().getOrCreateStore(id);
  const globalStore = useVideoStore.getState();

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      store.getState().setDuration(videoRef.current.duration);
      store.getState().setVideoStatus("CAN_PLAY");
    }
  }, [store]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      store.getState().setCurrentTime(videoRef.current.currentTime);
    }
  }, [store]);

  const handlePlay = useCallback(() => {
    store.getState().setPaused(false);
    store.getState().setVideoStatus("PLAYING");
  }, [store]);

  const handlePause = useCallback(() => {
    store.getState().setPaused(true);
    store.getState().setVideoStatus("PAUSED");
  }, [store]);

  const handleWaiting = useCallback(() => {
    store.getState().setVideoStatus("WAITING");
  }, [store]);

  const handleCanPlayThrough = useCallback(() => {
    store.getState().setVideoStatus("CAN_PLAY");
  }, [store]);

  const handleEnded = useCallback(() => {
    store.getState().setPaused(true);
    store.getState().setVideoStatus("ENDED");
  }, [store]);

  const handleSeeking = useCallback(() => {
    store.getState().setVideoStatus("SEEKING");
  }, [store]);

  const handleSeeked = useCallback(() => {
    store.getState().setVideoStatus(store.getState().paused ? "PAUSED" : "PLAYING");
  }, [store]);

  const handleProgress = useCallback(() => {
    if (videoRef.current) {
      const buffered: { start: number; end: number }[] = [];
      for (let i = 0; i < videoRef.current.buffered.length; i++) {
        buffered.push({
          start: videoRef.current.buffered.start(i),
          end: videoRef.current.buffered.end(i)
        });
      }
      store.getState().setBuffered(buffered);
    }
  }, [store]);

  const handleError = useCallback(() => {
    store.getState().setError("Video playback error");
  }, [store]);

  const handleVolumeChange = useCallback(() => {
    if (videoRef.current) {
      store.getState().setMuted(videoRef.current.muted);
      store.getState().setVolume(videoRef.current.volume);
    }
  }, [store]);

  const handleRateChange = useCallback(() => {
    if (videoRef.current) {
      store.getState().setPlaybackRate(videoRef.current.playbackRate);
    }
  }, [store]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const state = store.getState();

    const events: [string, EventListener][] = [
      ["loadedmetadata", handleLoadedMetadata],
      ["timeupdate", handleTimeUpdate],
      ["play", handlePlay],
      ["pause", handlePause],
      ["waiting", handleWaiting],
      ["canplaythrough", handleCanPlayThrough],
      ["ended", handleEnded],
      ["seeking", handleSeeking],
      ["seeked", handleSeeked],
      ["progress", handleProgress],
      ["error", handleError],
      ["volumechange", handleVolumeChange],
      ["ratechange", handleRateChange],
      [
        "fullscreenchange",
        () => {
          state.setFullscreen(!!document.fullscreenElement);
        }
      ],
      [
        "enterpictureinpicture",
        () => {
          state.setPictureInPicture(true);
        }
      ],
      [
        "leavepictureinpicture",
        () => {
          state.setPictureInPicture(false);
        }
      ]
    ];

    events.forEach(([event, handler]) => {
      video.addEventListener(event, handler);
    });

    return () => {
      events.forEach(([event, handler]) => {
        video.removeEventListener(event, handler);
      });
    };
  }, [
    store,
    handleLoadedMetadata,
    handleTimeUpdate,
    handlePlay,
    handlePause,
    handleWaiting,
    handleCanPlayThrough,
    handleEnded,
    handleSeeking,
    handleSeeked,
    handleProgress,
    handleError,
    handleVolumeChange,
    handleRateChange
  ]);

  const onUserInteract = useCallback(() => {
    globalStore.setVideoInteractionOnce(true);
  }, [globalStore]);

  return {
    videoRef,
    onUserInteract
  };
}

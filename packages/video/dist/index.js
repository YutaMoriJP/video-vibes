// ../../node_modules/.pnpm/zustand@5.0.10_@types+react@19.2.10_react@19.2.4/node_modules/zustand/esm/vanilla.mjs
var createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api);
  return api;
};
var createStore = ((createState) => createState ? createStoreImpl(createState) : createStoreImpl);

// src/store.ts
var createDefaultVideoState = () => ({
  currentTime: 0,
  duration: 0,
  paused: true,
  muted: false,
  volume: 1,
  videoStatus: "WAITING",
  buffered: [],
  playbackRate: 1,
  isFullscreen: false,
  isPictureInPicture: false,
  error: null
});
var globalInitialState = {
  videoInteractionOnce: false,
  setVideoInteractionOnce: () => {
  }
};
var createVideoStore = () => {
  const videoStores = {};
  return createStore((set, get) => ({
    ...globalInitialState,
    videos: videoStores,
    getOrCreateStore: (id) => {
      if (videoStores[id]) return videoStores[id];
      const newStore = createStore((setState) => ({
        ...createDefaultVideoState(),
        setCurrentTime: (time) => setState({ currentTime: time }),
        setDuration: (duration) => setState({ duration }),
        setPaused: (paused) => {
          setState({ paused, videoStatus: paused ? "PAUSED" : "PLAYING" });
        },
        setMuted: (muted) => setState({ muted }),
        setVolume: (volume) => setState({ volume }),
        setVideoStatus: (status) => setState({ videoStatus: status }),
        setBuffered: (buffered) => setState({ buffered }),
        setPlaybackRate: (rate) => setState({ playbackRate: rate }),
        setFullscreen: (isFullscreen) => setState({ isFullscreen }),
        setPictureInPicture: (isPip) => setState({ isPictureInPicture: isPip }),
        setError: (error) => {
          setState({ error, videoStatus: error ? "ERROR" : "WAITING" });
        },
        reset: () => setState({ ...createDefaultVideoState() })
      }));
      videoStores[id] = newStore;
      return newStore;
    },
    getStore: (id) => videoStores[id],
    removeStore: (id) => {
      const store = videoStores[id];
      if (store) {
        store.getState().reset();
      }
      delete videoStores[id];
    },
    setVideoInteractionOnce: (interacted) => {
      set({ videoInteractionOnce: interacted });
    }
  }));
};
var useVideoStore = createVideoStore();
var useGlobalStore = () => {
  const state = useVideoStore.getState();
  return {
    videoInteractionOnce: state.videoInteractionOnce,
    setVideoInteractionOnce: state.setVideoInteractionOnce
  };
};

// src/useVideoElement.ts
import { useEffect, useRef, useCallback } from "react";
function useVideoElement(id) {
  const videoRef = useRef(null);
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
      const buffered = [];
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
    const events = [
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
      ["fullscreenchange", () => {
        state.setFullscreen(!!document.fullscreenElement);
      }],
      ["enterpictureinpicture", () => {
        state.setPictureInPicture(true);
      }],
      ["leavepictureinpicture", () => {
        state.setPictureInPicture(false);
      }]
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

// src/useVideoControl.ts
import { useCallback as useCallback2 } from "react";
function useVideoControl(id) {
  const store = useVideoStore.getState().getOrCreateStore(id);
  const state = store.getState();
  const play = useCallback2(() => {
    state.setPaused(false);
  }, [state]);
  const pause = useCallback2(() => {
    state.setPaused(true);
  }, [state]);
  const togglePlay = useCallback2(() => {
    state.setPaused(!state.paused);
  }, [state]);
  const setCurrentTime = useCallback2((time) => {
    state.setCurrentTime(time);
  }, [state]);
  const seek = useCallback2((time) => {
    state.setCurrentTime(time);
    state.setVideoStatus("SEEKING");
  }, [state]);
  const setMuted = useCallback2((muted) => {
    state.setMuted(muted);
  }, [state]);
  const toggleMute = useCallback2(() => {
    state.setMuted(!state.muted);
  }, [state]);
  const setVolume = useCallback2((volume) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    state.setVolume(clampedVolume);
    if (clampedVolume > 0 && state.muted) {
      state.setMuted(false);
    }
  }, [state]);
  const setPlaybackRate = useCallback2((rate) => {
    state.setPlaybackRate(rate);
  }, [state]);
  const toggleFullscreen = useCallback2(async (element) => {
    if (!document.fullscreenElement) {
      await element.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);
  const togglePictureInPicture = useCallback2(async (video) => {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await video.requestPictureInPicture();
    }
  }, []);
  const reset = useCallback2(() => {
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
    reset
  };
}

// src/components/VideoPlayer.tsx
import { forwardRef, useEffect as useEffect2, useRef as useRef2, useState } from "react";

// ../../node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  } else for (f in e) e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}
var clsx_default = clsx;

// src/components/VideoPlayer.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var VideoPlayer = forwardRef(
  ({
    id,
    src,
    autoPlay = false,
    muted = false,
    poster,
    onLoaded,
    onTimeUpdate,
    onStatusChange,
    children
  }, ref) => {
    const internalVideoRef = useRef2(null);
    const playerRef = useRef2(null);
    const { videoRef, onUserInteract } = useVideoElement(id);
    const control = useVideoControl(id);
    const { getStore } = useVideoStore.getState();
    const store = getStore(id);
    const [isReady, setIsReady] = useState(false);
    useEffect2(() => {
      if (store) {
        control.setMuted(muted);
      }
    }, [muted, control]);
    useEffect2(() => {
      if (videoRef.current) {
        if (ref) {
          if (typeof ref === "function") {
            ref(videoRef.current);
          } else {
            ref.current = videoRef.current;
          }
        }
        onLoaded?.(videoRef.current);
        setIsReady(true);
      }
    }, [videoRef.current, ref, onLoaded]);
    useEffect2(() => {
      if (autoPlay && src) {
        const play = async () => {
          try {
            await videoRef.current?.play();
          } catch (e) {
            console.warn("Auto-play was prevented:", e);
          }
        };
        play();
      }
    }, [autoPlay, src]);
    useEffect2(() => {
      if (store && onTimeUpdate) {
        return () => {
          onTimeUpdate(store.getState().currentTime);
        };
      }
    }, [store?.getState().currentTime, onTimeUpdate]);
    useEffect2(() => {
      if (store && onStatusChange) {
        return () => {
          onStatusChange(store.getState().videoStatus);
        };
      }
    }, [store?.getState().videoStatus, onStatusChange]);
    const handleClick = (e) => {
      onUserInteract();
    };
    const handleKeyDown = (e) => {
      onUserInteract();
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          control.paused ? control.play() : control.pause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          control.seek(Math.max(0, control.currentTime - 10));
          break;
        case "ArrowRight":
          e.preventDefault();
          control.seek(Math.min(control.duration, control.currentTime + 10));
          break;
        case "ArrowUp":
          e.preventDefault();
          control.setVolume(control.volume + 0.1);
          break;
        case "ArrowDown":
          e.preventDefault();
          control.setVolume(Math.max(0, control.volume - 0.1));
          break;
        case "m":
          control.toggleMute();
          break;
        case "f":
          if (playerRef.current) {
            control.toggleFullscreen(playerRef.current);
          }
          break;
      }
    };
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref: playerRef,
        className: clsx_default("vp-player", {
          "is-ready": isReady,
          "is-playing": control.paused === false
        }),
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        tabIndex: 0,
        children: [
          /* @__PURE__ */ jsx(
            "video",
            {
              ref: (el) => {
                videoRef.current = el;
              },
              className: "vp-video",
              src,
              poster,
              playsInline: true,
              muted
            }
          ),
          children
        ]
      }
    );
  }
);
VideoPlayer.displayName = "VideoPlayer";

// src/components/DefaultControls.tsx
import { useRef as useRef4 } from "react";

// src/components/controls/PlayButton.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var PlayButton = ({ id, className }) => {
  const { paused, togglePlay } = useVideoControl(id);
  return /* @__PURE__ */ jsx2(
    "button",
    {
      className: clsx_default("vp-play-button", className),
      onClick: togglePlay,
      "aria-label": paused ? "Play" : "Pause",
      children: paused ? /* @__PURE__ */ jsx2("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx2("path", { d: "M8 5v14l11-7z" }) }) : /* @__PURE__ */ jsx2("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx2("path", { d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z" }) })
    }
  );
};

// src/components/controls/Seekbar.tsx
import { useRef as useRef3, useCallback as useCallback3, useEffect as useEffect3, useState as useState2 } from "react";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var Seekbar = ({
  id,
  className,
  showTime = true,
  showBuffered = true
}) => {
  const {
    currentTime,
    duration,
    paused,
    seek,
    buffered
  } = useVideoControl(id);
  const progressRef = useRef3(null);
  const [isDragging, setIsDragging] = useState2(false);
  const formatTime = useCallback3((time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor(time % 3600 / 60);
    const seconds = Math.floor(time % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);
  const getProgress = useCallback3((e) => {
    if (!progressRef.current) return 0;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    return Math.max(0, Math.min(1, x / rect.width));
  }, []);
  const handleMouseDown = useCallback3((e) => {
    setIsDragging(true);
    const progress2 = getProgress(e);
    seek(progress2 * duration);
  }, [duration, getProgress, seek]);
  const handleMouseMove = useCallback3((e) => {
    if (!isDragging) return;
    const progress2 = getProgress(e);
    seek(progress2 * duration);
  }, [isDragging, duration, getProgress, seek]);
  const handleMouseUp = useCallback3(() => {
    setIsDragging(false);
  }, []);
  useEffect3(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  const progress = duration > 0 ? currentTime / duration * 100 : 0;
  return /* @__PURE__ */ jsxs2("div", { className: clsx_default("vp-seekbar-container", className), children: [
    showBuffered && buffered.length > 0 && /* @__PURE__ */ jsx3("div", { className: "vp-seekbar-buffered", children: buffered.map((range, i) => /* @__PURE__ */ jsx3(
      "div",
      {
        className: "vp-seekbar-buffered-range",
        style: {
          left: `${range.start / duration * 100}%`,
          width: `${(range.end - range.start) / duration * 100}%`
        }
      },
      i
    )) }),
    /* @__PURE__ */ jsxs2(
      "div",
      {
        ref: progressRef,
        className: clsx_default("vp-seekbar", { "is-dragging": isDragging }),
        onMouseDown: handleMouseDown,
        children: [
          /* @__PURE__ */ jsx3(
            "div",
            {
              className: "vp-seekbar-progress",
              style: { width: `${progress}%` }
            }
          ),
          /* @__PURE__ */ jsx3(
            "div",
            {
              className: "vp-seekbar-thumb",
              style: { left: `${progress}%` }
            }
          )
        ]
      }
    ),
    showTime && /* @__PURE__ */ jsxs2("div", { className: "vp-seekbar-times", children: [
      /* @__PURE__ */ jsx3("span", { className: "vp-seekbar-current", children: formatTime(currentTime) }),
      /* @__PURE__ */ jsx3("span", { className: "vp-seekbar-duration", children: formatTime(duration) })
    ] })
  ] });
};

// src/components/controls/VolumeControl.tsx
import { useState as useState3, useCallback as useCallback4 } from "react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var VolumeControl = ({
  id,
  className,
  showMuteToggle = true,
  vertical = false
}) => {
  const { muted, volume, toggleMute, setVolume } = useVideoControl(id);
  const [isHovered, setIsHovered] = useState3(false);
  const handleVolumeChange = useCallback4((e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
  }, [setVolume]);
  const displayVolume = muted ? 0 : volume;
  return /* @__PURE__ */ jsxs3(
    "div",
    {
      className: clsx_default("vp-volume-control", className, {
        "is-vertical": vertical
      }),
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      children: [
        showMuteToggle && /* @__PURE__ */ jsx4(
          "button",
          {
            className: "vp-volume-mute",
            onClick: toggleMute,
            "aria-label": muted ? "Unmute" : "Mute",
            children: muted || volume === 0 ? /* @__PURE__ */ jsx4("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx4("path", { d: "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" }) }) : volume < 0.5 ? /* @__PURE__ */ jsx4("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx4("path", { d: "M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" }) }) : /* @__PURE__ */ jsx4("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx4("path", { d: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" }) })
          }
        ),
        (isHovered || vertical) && /* @__PURE__ */ jsx4("div", { className: clsx_default("vp-volume-slider", { "is-vertical": vertical }), children: /* @__PURE__ */ jsx4(
          "input",
          {
            type: "range",
            min: "0",
            max: "1",
            step: "0.01",
            value: displayVolume,
            onChange: handleVolumeChange,
            className: "vp-volume-input"
          }
        ) })
      ]
    }
  );
};

// src/components/controls/FullScreenButton.tsx
import { useCallback as useCallback5 } from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
var FullScreenButton = ({
  id,
  className,
  targetRef
}) => {
  const { isFullscreen, toggleFullscreen } = useVideoControl(id);
  const handleClick = useCallback5(async () => {
    if (targetRef.current) {
      await toggleFullscreen(targetRef.current);
    }
  }, [toggleFullscreen, targetRef]);
  return /* @__PURE__ */ jsx5(
    "button",
    {
      className: clsx_default("vp-fullscreen-button", className, {
        "is-active": isFullscreen
      }),
      onClick: handleClick,
      "aria-label": isFullscreen ? "Exit fullscreen" : "Enter fullscreen",
      children: isFullscreen ? /* @__PURE__ */ jsx5("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx5("path", { d: "M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" }) }) : /* @__PURE__ */ jsx5("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx5("path", { d: "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" }) })
    }
  );
};

// src/components/controls/PictureInPictureButton.tsx
import { useCallback as useCallback6 } from "react";
import { jsx as jsx6 } from "react/jsx-runtime";
var PictureInPictureButton = ({
  id,
  className,
  videoRef
}) => {
  const { isPictureInPicture, togglePictureInPicture } = useVideoControl(id);
  const handleClick = useCallback6(async () => {
    if (videoRef.current) {
      await togglePictureInPicture(videoRef.current);
    }
  }, [togglePictureInPicture, videoRef]);
  return /* @__PURE__ */ jsx6(
    "button",
    {
      className: clsx_default("vp-pip-button", className, {
        "is-active": isPictureInPicture
      }),
      onClick: handleClick,
      "aria-label": isPictureInPicture ? "Exit picture in picture" : "Enter picture in picture",
      children: /* @__PURE__ */ jsx6("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx6("path", { d: "M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" }) })
    }
  );
};

// src/components/controls/PlaybackRateButton.tsx
import { useState as useState4, useCallback as useCallback7 } from "react";
import { jsx as jsx7, jsxs as jsxs4 } from "react/jsx-runtime";
var RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
var PlaybackRateButton = ({
  id,
  className,
  showMenu = true
}) => {
  const { playbackRate, setPlaybackRate } = useVideoControl(id);
  const [isMenuOpen, setIsMenuOpen] = useState4(false);
  const handleClick = useCallback7(() => {
    if (showMenu) {
      setIsMenuOpen(!isMenuOpen);
    }
  }, [showMenu, isMenuOpen]);
  const handleRateSelect = useCallback7(
    (rate) => {
      setPlaybackRate(rate);
      setIsMenuOpen(false);
    },
    [setPlaybackRate]
  );
  return /* @__PURE__ */ jsxs4("div", { className: clsx_default("vp-playback-rate", className), children: [
    /* @__PURE__ */ jsxs4(
      "button",
      {
        className: "vp-playback-rate-button",
        onClick: handleClick,
        "aria-label": `Playback rate: ${playbackRate}x`,
        "aria-expanded": isMenuOpen,
        children: [
          playbackRate,
          "x"
        ]
      }
    ),
    showMenu && isMenuOpen && /* @__PURE__ */ jsx7("div", { className: "vp-playback-rate-menu", children: RATES.map((rate) => /* @__PURE__ */ jsxs4(
      "button",
      {
        className: clsx_default("vp-playback-rate-option", {
          "is-active": rate === playbackRate
        }),
        onClick: () => handleRateSelect(rate),
        children: [
          rate,
          "x"
        ]
      },
      rate
    )) })
  ] });
};

// src/components/controls/TimeDisplay.tsx
import { useCallback as useCallback8 } from "react";
import { Fragment, jsx as jsx8, jsxs as jsxs5 } from "react/jsx-runtime";
var TimeDisplay = ({
  id,
  showDuration = true,
  separator = " / "
}) => {
  const { currentTime, duration } = useVideoControl(id);
  const formatTime = useCallback8((time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor(time % 3600 / 60);
    const seconds = Math.floor(time % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);
  return /* @__PURE__ */ jsxs5("div", { className: "vp-time-display", children: [
    /* @__PURE__ */ jsx8("span", { className: "vp-time-current", children: formatTime(currentTime) }),
    showDuration && /* @__PURE__ */ jsxs5(Fragment, { children: [
      /* @__PURE__ */ jsx8("span", { className: "vp-time-separator", children: separator }),
      /* @__PURE__ */ jsx8("span", { className: "vp-time-duration", children: formatTime(duration) })
    ] })
  ] });
};

// src/components/DefaultControls.tsx
import { jsx as jsx9, jsxs as jsxs6 } from "react/jsx-runtime";
var DefaultControls = ({
  id,
  placement = "bottom",
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
  const videoRef = useRef4(null);
  const playerRef = useRef4(null);
  return /* @__PURE__ */ jsx9(VideoPlayer, { id, ref: videoRef, ...props, children: /* @__PURE__ */ jsxs6(
    "div",
    {
      className: clsx_default("vp-controls", `vp-controls-${placement}`, {
        "is-overlay": placement === "overlay"
      }),
      children: [
        /* @__PURE__ */ jsx9("div", { className: "vp-controls-top", children }),
        /* @__PURE__ */ jsxs6("div", { className: "vp-controls-bottom", children: [
          /* @__PURE__ */ jsx9(
            Seekbar,
            {
              id,
              showTime,
              showBuffered
            }
          ),
          /* @__PURE__ */ jsxs6("div", { className: "vp-controls-row", children: [
            /* @__PURE__ */ jsxs6("div", { className: "vp-controls-left", children: [
              /* @__PURE__ */ jsx9(PlayButton, { id }),
              /* @__PURE__ */ jsx9(
                VolumeControl,
                {
                  id,
                  showMuteToggle,
                  vertical: !showVolumeSlider
                }
              ),
              /* @__PURE__ */ jsx9(TimeDisplay, { id, showDuration: showTime })
            ] }),
            /* @__PURE__ */ jsxs6("div", { className: "vp-controls-right", children: [
              showPlaybackRate && /* @__PURE__ */ jsx9(PlaybackRateButton, { id }),
              showPiP && /* @__PURE__ */ jsx9(PictureInPictureButton, { id, videoRef }),
              showFullscreen && /* @__PURE__ */ jsx9(FullScreenButton, { id, targetRef: playerRef })
            ] })
          ] })
        ] })
      ]
    }
  ) });
};
export {
  DefaultControls,
  FullScreenButton,
  PictureInPictureButton,
  PlayButton,
  PlaybackRateButton,
  Seekbar,
  TimeDisplay,
  VideoPlayer,
  VolumeControl,
  useGlobalStore,
  useVideoControl,
  useVideoElement,
  useVideoStore
};
//# sourceMappingURL=index.js.map
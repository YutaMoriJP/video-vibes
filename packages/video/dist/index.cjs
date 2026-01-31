"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  DefaultControls: () => DefaultControls,
  FullScreenButton: () => FullScreenButton,
  PictureInPictureButton: () => PictureInPictureButton,
  PlayButton: () => PlayButton,
  PlaybackRateButton: () => PlaybackRateButton,
  Seekbar: () => Seekbar,
  TimeDisplay: () => TimeDisplay,
  VideoPlayer: () => VideoPlayer,
  VolumeControl: () => VolumeControl,
  useGlobalStore: () => useGlobalStore,
  useVideoControl: () => useVideoControl,
  useVideoElement: () => useVideoElement,
  useVideoStore: () => useVideoStore
});
module.exports = __toCommonJS(index_exports);

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
var import_react = require("react");
function useVideoElement(id) {
  const videoRef = (0, import_react.useRef)(null);
  const store = useVideoStore.getState().getOrCreateStore(id);
  const globalStore = useVideoStore.getState();
  const handleLoadedMetadata = (0, import_react.useCallback)(() => {
    if (videoRef.current) {
      store.getState().setDuration(videoRef.current.duration);
      store.getState().setVideoStatus("CAN_PLAY");
    }
  }, [store]);
  const handleTimeUpdate = (0, import_react.useCallback)(() => {
    if (videoRef.current) {
      store.getState().setCurrentTime(videoRef.current.currentTime);
    }
  }, [store]);
  const handlePlay = (0, import_react.useCallback)(() => {
    store.getState().setPaused(false);
    store.getState().setVideoStatus("PLAYING");
  }, [store]);
  const handlePause = (0, import_react.useCallback)(() => {
    store.getState().setPaused(true);
    store.getState().setVideoStatus("PAUSED");
  }, [store]);
  const handleWaiting = (0, import_react.useCallback)(() => {
    store.getState().setVideoStatus("WAITING");
  }, [store]);
  const handleCanPlayThrough = (0, import_react.useCallback)(() => {
    store.getState().setVideoStatus("CAN_PLAY");
  }, [store]);
  const handleEnded = (0, import_react.useCallback)(() => {
    store.getState().setPaused(true);
    store.getState().setVideoStatus("ENDED");
  }, [store]);
  const handleSeeking = (0, import_react.useCallback)(() => {
    store.getState().setVideoStatus("SEEKING");
  }, [store]);
  const handleSeeked = (0, import_react.useCallback)(() => {
    store.getState().setVideoStatus(store.getState().paused ? "PAUSED" : "PLAYING");
  }, [store]);
  const handleProgress = (0, import_react.useCallback)(() => {
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
  const handleError = (0, import_react.useCallback)(() => {
    store.getState().setError("Video playback error");
  }, [store]);
  const handleVolumeChange = (0, import_react.useCallback)(() => {
    if (videoRef.current) {
      store.getState().setMuted(videoRef.current.muted);
      store.getState().setVolume(videoRef.current.volume);
    }
  }, [store]);
  const handleRateChange = (0, import_react.useCallback)(() => {
    if (videoRef.current) {
      store.getState().setPlaybackRate(videoRef.current.playbackRate);
    }
  }, [store]);
  (0, import_react.useEffect)(() => {
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
  const onUserInteract = (0, import_react.useCallback)(() => {
    globalStore.setVideoInteractionOnce(true);
  }, [globalStore]);
  return {
    videoRef,
    onUserInteract
  };
}

// src/useVideoControl.ts
var import_react2 = require("react");
function useVideoControl(id) {
  const store = useVideoStore.getState().getOrCreateStore(id);
  const state = store.getState();
  const play = (0, import_react2.useCallback)(() => {
    state.setPaused(false);
  }, [state]);
  const pause = (0, import_react2.useCallback)(() => {
    state.setPaused(true);
  }, [state]);
  const togglePlay = (0, import_react2.useCallback)(() => {
    state.setPaused(!state.paused);
  }, [state]);
  const setCurrentTime = (0, import_react2.useCallback)((time) => {
    state.setCurrentTime(time);
  }, [state]);
  const seek = (0, import_react2.useCallback)((time) => {
    state.setCurrentTime(time);
    state.setVideoStatus("SEEKING");
  }, [state]);
  const setMuted = (0, import_react2.useCallback)((muted) => {
    state.setMuted(muted);
  }, [state]);
  const toggleMute = (0, import_react2.useCallback)(() => {
    state.setMuted(!state.muted);
  }, [state]);
  const setVolume = (0, import_react2.useCallback)((volume) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    state.setVolume(clampedVolume);
    if (clampedVolume > 0 && state.muted) {
      state.setMuted(false);
    }
  }, [state]);
  const setPlaybackRate = (0, import_react2.useCallback)((rate) => {
    state.setPlaybackRate(rate);
  }, [state]);
  const toggleFullscreen = (0, import_react2.useCallback)(async (element) => {
    if (!document.fullscreenElement) {
      await element.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);
  const togglePictureInPicture = (0, import_react2.useCallback)(async (video) => {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await video.requestPictureInPicture();
    }
  }, []);
  const reset = (0, import_react2.useCallback)(() => {
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
var import_react3 = require("react");

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
var import_jsx_runtime = require("react/jsx-runtime");
var VideoPlayer = (0, import_react3.forwardRef)(
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
    const internalVideoRef = (0, import_react3.useRef)(null);
    const playerRef = (0, import_react3.useRef)(null);
    const { videoRef, onUserInteract } = useVideoElement(id);
    const control = useVideoControl(id);
    const { getStore } = useVideoStore.getState();
    const store = getStore(id);
    const [isReady, setIsReady] = (0, import_react3.useState)(false);
    (0, import_react3.useEffect)(() => {
      if (store) {
        control.setMuted(muted);
      }
    }, [muted, control]);
    (0, import_react3.useEffect)(() => {
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
    (0, import_react3.useEffect)(() => {
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
    (0, import_react3.useEffect)(() => {
      if (store && onTimeUpdate) {
        return () => {
          onTimeUpdate(store.getState().currentTime);
        };
      }
    }, [store?.getState().currentTime, onTimeUpdate]);
    (0, import_react3.useEffect)(() => {
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
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
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
var import_react10 = require("react");

// src/components/controls/PlayButton.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var PlayButton = ({ id, className }) => {
  const { paused, togglePlay } = useVideoControl(id);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "button",
    {
      className: clsx_default("vp-play-button", className),
      onClick: togglePlay,
      "aria-label": paused ? "Play" : "Pause",
      children: paused ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M8 5v14l11-7z" }) }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z" }) })
    }
  );
};

// src/components/controls/Seekbar.tsx
var import_react4 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
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
  const progressRef = (0, import_react4.useRef)(null);
  const [isDragging, setIsDragging] = (0, import_react4.useState)(false);
  const formatTime = (0, import_react4.useCallback)((time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor(time % 3600 / 60);
    const seconds = Math.floor(time % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);
  const getProgress = (0, import_react4.useCallback)((e) => {
    if (!progressRef.current) return 0;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    return Math.max(0, Math.min(1, x / rect.width));
  }, []);
  const handleMouseDown = (0, import_react4.useCallback)((e) => {
    setIsDragging(true);
    const progress2 = getProgress(e);
    seek(progress2 * duration);
  }, [duration, getProgress, seek]);
  const handleMouseMove = (0, import_react4.useCallback)((e) => {
    if (!isDragging) return;
    const progress2 = getProgress(e);
    seek(progress2 * duration);
  }, [isDragging, duration, getProgress, seek]);
  const handleMouseUp = (0, import_react4.useCallback)(() => {
    setIsDragging(false);
  }, []);
  (0, import_react4.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: clsx_default("vp-seekbar-container", className), children: [
    showBuffered && buffered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "vp-seekbar-buffered", children: buffered.map((range, i) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      "div",
      {
        ref: progressRef,
        className: clsx_default("vp-seekbar", { "is-dragging": isDragging }),
        onMouseDown: handleMouseDown,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "div",
            {
              className: "vp-seekbar-progress",
              style: { width: `${progress}%` }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "div",
            {
              className: "vp-seekbar-thumb",
              style: { left: `${progress}%` }
            }
          )
        ]
      }
    ),
    showTime && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "vp-seekbar-times", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "vp-seekbar-current", children: formatTime(currentTime) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "vp-seekbar-duration", children: formatTime(duration) })
    ] })
  ] });
};

// src/components/controls/VolumeControl.tsx
var import_react5 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
var VolumeControl = ({
  id,
  className,
  showMuteToggle = true,
  vertical = false
}) => {
  const { muted, volume, toggleMute, setVolume } = useVideoControl(id);
  const [isHovered, setIsHovered] = (0, import_react5.useState)(false);
  const handleVolumeChange = (0, import_react5.useCallback)((e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
  }, [setVolume]);
  const displayVolume = muted ? 0 : volume;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "div",
    {
      className: clsx_default("vp-volume-control", className, {
        "is-vertical": vertical
      }),
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      children: [
        showMuteToggle && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "button",
          {
            className: "vp-volume-mute",
            onClick: toggleMute,
            "aria-label": muted ? "Unmute" : "Mute",
            children: muted || volume === 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" }) }) : volume < 0.5 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" }) }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" }) })
          }
        ),
        (isHovered || vertical) && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: clsx_default("vp-volume-slider", { "is-vertical": vertical }), children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
var import_react6 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var FullScreenButton = ({
  id,
  className,
  targetRef
}) => {
  const { isFullscreen, toggleFullscreen } = useVideoControl(id);
  const handleClick = (0, import_react6.useCallback)(async () => {
    if (targetRef.current) {
      await toggleFullscreen(targetRef.current);
    }
  }, [toggleFullscreen, targetRef]);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    "button",
    {
      className: clsx_default("vp-fullscreen-button", className, {
        "is-active": isFullscreen
      }),
      onClick: handleClick,
      "aria-label": isFullscreen ? "Exit fullscreen" : "Enter fullscreen",
      children: isFullscreen ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" }) }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" }) })
    }
  );
};

// src/components/controls/PictureInPictureButton.tsx
var import_react7 = require("react");
var import_jsx_runtime6 = require("react/jsx-runtime");
var PictureInPictureButton = ({
  id,
  className,
  videoRef
}) => {
  const { isPictureInPicture, togglePictureInPicture } = useVideoControl(id);
  const handleClick = (0, import_react7.useCallback)(async () => {
    if (videoRef.current) {
      await togglePictureInPicture(videoRef.current);
    }
  }, [togglePictureInPicture, videoRef]);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    "button",
    {
      className: clsx_default("vp-pip-button", className, {
        "is-active": isPictureInPicture
      }),
      onClick: handleClick,
      "aria-label": isPictureInPicture ? "Exit picture in picture" : "Enter picture in picture",
      children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" }) })
    }
  );
};

// src/components/controls/PlaybackRateButton.tsx
var import_react8 = require("react");
var import_jsx_runtime7 = require("react/jsx-runtime");
var RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
var PlaybackRateButton = ({
  id,
  className,
  showMenu = true
}) => {
  const { playbackRate, setPlaybackRate } = useVideoControl(id);
  const [isMenuOpen, setIsMenuOpen] = (0, import_react8.useState)(false);
  const handleClick = (0, import_react8.useCallback)(() => {
    if (showMenu) {
      setIsMenuOpen(!isMenuOpen);
    }
  }, [showMenu, isMenuOpen]);
  const handleRateSelect = (0, import_react8.useCallback)(
    (rate) => {
      setPlaybackRate(rate);
      setIsMenuOpen(false);
    },
    [setPlaybackRate]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: clsx_default("vp-playback-rate", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
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
    showMenu && isMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "vp-playback-rate-menu", children: RATES.map((rate) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
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
var import_react9 = require("react");
var import_jsx_runtime8 = require("react/jsx-runtime");
var TimeDisplay = ({
  id,
  showDuration = true,
  separator = " / "
}) => {
  const { currentTime, duration } = useVideoControl(id);
  const formatTime = (0, import_react9.useCallback)((time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor(time % 3600 / 60);
    const seconds = Math.floor(time % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "vp-time-display", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "vp-time-current", children: formatTime(currentTime) }),
    showDuration && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "vp-time-separator", children: separator }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "vp-time-duration", children: formatTime(duration) })
    ] })
  ] });
};

// src/components/DefaultControls.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
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
  const videoRef = (0, import_react10.useRef)(null);
  const playerRef = (0, import_react10.useRef)(null);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(VideoPlayer, { id, ref: videoRef, ...props, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
    "div",
    {
      className: clsx_default("vp-controls", `vp-controls-${placement}`, {
        "is-overlay": placement === "overlay"
      }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "vp-controls-top", children }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "vp-controls-bottom", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            Seekbar,
            {
              id,
              showTime,
              showBuffered
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "vp-controls-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "vp-controls-left", children: [
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(PlayButton, { id }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                VolumeControl,
                {
                  id,
                  showMuteToggle,
                  vertical: !showVolumeSlider
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(TimeDisplay, { id, showDuration: showTime })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "vp-controls-right", children: [
              showPlaybackRate && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(PlaybackRateButton, { id }),
              showPiP && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(PictureInPictureButton, { id, videoRef }),
              showFullscreen && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(FullScreenButton, { id, targetRef: playerRef })
            ] })
          ] })
        ] })
      ]
    }
  ) });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.cjs.map
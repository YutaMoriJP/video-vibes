import { createStore, StoreApi } from 'zustand';
import { VideoState, VideoStatus, GlobalState, VideoStore } from './types';

const createDefaultVideoState = (): VideoState => ({
  currentTime: 0,
  duration: 0,
  paused: true,
  muted: false,
  volume: 1,
  videoStatus: 'WAITING',
  buffered: [],
  playbackRate: 1,
  isFullscreen: false,
  isPictureInPicture: false,
  error: null,
});

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

const globalInitialState: GlobalState = {
  videoInteractionOnce: false,
  setVideoInteractionOnce: () => {},
};

const createVideoStore = () => {
  const videoStores: VideoStoreRecord = {};

  return createStore<FullState>((set, get) => ({
    ...globalInitialState,
    videos: videoStores,

    getOrCreateStore: (id) => {
      if (videoStores[id]) return videoStores[id]!;

      const newStore = createStore<VideoStore>((setState) => ({
        ...createDefaultVideoState(),

        setCurrentTime: (time) => setState({ currentTime: time }),
        setDuration: (duration) => setState({ duration }),
        setPaused: (paused) => {
          setState({ paused, videoStatus: paused ? 'PAUSED' : 'PLAYING' });
        },
        setMuted: (muted) => setState({ muted }),
        setVolume: (volume) => setState({ volume }),
        setVideoStatus: (status) => setState({ videoStatus: status }),
        setBuffered: (buffered) => setState({ buffered }),
        setPlaybackRate: (rate) => setState({ playbackRate: rate }),
        setFullscreen: (isFullscreen) => setState({ isFullscreen }),
        setPictureInPicture: (isPip) => setState({ isPictureInPicture: isPip }),
        setError: (error) => {
          setState({ error, videoStatus: error ? 'ERROR' : 'WAITING' });
        },
        reset: () => setState({ ...createDefaultVideoState() }),
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
    },
  }));
};

export const useVideoStore = createVideoStore();
export const useGlobalStore = () => {
  const state = useVideoStore.getState();
  return {
    videoInteractionOnce: state.videoInteractionOnce,
    setVideoInteractionOnce: state.setVideoInteractionOnce,
  };
};

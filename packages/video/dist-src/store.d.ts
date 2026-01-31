import { GlobalState, VideoStore } from './types';
interface VideoStoreRecord {
    [id: string | number]: VideoStore | undefined;
}
interface FullState extends GlobalState {
    videos: VideoStoreRecord;
    getOrCreateStore: (id: string | number) => VideoStore;
    getStore: (id: string | number) => VideoStore | undefined;
    removeStore: (id: string | number) => void;
    setVideoInteractionOnce: (interacted: boolean) => void;
}
export declare const useVideoStore: import("zustand").StoreApi<FullState>;
export declare const useGlobalStore: () => {
    videoInteractionOnce: boolean;
    setVideoInteractionOnce: (interacted: boolean) => void;
};
export {};

export interface PlayerConfig {
  id: string;
  name: string;
  url: string;
  type: 'hls' | 'dash' | 'mp4';
  autoPlay: boolean;
  muted: boolean;
  poster: string;
}

export interface URLParams {
  url?: string;
  type?: string;
  autoplay?: string;
  muted?: string;
}

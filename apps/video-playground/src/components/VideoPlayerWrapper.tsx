import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import dashjs from 'dashjs';
import { DefaultControls, VideoStatus } from '@video-player/core';
import { PlayerConfig } from '../types';

interface VideoPlayerWrapperProps {
  config: PlayerConfig;
}

const VideoPlayerWrapper: React.FC<VideoPlayerWrapperProps> = ({ config }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const dashRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string>('');

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !config.url) return;

    const cleanup = () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (dashRef.current) {
        dashRef.current.reset();
        dashRef.current = null;
      }
    };

    cleanup();
    setError(null);

    const url = config.url;
    const isHLS = url.includes('.m3u8') || config.type === 'hls';
    const isDASH = url.includes('.mpd') || config.type === 'dash';
    const isMP4 = url.endsWith('.mp4') || config.type === 'mp4';

    if (isHLS && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setMediaType('HLS');
        if (config.autoPlay) {
          video.play().catch(() => {});
        }
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setError(`HLS Error: ${data.type}`);
        }
      });
    } else if (isDASH && dashjs) {
      const dash = dashjs.MediaPlayer().create();
      dashRef.current = dash;
      dash.initialize(video, url, config.autoPlay);
      dash.on('manifestLoaded', () => {
        setMediaType('DASH');
      });
      dash.on('error', (e: any) => {
        setError(`DASH Error: ${e.error.message || 'Unknown error'}`);
      });
    } else if (isMP4 || video.canPlayType('video/mp4')) {
      video.src = url;
      video.load();
      setMediaType('MP4');
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.load();
      setMediaType('HLS (Native)');
    } else {
      setError('Unsupported media format');
    }

    return cleanup;
  }, [config.url, config.type, config.autoPlay]);

  if (!config.url) {
    return (
      <div className="video-placeholder">
        <div className="placeholder-content">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          <p>Enter a video URL to get started</p>
          <span>Supports HLS (.m3u8), DASH (.mp4), and MP4</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-error">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="video-player-container">
      {mediaType && (
        <div className="media-type-badge">{mediaType}</div>
      )}
      <DefaultControls
        id={config.id}
        src={config.url}
        autoPlay={config.autoPlay}
        muted={config.muted}
        poster={config.poster}
        placement="overlay"
      />
    </div>
  );
};

export default VideoPlayerWrapper;

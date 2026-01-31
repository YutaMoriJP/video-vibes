import { useEffect, useCallback } from 'react';
import { PlayerConfig, URLParams } from '../types';

interface ConfigPanelProps {
  config: PlayerConfig;
  onUpdate: (updates: Partial<PlayerConfig>) => void;
}

function encodeURLParams(config: PlayerConfig): string {
  const params: URLParams = {
    url: config.url,
    type: config.type,
    autoplay: config.autoPlay ? '1' : '0',
    muted: config.muted ? '1' : '0',
  };
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  return searchParams.toString();
}

function decodeURLParams(): Partial<PlayerConfig> {
  const params = new URLSearchParams(window.location.search);
  return {
    url: params.get('url') || '',
    type: (params.get('type') as PlayerConfig['type']) || 'hls',
    autoPlay: params.get('autoplay') === '1',
    muted: params.get('muted') === '1',
  };
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onUpdate }) => {
  const handleURLChange = useCallback((url: string) => {
    onUpdate({ url });
  }, [onUpdate]);

  const handleCopyURL = useCallback(() => {
    const params = encodeURLParams(config);
    const url = `${window.location.origin}${window.location.pathname}${params ? `?${params}` : ''}`;
    navigator.clipboard.writeText(url);
  }, [config]);

  const handlePasteURL = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleURLChange(text);
      }
    } catch (e) {
      console.error('Failed to read clipboard:', e);
    }
  }, [handleURLChange]);

  useEffect(() => {
    const initialParams = decodeURLParams();
    if (initialParams.url) {
      onUpdate(initialParams);
    }
  }, []);

  return (
    <div className="config-panel">
      <h3>Configuration</h3>

      <div className="config-section">
        <label>Manifest URL</label>
        <div className="url-input-group">
          <input
            type="url"
            placeholder="https://example.com/manifest.m3u8"
            value={config.url}
            onChange={(e) => handleURLChange(e.target.value)}
            className="url-input"
          />
          <button
            className="icon-btn"
            onClick={handlePasteURL}
            title="Paste from clipboard"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M8 2v2M12 2v2" />
              <rect x="8" y="2" width="8" height="4" rx="1" />
            </svg>
          </button>
          <button
            className="icon-btn"
            onClick={handleCopyURL}
            title="Copy shareable URL"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>
      </div>

      <div className="config-section">
        <label>Media Type</label>
        <select
          value={config.type}
          onChange={(e) => onUpdate({ type: e.target.value as PlayerConfig['type'] })}
          className="select-input"
        >
          <option value="hls">HLS (.m3u8)</option>
          <option value="dash">DASH (.mpd)</option>
          <option value="mp4">MP4</option>
        </select>
      </div>

      <div className="config-section">
        <label>Player Name</label>
        <input
          type="text"
          value={config.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="text-input"
        />
      </div>

      <div className="config-section">
        <label>Poster URL</label>
        <input
          type="url"
          value={config.poster}
          onChange={(e) => onUpdate({ poster: e.target.value })}
          placeholder="https://example.com/poster.jpg"
          className="url-input"
        />
      </div>

      <div className="config-toggles">
        <label className="toggle">
          <input
            type="checkbox"
            checked={config.autoPlay}
            onChange={(e) => onUpdate({ autoPlay: e.target.checked })}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">Auto Play</span>
        </label>

        <label className="toggle">
          <input
            type="checkbox"
            checked={config.muted}
            onChange={(e) => onUpdate({ muted: e.target.checked })}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">Muted</span>
        </label>
      </div>

      <div className="preset-section">
        <label>Sample Manifests</label>
        <div className="preset-list">
          <button onClick={() => handleURLChange('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')}>
            Big Buck Bunny (HLS)
          </button>
          <button onClick={() => handleURLChange('https://dash.akamaized.net/dash264/TestCases/1c/qualcomm/2/MultiRate.mpd')}>
            Multi Rate (DASH)
          </button>
          <button onClick={() => handleURLChange('https://media.w3.org/2010/05/sintel/trailer.mp4')}>
            Sintel Trailer (MP4)
          </button>
          <button onClick={() => handleURLChange('https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8')}>
            Sintel (HLS)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;

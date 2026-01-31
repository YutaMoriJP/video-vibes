import { useState, useEffect, useCallback } from 'react';
import VideoPlayerWrapper from './components/VideoPlayerWrapper';
import ConfigPanel from './components/ConfigPanel';
import StatsPanel from './components/StatsPanel';
import { PlayerConfig } from './types';
import './App.css';

const DEFAULT_CONFIGS: PlayerConfig[] = [
  {
    id: 'main-player',
    name: 'Main Player',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    type: 'hls',
    autoPlay: false,
    muted: false,
    poster: '',
  },
];

function App() {
  const [configs, setConfigs] = useState<PlayerConfig[]>(DEFAULT_CONFIGS);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('main-player');

  const updateConfig = useCallback((id: string, updates: Partial<PlayerConfig>) => {
    setConfigs((prev) =>
      prev.map((config) =>
        config.id === id ? { ...config, ...updates } : config
      )
    );
  }, []);

  const addPlayer = useCallback(() => {
    const newId = `player-${Date.now()}`;
    setConfigs((prev) => [
      ...prev,
      {
        id: newId,
        name: `Player ${prev.length + 1}`,
        url: '',
        type: 'hls',
        autoPlay: false,
        muted: false,
        poster: '',
      },
    ]);
    setSelectedPlayerId(newId);
  }, []);

  const removePlayer = useCallback((id: string) => {
    setConfigs((prev) => prev.filter((c) => c.id !== id));
    if (selectedPlayerId === id && configs.length > 1) {
      setSelectedPlayerId(configs[0].id);
    }
  }, [selectedPlayerId, configs]);

  const currentConfig = configs.find((c) => c.id === selectedPlayerId);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Video Player Playground</h1>
        <p>Test HLS and DASH streaming with our modern video player library</p>
      </header>

      <main className="app-main">
        <aside className="app-sidebar">
          <div className="player-list">
            <h3>Players</h3>
            {configs.map((config) => (
              <button
                key={config.id}
                className={`player-tab ${selectedPlayerId === config.id ? 'active' : ''}`}
                onClick={() => setSelectedPlayerId(config.id)}
              >
                {config.name}
                {configs.length > 1 && (
                  <span
                    className="remove-player"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePlayer(config.id);
                    }}
                  >
                    ×
                  </span>
                )}
              </button>
            ))}
            <button className="add-player" onClick={addPlayer}>
              + Add Player
            </button>
          </div>

          {currentConfig && (
            <ConfigPanel
              config={currentConfig}
              onUpdate={(updates) => updateConfig(currentConfig.id, updates)}
            />
          )}
        </aside>

        <div className="app-content">
          <div className="players-grid">
            {configs.map((config) => (
              <div
                key={config.id}
                className={`player-wrapper ${selectedPlayerId === config.id ? 'selected' : ''}`}
                onClick={() => setSelectedPlayerId(config.id)}
              >
                <div className="player-label">{config.name}</div>
                <VideoPlayerWrapper config={config} />
              </div>
            ))}
          </div>

          {currentConfig && <StatsPanel playerId={currentConfig.id} />}
        </div>
      </main>
    </div>
  );
}

export default App;

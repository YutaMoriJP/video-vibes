import { useVideoControl, useGlobalStore } from '@video-player/core';
import './StatsPanel.css';

interface StatsPanelProps {
  playerId: string;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ playerId }) => {
  const {
    currentTime,
    duration,
    paused,
    muted,
    volume,
    videoStatus,
    buffered,
    playbackRate,
    isFullscreen,
    error,
  } = useVideoControl(playerId);

  const { videoInteractionOnce } = useGlobalStore();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLAYING':
        return '#22c55e';
      case 'PAUSED':
        return '#f59e0b';
      case 'WAITING':
      case 'BUFFERING':
        return '#f97316';
      case 'ERROR':
        return '#ef4444';
      case 'ENDED':
        return '#8b5cf6';
      default:
        return '#64748b';
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="stats-panel">
      <h3>Video Stats</h3>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Status</span>
          <span
            className="stat-value status-badge"
            style={{ backgroundColor: getStatusColor(videoStatus) }}
          >
            {videoStatus}
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Current Time</span>
          <span className="stat-value">{formatTime(currentTime)}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Duration</span>
          <span className="stat-value">{formatTime(duration)}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Progress</span>
          <span className="stat-value">{progress.toFixed(1)}%</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Buffered</span>
          <span className="stat-value">
            {buffered.length > 0
              ? buffered.map((b, i) => `${formatTime(b.start)}-${formatTime(b.end)}`).join(', ')
              : 'None'}
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Playback Rate</span>
          <span className="stat-value">{playbackRate}x</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Volume</span>
          <span className="stat-value">{(volume * 100).toFixed(0)}%</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Muted</span>
          <span className="stat-value">{muted ? 'Yes' : 'No'}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Fullscreen</span>
          <span className="stat-value">{isFullscreen ? 'Yes' : 'No'}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">User Interacted</span>
          <span className="stat-value">{videoInteractionOnce ? 'Yes' : 'No'}</span>
        </div>
      </div>

      {error && (
        <div className="error-display">
          <span className="error-label">Error:</span>
          <span className="error-value">{error}</span>
        </div>
      )}

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
        {buffered.map((b, i) => (
          <div
            key={i}
            className="buffered-fill"
            style={{
              left: `${(b.start / duration) * 100}%`,
              width: `${((b.end - b.start) / duration) * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsPanel;

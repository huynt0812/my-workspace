import { useState, useRef } from 'react';
import type { MusicSettings } from '../types';
import { MUSIC_STATIONS } from '../types';

interface MusicPlayerProps {
  settings: MusicSettings;
  onSettingsChange: (settings: MusicSettings) => void;
  onClose: () => void;
}

export function MusicPlayer({ settings, onSettingsChange, onClose }: MusicPlayerProps) {
  const [customUrl, setCustomUrl] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentStation = MUSIC_STATIONS.find(s => s.id === settings.currentStation) || MUSIC_STATIONS[0];

  const handleStationChange = (stationId: string) => {
    onSettingsChange({ ...settings, currentStation: stationId, isPlaying: true });
  };

  const handlePlayPause = () => {
    onSettingsChange({ ...settings, isPlaying: !settings.isPlaying });
  };

  const handleVolumeChange = (volume: number) => {
    onSettingsChange({ ...settings, volume });
  };

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
      /^[a-zA-Z0-9_-]{11}$/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1] || match[0];
    }
    return null;
  };

  const handleCustomUrlSubmit = () => {
    const videoId = extractYouTubeId(customUrl);
    if (videoId) {
      onSettingsChange({ ...settings, currentStation: `custom:${videoId}`, isPlaying: true });
      setCustomUrl('');
      setShowCustomInput(false);
    }
  };

  const getVideoId = () => {
    if (settings.currentStation.startsWith('custom:')) {
      return settings.currentStation.replace('custom:', '');
    }
    return currentStation.url;
  };

  return (
    <div className="glass rounded-2xl p-4 w-80 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center gap-2">
          <span>🎵</span>
          Lofi Music
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* YouTube Player (hidden but functional) */}
      {settings.isPlaying && (
        <iframe
          ref={iframeRef}
          className="hidden"
          src={`https://www.youtube.com/embed/${getVideoId()}?autoplay=1&loop=1&playlist=${getVideoId()}`}
          allow="autoplay"
          title="Music Player"
        />
      )}

      {/* Now Playing */}
      <div className="bg-white/10 rounded-xl p-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
            {!settings.currentStation.startsWith('custom:') ? (
              <img
                src={currentStation.thumbnail}
                alt={currentStation.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">🎶</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {settings.currentStation.startsWith('custom:') ? 'Custom Stream' : currentStation.name}
            </p>
            <p className="text-xs text-white/50">
              {settings.isPlaying ? '♪ Đang phát...' : 'Tạm dừng'}
            </p>
          </div>
          <button
            onClick={handlePlayPause}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
          >
            {settings.isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Volume */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-white/70 mb-2">
          <span>🔊</span>
          <span>Âm lượng: {Math.round(settings.volume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={settings.volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="w-full accent-white h-1"
        />
      </div>

      {/* Stations */}
      <div className="mb-4">
        <p className="text-sm text-white/70 mb-2">Kênh có sẵn</p>
        <div className="grid grid-cols-2 gap-2">
          {MUSIC_STATIONS.map((station) => (
            <button
              key={station.id}
              onClick={() => handleStationChange(station.id)}
              className={`
                p-2 rounded-lg text-sm transition-all text-left
                ${settings.currentStation === station.id
                  ? 'bg-white/20 ring-1 ring-white/30'
                  : 'bg-white/5 hover:bg-white/10'
                }
              `}
            >
              <span className="block truncate">{station.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom URL */}
      <div>
        {showCustomInput ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomUrlSubmit()}
              placeholder="YouTube URL hoặc Video ID"
              className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
              autoFocus
            />
            <button
              onClick={handleCustomUrlSubmit}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-all"
            >
              OK
            </button>
            <button
              onClick={() => setShowCustomInput(false)}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCustomInput(true)}
            className="w-full p-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/70 transition-all"
          >
            + Thêm link YouTube
          </button>
        )}
      </div>
    </div>
  );
}

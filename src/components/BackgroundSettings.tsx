import { useState } from 'react';
import type { BackgroundSettings as BackgroundSettingsType } from '../types';
import { DEFAULT_BACKGROUNDS } from '../types';

interface BackgroundSettingsProps {
  settings: BackgroundSettingsType;
  onSettingsChange: (settings: BackgroundSettingsType) => void;
  onClose: () => void;
}

export function BackgroundSettings({ settings, onSettingsChange, onClose }: BackgroundSettingsProps) {
  const [customUrl, setCustomUrl] = useState('');

  const handleSelectBackground = (url: string, type: 'image' | 'video' = 'image') => {
    onSettingsChange({ ...settings, url, type });
  };

  const handleCustomUrl = () => {
    if (!customUrl.trim()) return;

    const isVideo = customUrl.includes('.mp4') || customUrl.includes('.webm');
    onSettingsChange({
      ...settings,
      url: customUrl.trim(),
      type: isVideo ? 'video' : 'image',
    });
    setCustomUrl('');
  };

  return (
    <div className="glass rounded-2xl p-4 text-white w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center gap-2">
          <span>🖼️</span>
          Hình nền
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

      {/* Preset backgrounds */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {DEFAULT_BACKGROUNDS.map((bg) => (
          <button
            key={bg.url}
            onClick={() => handleSelectBackground(bg.url, bg.type)}
            className={`relative aspect-video rounded-lg overflow-hidden transition-all ${
              settings.url === bg.url ? 'ring-2 ring-white' : 'hover:ring-2 hover:ring-white/50'
            }`}
          >
            <img
              src={bg.url}
              alt={bg.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-end p-1">
              <span className="text-[10px] text-white/80 truncate">{bg.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Custom URL input */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-white/70 mb-2">
            URL tùy chỉnh (ảnh hoặc video)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomUrl()}
              placeholder="https://..."
              className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
            />
            <button
              onClick={handleCustomUrl}
              disabled={!customUrl.trim()}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 rounded-lg transition-all"
            >
              OK
            </button>
          </div>
        </div>

        {/* Opacity slider */}
        <div>
          <label className="block text-sm text-white/70 mb-2">
            Độ tối: {Math.round(settings.opacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.1"
            value={settings.opacity}
            onChange={(e) => onSettingsChange({ ...settings, opacity: parseFloat(e.target.value) })}
            className="w-full accent-white h-1"
          />
        </div>
      </div>
    </div>
  );
}

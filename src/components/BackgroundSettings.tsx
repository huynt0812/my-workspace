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
    <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-5 text-white w-[340px] max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          Animated Backgrounds
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Preset backgrounds - 2 column grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {DEFAULT_BACKGROUNDS.map((bg) => (
          <button
            key={bg.url}
            onClick={() => handleSelectBackground(bg.url, bg.type)}
            className={`relative aspect-[16/10] rounded-xl overflow-hidden transition-all group ${
              settings.url === bg.url
                ? 'ring-2 ring-white ring-offset-2 ring-offset-black/60'
                : 'hover:ring-2 hover:ring-white/50'
            }`}
          >
            <img
              src={bg.url}
              alt={bg.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <span className="text-xs font-medium text-white drop-shadow-lg">{bg.name}</span>
            </div>
            {/* Selected indicator */}
            {settings.url === bg.url && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* More backgrounds hint */}
      <p className="text-white/50 text-sm mb-4">And 20+ more...</p>

      {/* Custom URL input */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div>
          <label className="block text-sm text-white/70 mb-2">
            Custom URL (image or video)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomUrl()}
              placeholder="https://..."
              className="flex-1 bg-white/10 rounded-lg px-3 py-2.5 text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
            />
            <button
              onClick={handleCustomUrl}
              disabled={!customUrl.trim()}
              className="px-4 py-2.5 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all text-sm font-medium"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Brightness slider */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Brightness</span>
            <span className="text-white/50">{Math.round((1 - settings.opacity) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1"
            step="0.05"
            value={1 - settings.opacity}
            onChange={(e) => onSettingsChange({ ...settings, opacity: 1 - parseFloat(e.target.value) })}
            className="w-full accent-white h-1.5 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

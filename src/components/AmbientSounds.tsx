import { useEffect, useRef } from 'react';
import type { AmbientSound } from '../types';

interface AmbientSoundsProps {
  sounds: AmbientSound[];
  onSoundsChange: (sounds: AmbientSound[]) => void;
  onClose: () => void;
}

// Free ambient sound URLs (from freesound.org or similar - using placeholder URLs)
const SOUND_URLS: Record<string, string> = {
  rain: 'https://cdn.freesound.org/previews/531/531947_6142149-lq.mp3',
  thunder: 'https://cdn.freesound.org/previews/362/362023_5121236-lq.mp3',
  fire: 'https://cdn.freesound.org/previews/277/277021_5145952-lq.mp3',
  forest: 'https://cdn.freesound.org/previews/527/527853_6142149-lq.mp3',
  wind: 'https://cdn.freesound.org/previews/244/244395_2024854-lq.mp3',
  cafe: 'https://cdn.freesound.org/previews/411/411456_5121236-lq.mp3',
  waves: 'https://cdn.freesound.org/previews/527/527415_6142149-lq.mp3',
  birds: 'https://cdn.freesound.org/previews/531/531953_6142149-lq.mp3',
};

export function AmbientSounds({ sounds, onSoundsChange, onClose }: AmbientSoundsProps) {
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  useEffect(() => {
    // Initialize audio elements
    sounds.forEach((sound) => {
      if (!audioRefs.current.has(sound.id)) {
        const audio = new Audio(SOUND_URLS[sound.id]);
        audio.loop = true;
        audio.volume = sound.volume;
        audioRefs.current.set(sound.id, audio);
      }
    });

    // Update audio state based on sounds
    sounds.forEach((sound) => {
      const audio = audioRefs.current.get(sound.id);
      if (audio) {
        audio.volume = sound.volume;
        if (sound.isActive && audio.paused) {
          audio.play().catch(() => {});
        } else if (!sound.isActive && !audio.paused) {
          audio.pause();
        }
      }
    });

    return () => {
      // Cleanup on unmount
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
    };
  }, [sounds]);

  const toggleSound = (soundId: string) => {
    const updatedSounds = sounds.map((s) =>
      s.id === soundId ? { ...s, isActive: !s.isActive } : s
    );
    onSoundsChange(updatedSounds);
  };

  const updateVolume = (soundId: string, volume: number) => {
    const updatedSounds = sounds.map((s) =>
      s.id === soundId ? { ...s, volume } : s
    );
    onSoundsChange(updatedSounds);
  };

  const activeSoundsCount = sounds.filter((s) => s.isActive).length;

  return (
    <div className="glass rounded-2xl p-4 w-80 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center gap-2">
          <span>🔊</span>
          Âm thanh môi trường
          {activeSoundsCount > 0 && (
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {activeSoundsCount} đang bật
            </span>
          )}
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

      {/* Sound list */}
      <div className="space-y-2">
        {sounds.map((sound) => (
          <div
            key={sound.id}
            className={`
              p-3 rounded-xl transition-all
              ${sound.isActive ? 'bg-white/15' : 'bg-white/5'}
            `}
          >
            <div className="flex items-center gap-3">
              {/* Toggle button */}
              <button
                onClick={() => toggleSound(sound.id)}
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all
                  ${sound.isActive
                    ? 'bg-white/20 ring-2 ring-white/30'
                    : 'bg-white/10 hover:bg-white/15'
                  }
                `}
              >
                {sound.icon}
              </button>

              {/* Name and volume */}
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">{sound.name}</p>
                {sound.isActive && (
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={sound.volume}
                    onChange={(e) => updateVolume(sound.id, parseFloat(e.target.value))}
                    className="w-full accent-white h-1"
                  />
                )}
              </div>

              {/* Volume indicator */}
              {sound.isActive && (
                <span className="text-xs text-white/50 w-8 text-right">
                  {Math.round(sound.volume * 100)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => {
            const allActive = sounds.every((s) => s.isActive);
            const updatedSounds = sounds.map((s) => ({ ...s, isActive: !allActive }));
            onSoundsChange(updatedSounds);
          }}
          className="flex-1 p-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm transition-all"
        >
          {sounds.every((s) => s.isActive) ? 'Tắt tất cả' : 'Bật tất cả'}
        </button>
        <button
          onClick={() => {
            const updatedSounds = sounds.map((s) => ({ ...s, isActive: false }));
            onSoundsChange(updatedSounds);
          }}
          className="p-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm transition-all"
        >
          🔇
        </button>
      </div>
    </div>
  );
}

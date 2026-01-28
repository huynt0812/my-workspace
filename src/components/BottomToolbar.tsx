import { useState, useEffect } from 'react';

export type PanelType = 'music' | 'sounds' | 'timer' | 'tasks' | 'background' | null;

interface BottomToolbarProps {
  activePanel: PanelType;
  onPanelChange: (panel: PanelType) => void;
  isMusicPlaying: boolean;
  onMusicToggle: () => void;
  activeSoundsCount: number;
}

export function BottomToolbar({
  activePanel,
  onPanelChange,
  isMusicPlaying,
  onMusicToggle,
  activeSoundsCount,
}: BottomToolbarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handlePanelClick = (panel: PanelType) => {
    if (activePanel === panel) {
      onPanelChange(null);
    } else {
      onPanelChange(panel);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-md border-t border-white/10">
        {/* Left section - Music controls */}
        <div className="flex items-center gap-1">
          {/* Play/Pause */}
          <button
            onClick={onMusicToggle}
            className="p-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all"
            title={isMusicPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'}
          >
            {isMusicPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Next track */}
          <button
            className="p-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all"
            title="Bài tiếp theo"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>

          {/* Volume/Music panel */}
          <button
            onClick={() => handlePanelClick('music')}
            className={`p-2.5 rounded-lg transition-all ${
              activePanel === 'music'
                ? 'text-white bg-white/20'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            title="Âm lượng & Nhạc"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          </button>

          {/* Ambient sounds */}
          <button
            onClick={() => handlePanelClick('sounds')}
            className={`p-2.5 rounded-lg transition-all relative ${
              activePanel === 'sounds'
                ? 'text-white bg-white/20'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            title="Âm thanh môi trường"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
            {activeSoundsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-[10px] rounded-full flex items-center justify-center">
                {activeSoundsCount}
              </span>
            )}
          </button>

          <div className="w-px h-6 bg-white/20 mx-2" />

          {/* Timer */}
          <button
            onClick={() => handlePanelClick('timer')}
            className={`p-2.5 rounded-lg transition-all ${
              activePanel === 'timer'
                ? 'text-white bg-white/20'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            title="Pomodoro Timer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* Tasks */}
          <button
            onClick={() => handlePanelClick('tasks')}
            className={`p-2.5 rounded-lg transition-all ${
              activePanel === 'tasks'
                ? 'text-white bg-white/20'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            title="Tasks"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </button>
        </div>

        {/* Center section - can be empty or show now playing */}
        <div className="flex-1" />

        {/* Right section */}
        <div className="flex items-center gap-1">
          {/* Background */}
          <button
            onClick={() => handlePanelClick('background')}
            className={`p-2.5 rounded-lg transition-all ${
              activePanel === 'background'
                ? 'text-white bg-white/20'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            title="Hình nền"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>

          <div className="w-px h-6 bg-white/20 mx-2" />

          {/* Clock */}
          <div className="flex items-center gap-2 text-white/80 text-sm px-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth={2} />
              <path strokeLinecap="round" strokeWidth={2} d="M12 6v6l4 2" />
            </svg>
            <span className="font-medium">{formatTime(currentTime)}</span>
          </div>

          <div className="w-px h-6 bg-white/20 mx-2" />

          {/* Fullscreen */}
          <button
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                document.documentElement.requestFullscreen();
              }
            }}
            className="p-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all"
            title="Toàn màn hình"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import type { TimerSettings } from '../types';

interface FocusTimerProps {
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
  onClose?: () => void;
  compact?: boolean;
}

type TimerMode = 'focus' | 'break';
type TimerState = 'idle' | 'running' | 'paused';

export function FocusTimer({ settings, onSettingsChange, onClose, compact = false }: FocusTimerProps) {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [state, setState] = useState<TimerState>('idle');
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const duration = mode === 'focus' ? settings.focusDuration : settings.breakDuration;

  useEffect(() => {
    if (state === 'idle') {
      setTimeLeft(duration * 60);
    }
  }, [duration, state]);

  useEffect(() => {
    let interval: number | undefined;

    if (state === 'running' && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && state === 'running') {
      playNotificationSound();

      if (mode === 'focus') {
        // Update stats when focus session completes
        const today = new Date().toDateString();
        const isNewDay = settings.lastSessionDate !== today;

        onSettingsChange({
          ...settings,
          totalSessions: settings.totalSessions + 1,
          totalFocusTime: settings.totalFocusTime + settings.focusDuration * 60,
          dailyStreak: isNewDay ? settings.dailyStreak + 1 : settings.dailyStreak,
          lastSessionDate: today,
        });

        if (settings.autoStartBreak) {
          setMode('break');
          setTimeLeft(settings.breakDuration * 60);
        } else {
          setState('idle');
          setMode('break');
        }
      } else {
        setState('idle');
        setMode('focus');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state, timeLeft, mode, settings, onSettingsChange]);

  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQE1l+Dbpn8CAACPy9afcwAAlMTYk2oAAI/D04hjAACCsshYWAAAc6K9Tk0AAGSPrkM/AABZgqM5OQAATnGYMS4AAERiizMoAAA7VoAxIwAANE17MiAAAC9Gdi4eAAAsQXMvHQAAKj9yMBwAACg9cTIbAAAnPHI0GwAAJjtzNhsAACY7dDcbAAAmPHU4GwAAJj12ORwAACY+dzsAAA==');
    audio.play().catch(() => {});
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  const handleStart = () => setState('running');
  const handlePause = () => setState('paused');
  const handleResume = () => setState('running');
  const handleReset = () => {
    setState('idle');
    setTimeLeft(duration * 60);
  };

  const handleSkip = () => {
    setState('idle');
    setMode(mode === 'focus' ? 'break' : 'focus');
  };

  const handleDurationChange = useCallback((type: 'focus' | 'break', value: number) => {
    onSettingsChange({
      ...settings,
      [type === 'focus' ? 'focusDuration' : 'breakDuration']: value,
    });
  }, [settings, onSettingsChange]);

  // Compact version for center display
  if (compact) {
    return (
      <div className="text-white text-center">
        <div className="text-7xl font-light mb-4 tracking-wider">
          {formatTime(timeLeft)}
        </div>
        <div className="text-white/60 text-sm mb-6">
          {mode === 'focus' ? '🎯 Tập trung' : '☕ Nghỉ ngơi'}
        </div>
        <div className="flex justify-center gap-3">
          {state === 'idle' && (
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all text-lg"
            >
              Bắt đầu
            </button>
          )}
          {state === 'running' && (
            <button
              onClick={handlePause}
              className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
            >
              ⏸️ Tạm dừng
            </button>
          )}
          {state === 'paused' && (
            <>
              <button
                onClick={handleResume}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
              >
                ▶️ Tiếp tục
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              >
                ↺ Đặt lại
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Full panel version
  return (
    <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-5 text-white w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center gap-2">
          <span>⏱️</span>
          Focus Timer
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white/10 rounded-lg p-2 text-center">
          <p className="text-lg font-semibold">{settings.totalSessions}</p>
          <p className="text-[10px] text-white/60">Sessions</p>
        </div>
        <div className="bg-white/10 rounded-lg p-2 text-center">
          <p className="text-lg font-semibold">{formatTotalTime(settings.totalFocusTime)}</p>
          <p className="text-[10px] text-white/60">Tổng thời gian</p>
        </div>
        <div className="bg-white/10 rounded-lg p-2 text-center">
          <p className="text-lg font-semibold">{settings.dailyStreak}</p>
          <p className="text-[10px] text-white/60">🔥 Streak</p>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setMode('focus'); setState('idle'); }}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            mode === 'focus'
              ? 'bg-green-500/30 text-green-300'
              : 'text-white/60 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          🎯 Tập trung
        </button>
        <button
          onClick={() => { setMode('break'); setState('idle'); }}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            mode === 'break'
              ? 'bg-blue-500/30 text-blue-300'
              : 'text-white/60 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          ☕ Nghỉ ngơi
        </button>
      </div>

      {/* Timer display */}
      <div className="relative mb-4">
        <svg className="w-full h-40" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
          />
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke={mode === 'focus' ? '#22c55e' : '#3b82f6'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 85}`}
            strokeDashoffset={`${2 * Math.PI * 85 * (1 - progress / 100)}`}
            transform="rotate(-90 100 100)"
            className="transition-all duration-1000"
          />
          <text
            x="100"
            y="108"
            textAnchor="middle"
            className="fill-white font-light"
            style={{ fontSize: '38px' }}
          >
            {formatTime(timeLeft)}
          </text>
        </svg>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-4">
        {state === 'idle' && (
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
          >
            ▶️ Bắt đầu
          </button>
        )}
        {state === 'running' && (
          <button
            onClick={handlePause}
            className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
          >
            ⏸️ Tạm dừng
          </button>
        )}
        {state === 'paused' && (
          <>
            <button
              onClick={handleResume}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
            >
              ▶️ Tiếp tục
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            >
              ↺ Đặt lại
            </button>
          </>
        )}
        {state !== 'idle' && (
          <button
            onClick={handleSkip}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-sm"
          >
            ⏭️ Bỏ qua
          </button>
        )}
      </div>

      {/* Settings toggle */}
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="w-full py-2 text-white/50 hover:text-white/80 text-sm transition-all"
      >
        {isSettingsOpen ? '▲ Ẩn cài đặt' : '▼ Cài đặt thời gian'}
      </button>

      {/* Settings panel */}
      {isSettingsOpen && (
        <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
          <div>
            <label className="block text-xs text-white/70 mb-1">
              Tập trung: {settings.focusDuration} phút
            </label>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={settings.focusDuration}
              onChange={(e) => handleDurationChange('focus', parseInt(e.target.value))}
              className="w-full accent-green-500 h-1"
            />
          </div>
          <div>
            <label className="block text-xs text-white/70 mb-1">
              Nghỉ ngơi: {settings.breakDuration} phút
            </label>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={settings.breakDuration}
              onChange={(e) => handleDurationChange('break', parseInt(e.target.value))}
              className="w-full accent-blue-500 h-1"
            />
          </div>
          <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoStartBreak}
              onChange={(e) => onSettingsChange({ ...settings, autoStartBreak: e.target.checked })}
              className="accent-green-500"
            />
            Tự động bắt đầu nghỉ
          </label>
        </div>
      )}
    </div>
  );
}

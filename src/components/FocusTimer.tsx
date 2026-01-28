import { useState, useEffect, useCallback } from 'react';
import type { TimerSettings } from '../types';

interface FocusTimerProps {
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
}

type TimerMode = 'focus' | 'break';
type TimerState = 'idle' | 'running' | 'paused';

export function FocusTimer({ settings, onSettingsChange }: FocusTimerProps) {
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
      // Timer finished
      playNotificationSound();
      if (mode === 'focus') {
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
  }, [state, timeLeft, mode, settings]);

  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQE1l+Dbpn8CAACPy9afcwAAlMTYk2oAAI/D04hjAACCsshYWAAAc6K9Tk0AAGSPrkM/AABZgqM5OQAATnGYMS4AAERiizMoAAA7VoAxIwAANE17MiAAAC9Gdi4eAAAsQXMvHQAAKj9yMBwAACg9cTIbAAAnPHI0GwAAJjtzNhsAACY7dDcbAAAmPHU4GwAAJj12ORwAACY+dzsAAA==');
    audio.play().catch(() => {});
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  return (
    <div className="glass rounded-2xl p-6 text-white w-72">
      {/* Mode tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setMode('focus'); setState('idle'); }}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            mode === 'focus'
              ? 'bg-white/20 text-white'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          Tập trung
        </button>
        <button
          onClick={() => { setMode('break'); setState('idle'); }}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            mode === 'break'
              ? 'bg-white/20 text-white'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          Nghỉ ngơi
        </button>
      </div>

      {/* Timer display */}
      <div className="relative mb-6">
        <svg className="w-full h-48" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={mode === 'focus' ? '#22c55e' : '#3b82f6'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
            transform="rotate(-90 100 100)"
            className="transition-all duration-1000"
          />
          {/* Time text */}
          <text
            x="100"
            y="105"
            textAnchor="middle"
            className="fill-white text-4xl font-light"
            style={{ fontSize: '42px' }}
          >
            {formatTime(timeLeft)}
          </text>
          <text
            x="100"
            y="130"
            textAnchor="middle"
            className="fill-white/60 text-sm"
            style={{ fontSize: '14px' }}
          >
            {mode === 'focus' ? 'Thời gian tập trung' : 'Thời gian nghỉ'}
          </text>
        </svg>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {state === 'idle' && (
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
          >
            Bắt đầu
          </button>
        )}
        {state === 'running' && (
          <button
            onClick={handlePause}
            className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
          >
            Tạm dừng
          </button>
        )}
        {state === 'paused' && (
          <>
            <button
              onClick={handleResume}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
            >
              Tiếp tục
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            >
              Đặt lại
            </button>
          </>
        )}
        {state !== 'idle' && (
          <button
            onClick={handleSkip}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-sm"
          >
            Bỏ qua
          </button>
        )}
      </div>

      {/* Settings toggle */}
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="w-full mt-4 py-2 text-white/50 hover:text-white/80 text-sm transition-all"
      >
        {isSettingsOpen ? 'Ẩn cài đặt' : 'Cài đặt thời gian'}
      </button>

      {/* Settings panel */}
      {isSettingsOpen && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-2">
              Thời gian tập trung: {settings.focusDuration} phút
            </label>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={settings.focusDuration}
              onChange={(e) => handleDurationChange('focus', parseInt(e.target.value))}
              className="w-full accent-green-500"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-2">
              Thời gian nghỉ: {settings.breakDuration} phút
            </label>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={settings.breakDuration}
              onChange={(e) => handleDurationChange('break', parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoStartBreak}
              onChange={(e) => onSettingsChange({ ...settings, autoStartBreak: e.target.checked })}
              className="accent-green-500"
            />
            Tự động bắt đầu nghỉ ngơi
          </label>
        </div>
      )}
    </div>
  );
}

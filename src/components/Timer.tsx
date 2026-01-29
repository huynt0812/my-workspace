import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, X } from 'lucide-react';
import type { TimerSettings } from '../types';

interface TimerProps {
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
  onClose: () => void;
}

export function Timer({ settings, onClose }: TimerProps) {
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');

  // Use settings for durations if available, otherwise fallback to defaults
  const timerPresets = {
    pomodoro: (settings?.focusDuration || 25) * 60,
    shortBreak: (settings?.breakDuration || 5) * 60,
    longBreak: 15 * 60, // Fixed default for long break as it's not in settings
  };

  const [timeLeft, setTimeLeft] = useState(timerPresets.pomodoro);
  const [isRunning, setIsRunning] = useState(false);

  // Update timer when mode or settings change
  useEffect(() => {
    setTimeLeft(timerPresets[mode]);
    setIsRunning(false);
  }, [mode, settings.focusDuration, settings.breakDuration]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          // Here we could handle session completion, updating stats in settings
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimeLeft(timerPresets[mode]);
    setIsRunning(false);
  };

  const progress = ((timerPresets[mode] - timeLeft) / timerPresets[mode]) * 100;

  return (
    <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 w-80 shadow-xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-gray-100">Focus Timer</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex bg-gray-700/50 rounded-lg p-1">
          {(['pomodoro', 'shortBreak', 'longBreak'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${mode === m
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              {m === 'pomodoro' ? 'Focus' : m === 'shortBreak' ? 'Short' : 'Long'}
            </button>
          ))}
        </div>

        <div className="relative mx-auto w-48">
          <div className="aspect-square flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="fill-none stroke-gray-700/50"
                strokeWidth="6"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="fill-none stroke-blue-500 transition-all duration-1000 ease-linear"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 45}%`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}%`}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold font-mono tracking-wider text-white">
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-blue-400 mt-1 font-medium tracking-wide uppercase">
                {mode === 'pomodoro' ? 'Focus Time' : 'Break Time'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg ${isRunning
              ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30'
              : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                Wait
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                Start
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="p-3 bg-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-700 hover:text-white transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

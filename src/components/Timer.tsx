import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const timerPresets = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export function Timer() {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(timerPresets.pomodoro);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTimeLeft(timerPresets[mode]);
    setIsRunning(false);
  }, [mode]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
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
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 sticky top-24">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold">Focus Timer</h3>
        </div>

        <div className="flex gap-2">
          {(Object.keys(timerPresets) as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === m
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {m === 'pomodoro' ? 'Pomodoro' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </button>
          ))}
        </div>

        <div className="relative">
          <div className="aspect-square flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="fill-none stroke-gray-700"
                strokeWidth="8"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="fill-none stroke-blue-500 transition-all duration-1000"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold">{formatTime(timeLeft)}</div>
                <div className="text-sm text-gray-400 mt-2 capitalize">{mode.replace(/([A-Z])/g, ' $1')}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-medium hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="p-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

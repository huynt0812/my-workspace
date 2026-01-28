export interface BackgroundSettings {
  type: 'image' | 'video';
  url: string;
  opacity: number;
}

export interface TimerSettings {
  focusDuration: number;
  breakDuration: number;
  autoStartBreak: boolean;
  totalSessions: number;
  totalFocusTime: number; // in seconds
  dailyStreak: number;
  lastSessionDate: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  pomodoros: number; // completed pomodoros
  targetPomodoros: number;
  createdAt: number;
}

export interface MusicSettings {
  currentStation: string;
  volume: number;
  isPlaying: boolean;
}

export interface AmbientSound {
  id: string;
  name: string;
  icon: string;
  volume: number;
  isActive: boolean;
}

export interface AppSettings {
  background: BackgroundSettings;
  timer: TimerSettings;
  notes: Note[];
  tasks: Task[];
  music: MusicSettings;
  ambientSounds: AmbientSound[];
  sidebarCollapsed: boolean;
}

// Lofi music stations (YouTube live streams)
export const MUSIC_STATIONS = [
  {
    id: 'lofi-girl',
    name: 'Lofi Girl',
    url: 'jfKfPfyJRdk', // YouTube video ID
    thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
  },
  {
    id: 'chillhop',
    name: 'Chillhop',
    url: '5yx6BWlEVcY',
    thumbnail: 'https://i.ytimg.com/vi/5yx6BWlEVcY/hqdefault.jpg',
  },
  {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    url: 'h2zkV-l_TbY',
    thumbnail: 'https://i.ytimg.com/vi/h2zkV-l_TbY/hqdefault.jpg',
  },
  {
    id: 'jazz-lofi',
    name: 'Jazz Lofi',
    url: 'kgx4WGK0oNU',
    thumbnail: 'https://i.ytimg.com/vi/kgx4WGK0oNU/hqdefault.jpg',
  },
];

// Ambient sounds
export const DEFAULT_AMBIENT_SOUNDS: AmbientSound[] = [
  { id: 'rain', name: 'Mưa', icon: '🌧️', volume: 0.5, isActive: false },
  { id: 'thunder', name: 'Sấm', icon: '⛈️', volume: 0.3, isActive: false },
  { id: 'fire', name: 'Lửa', icon: '🔥', volume: 0.5, isActive: false },
  { id: 'forest', name: 'Rừng', icon: '🌲', volume: 0.4, isActive: false },
  { id: 'wind', name: 'Gió', icon: '💨', volume: 0.3, isActive: false },
  { id: 'cafe', name: 'Café', icon: '☕', volume: 0.4, isActive: false },
  { id: 'waves', name: 'Sóng biển', icon: '🌊', volume: 0.5, isActive: false },
  { id: 'birds', name: 'Chim', icon: '🐦', volume: 0.3, isActive: false },
];

// Lofi/Anime style backgrounds
export const DEFAULT_BACKGROUNDS = [
  {
    name: 'Cozy Bedroom',
    url: 'https://w.wallhaven.cc/full/zy/wallhaven-zymgky.jpg',
    type: 'image' as const,
    category: 'indoor',
  },
  {
    name: 'Rooftop Sunset',
    url: 'https://w.wallhaven.cc/full/pk/wallhaven-pkz5r9.png',
    type: 'image' as const,
    category: 'outdoor',
  },
  {
    name: 'Rainy Window',
    url: 'https://w.wallhaven.cc/full/x8/wallhaven-x8pr7z.jpg',
    type: 'image' as const,
    category: 'indoor',
  },
  {
    name: 'Night City',
    url: 'https://w.wallhaven.cc/full/4x/wallhaven-4xpv9l.jpg',
    type: 'image' as const,
    category: 'outdoor',
  },
  {
    name: 'Study Room',
    url: 'https://w.wallhaven.cc/full/we/wallhaven-weqpw8.png',
    type: 'image' as const,
    category: 'indoor',
  },
  {
    name: 'Autumn Garden',
    url: 'https://w.wallhaven.cc/full/rr/wallhaven-rrm99q.jpg',
    type: 'image' as const,
    category: 'outdoor',
  },
  {
    name: 'Coffee Shop',
    url: 'https://w.wallhaven.cc/full/o5/wallhaven-o5lmep.jpg',
    type: 'image' as const,
    category: 'indoor',
  },
  {
    name: 'Train Journey',
    url: 'https://w.wallhaven.cc/full/4g/wallhaven-4gpj93.png',
    type: 'image' as const,
    category: 'travel',
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  background: {
    type: 'image',
    url: DEFAULT_BACKGROUNDS[0].url,
    opacity: 0.4,
  },
  timer: {
    focusDuration: 25,
    breakDuration: 5,
    autoStartBreak: false,
    totalSessions: 0,
    totalFocusTime: 0,
    dailyStreak: 0,
    lastSessionDate: '',
  },
  notes: [],
  tasks: [],
  music: {
    currentStation: MUSIC_STATIONS[0].id,
    volume: 0.5,
    isPlaying: false,
  },
  ambientSounds: DEFAULT_AMBIENT_SOUNDS,
  sidebarCollapsed: false,
};

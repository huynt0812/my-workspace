export interface BackgroundSettings {
  type: 'image' | 'video' | 'gradient';
  url: string;
  opacity: number;
}

export interface TimerSettings {
  focusDuration: number; // in minutes
  breakDuration: number; // in minutes
  autoStartBreak: boolean;
}

export interface Note {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface AppSettings {
  background: BackgroundSettings;
  timer: TimerSettings;
  notes: Note[];
}

export const DEFAULT_BACKGROUNDS = [
  {
    name: 'Cozy Room',
    url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1920',
    type: 'image' as const,
  },
  {
    name: 'Mountain Lake',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
    type: 'image' as const,
  },
  {
    name: 'Night City',
    url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1920',
    type: 'image' as const,
  },
  {
    name: 'Forest',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920',
    type: 'image' as const,
  },
  {
    name: 'Ocean Sunset',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920',
    type: 'image' as const,
  },
  {
    name: 'Rainy Window',
    url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1920',
    type: 'image' as const,
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  background: {
    type: 'image',
    url: DEFAULT_BACKGROUNDS[0].url,
    opacity: 0.5,
  },
  timer: {
    focusDuration: 25,
    breakDuration: 5,
    autoStartBreak: false,
  },
  notes: [],
};

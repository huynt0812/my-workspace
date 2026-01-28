import { useLocalStorage } from './hooks/useLocalStorage';
import type { AppSettings } from './types';
import { DEFAULT_SETTINGS } from './types';
import {
  Background,
  BackgroundSettings,
  Clock,
  FocusTimer,
  Notes,
} from './components';
import './index.css';

function App() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    'focus-workspace-settings',
    DEFAULT_SETTINGS
  );

  const updateBackground = (background: AppSettings['background']) => {
    setSettings((prev) => ({ ...prev, background }));
  };

  const updateTimer = (timer: AppSettings['timer']) => {
    setSettings((prev) => ({ ...prev, timer }));
  };

  const updateNotes = (notes: AppSettings['notes']) => {
    setSettings((prev) => ({ ...prev, notes }));
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <Background settings={settings.background} />

      {/* Main content */}
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        {/* Clock - center */}
        <div className="mb-12">
          <Clock />
        </div>

        {/* Focus Timer - below clock */}
        <FocusTimer settings={settings.timer} onSettingsChange={updateTimer} />
      </div>

      {/* Bottom left - Notes */}
      <div className="fixed bottom-6 left-6">
        <Notes notes={settings.notes} onNotesChange={updateNotes} />
      </div>

      {/* Bottom right - Background Settings */}
      <div className="fixed bottom-6 right-6">
        <BackgroundSettings
          settings={settings.background}
          onSettingsChange={updateBackground}
        />
      </div>

      {/* App name watermark */}
      <div className="fixed top-6 left-6 text-white/30 text-sm font-light select-none">
        Focus Workspace
      </div>
    </div>
  );
}

export default App;

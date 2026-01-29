import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { AppSettings } from './types';
import { DEFAULT_SETTINGS } from './types';
import {
  Background,
  BackgroundSettings,
  Timer,
  MusicPlayer,
  AmbientSounds,
  TaskList,
  BottomToolbar,
} from './components';
import type { PanelType } from './components';
import './index.css';

function App() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    'focus-workspace-settings',
    DEFAULT_SETTINGS
  );
  const [activePanel, setActivePanel] = useState<PanelType>(null);

  const updateBackground = (background: AppSettings['background']) => {
    setSettings((prev) => ({ ...prev, background }));
  };

  const updateTimer = (timer: AppSettings['timer']) => {
    setSettings((prev) => ({ ...prev, timer }));
  };

  const updateMusic = (music: AppSettings['music']) => {
    setSettings((prev) => ({ ...prev, music }));
  };

  const updateAmbientSounds = (ambientSounds: AppSettings['ambientSounds']) => {
    setSettings((prev) => ({ ...prev, ambientSounds }));
  };

  const updateTasks = (tasks: AppSettings['tasks']) => {
    setSettings((prev) => ({ ...prev, tasks }));
  };

  const closePanel = () => setActivePanel(null);

  const toggleMusicPlaying = () => {
    setSettings((prev) => ({
      ...prev,
      music: { ...prev.music, isPlaying: !prev.music.isPlaying },
    }));
  };

const activeSoundsCount =
  (settings.ambientSounds || []).filter((s) => s.isActive).length;


  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background - fullscreen immersive */}
      <Background settings={settings.background} />

      {/* Panel content - appears from right side */}
      {activePanel && (
        <>
          {/* Backdrop to close panel */}
          <div
            className="fixed inset-0 z-30"
            onClick={closePanel}
          />
          {/* Panel */}
          <div className="fixed right-4 top-4 z-40 animate-slide-in">
            {activePanel === 'music' && (
              <MusicPlayer
                settings={settings.music}
                onSettingsChange={updateMusic}
                onClose={closePanel}
              />
            )}
            {activePanel === 'sounds' && (
              <AmbientSounds
                sounds={settings.ambientSounds}
                onSoundsChange={updateAmbientSounds}
                onClose={closePanel}
              />
            )}
            {activePanel === 'timer' && (
              <Timer
                settings={settings.timer}
                onSettingsChange={updateTimer}
                onClose={closePanel}
              />
            )}
            {activePanel === 'tasks' && (
              <TaskList
                tasks={settings.tasks}
                onTasksChange={updateTasks}
                onClose={closePanel}
              />
            )}
            {activePanel === 'background' && (
              <BackgroundSettings
                settings={settings.background}
                onSettingsChange={updateBackground}
                onClose={closePanel}
              />
            )}
          </div>
        </>
      )}

      {/* Bottom Toolbar */}
      <BottomToolbar
        activePanel={activePanel}
        onPanelChange={setActivePanel}
        isMusicPlaying={settings.music?.isPlaying ?? false}
        onMusicToggle={toggleMusicPlaying}
        activeSoundsCount={activeSoundsCount}
      />

      {/* Branding - subtle watermark */}
      <div className="fixed bottom-16 right-4 text-white/20 text-xs select-none pointer-events-none">
        lofizen.co
      </div>
    </div>
  );
}

export default App;

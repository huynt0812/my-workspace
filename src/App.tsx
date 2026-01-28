import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { AppSettings } from './types';
import { DEFAULT_SETTINGS } from './types';
import {
  Background,
  BackgroundSettings,
  Clock,
  FocusTimer,
  Sidebar,
  MusicPlayer,
  AmbientSounds,
  TaskList,
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

  const toggleSidebarCollapse = () => {
    setSettings((prev) => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };

  const closePanel = () => setActivePanel(null);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <Background settings={settings.background} />

      {/* Sidebar */}
      <Sidebar
        activePanel={activePanel}
        onPanelChange={setActivePanel}
        isCollapsed={settings.sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      {/* Panel content - appears next to sidebar */}
      {activePanel && (
        <div className="fixed left-16 top-0 h-full flex items-center z-30 p-4">
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
            <FocusTimer
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
      )}

      {/* Main content - center */}
      <div className="min-h-screen flex flex-col items-center justify-center p-8 ml-16">
        {/* Clock */}
        <div className="mb-8">
          <Clock />
        </div>

        {/* Compact Timer */}
        <FocusTimer
          settings={settings.timer}
          onSettingsChange={updateTimer}
          compact
        />
      </div>

      {/* Keyboard shortcut hint */}
      <div className="fixed bottom-4 right-4 text-white/20 text-xs select-none">
        Focus Workspace
      </div>
    </div>
  );
}

export default App;

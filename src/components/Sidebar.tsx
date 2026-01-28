import { useState } from 'react';

export type PanelType = 'music' | 'sounds' | 'timer' | 'tasks' | 'background' | 'settings' | null;

interface SidebarProps {
  activePanel: PanelType;
  onPanelChange: (panel: PanelType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems: { id: PanelType; icon: string; label: string }[] = [
  { id: 'music', icon: '🎵', label: 'Nhạc' },
  { id: 'sounds', icon: '🔊', label: 'Âm thanh' },
  { id: 'timer', icon: '⏱️', label: 'Timer' },
  { id: 'tasks', icon: '📝', label: 'Tasks' },
  { id: 'background', icon: '🖼️', label: 'Hình nền' },
];

export function Sidebar({ activePanel, onPanelChange, isCollapsed, onToggleCollapse }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<PanelType>(null);

  const handleItemClick = (id: PanelType) => {
    if (activePanel === id) {
      onPanelChange(null);
    } else {
      onPanelChange(id);
    }
  };

  return (
    <div className="fixed left-0 top-0 h-full z-40 flex">
      {/* Sidebar */}
      <div className="glass h-full flex flex-col items-center py-6 px-2 gap-2">
        {/* Logo */}
        <div className="mb-6 p-2">
          <span className="text-2xl">🎯</span>
        </div>

        {/* Menu items */}
        <div className="flex flex-col gap-1 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`
                relative p-3 rounded-xl transition-all duration-200
                ${activePanel === item.id
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                }
              `}
              title={item.label}
            >
              <span className="text-xl">{item.icon}</span>

              {/* Tooltip */}
              {hoveredItem === item.id && (
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 glass px-3 py-1.5 rounded-lg whitespace-nowrap text-sm text-white">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Bottom - collapse button */}
        <button
          onClick={onToggleCollapse}
          className="p-3 rounded-xl text-white/50 hover:bg-white/10 hover:text-white transition-all"
          title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
        >
          <svg
            className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

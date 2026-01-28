import { useState } from 'react';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  onClose: () => void;
}

export function TaskList({ tasks, onTasksChange, onClose }: TaskListProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completed: false,
      pomodoros: 0,
      targetPomodoros: 4,
      createdAt: Date.now(),
    };

    onTasksChange([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    onTasksChange(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    onTasksChange(tasks.filter((task) => task.id !== taskId));
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  const saveEdit = () => {
    if (!editingTitle.trim() || !editingId) {
      setEditingId(null);
      return;
    }

    const updatedTasks = tasks.map((task) =>
      task.id === editingId ? { ...task, title: editingTitle.trim() } : task
    );
    onTasksChange(updatedTasks);
    setEditingId(null);
  };

  const incrementPomodoro = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, pomodoros: task.pomodoros + 1 } : task
    );
    onTasksChange(updatedTasks);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalPomodoros = tasks.reduce((sum, t) => sum + t.pomodoros, 0);

  return (
    <div className="glass rounded-2xl p-4 w-80 text-white max-h-[70vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center gap-2">
          <span>📝</span>
          Tasks
          {tasks.length > 0 && (
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {completedCount}/{tasks.length}
            </span>
          )}
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Stats */}
      {tasks.length > 0 && (
        <div className="flex gap-2 mb-4">
          <div className="flex-1 bg-white/10 rounded-lg p-2 text-center">
            <p className="text-lg font-semibold">{totalPomodoros}</p>
            <p className="text-xs text-white/60">🍅 Pomodoros</p>
          </div>
          <div className="flex-1 bg-white/10 rounded-lg p-2 text-center">
            <p className="text-lg font-semibold">{completedCount}</p>
            <p className="text-xs text-white/60">✅ Hoàn thành</p>
          </div>
        </div>
      )}

      {/* Add new task */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Thêm task mới..."
          className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
        />
        <button
          onClick={addTask}
          disabled={!newTaskTitle.trim()}
          className="px-3 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 rounded-lg transition-all"
        >
          +
        </button>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center text-white/50 py-8">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-sm">Chưa có task nào</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`
                p-3 rounded-xl transition-all
                ${task.completed ? 'bg-white/5 opacity-60' : 'bg-white/10'}
              `}
            >
              {editingId === task.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    className="flex-1 bg-white/10 rounded px-2 py-1 text-sm focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={saveEdit}
                    className="px-2 py-1 bg-white/20 rounded text-sm"
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`
                      w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all
                      ${task.completed
                        ? 'bg-green-500/80 border-green-500/80 text-white'
                        : 'border-white/30 hover:border-white/50'
                      }
                    `}
                  >
                    {task.completed && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${task.completed ? 'line-through text-white/50' : ''}`}
                      onDoubleClick={() => startEditing(task)}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/50">
                        🍅 {task.pomodoros}/{task.targetPomodoros}
                      </span>
                      {!task.completed && (
                        <button
                          onClick={() => incrementPomodoro(task.id)}
                          className="text-xs text-white/50 hover:text-white"
                        >
                          +1
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 text-white/30 hover:text-red-400 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Clear completed */}
      {completedCount > 0 && (
        <button
          onClick={() => onTasksChange(tasks.filter((t) => !t.completed))}
          className="mt-4 w-full p-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/60 transition-all"
        >
          Xóa {completedCount} task đã hoàn thành
        </button>
      )}
    </div>
  );
}

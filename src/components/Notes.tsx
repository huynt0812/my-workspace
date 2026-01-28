import { useState } from 'react';
import type { Note } from '../types';

interface NotesProps {
  notes: Note[];
  onNotesChange: (notes: Note[]) => void;
}

export function Notes({ notes, onNotesChange }: NotesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');

  const addNote = () => {
    if (!newNoteContent.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      content: newNoteContent.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    onNotesChange([newNote, ...notes]);
    setNewNoteContent('');
  };

  const updateNote = (id: string, content: string) => {
    onNotesChange(
      notes.map((note) =>
        note.id === id
          ? { ...note, content, updatedAt: Date.now() }
          : note
      )
    );
    setEditingId(null);
  };

  const deleteNote = (id: string) => {
    onNotesChange(notes.filter((note) => note.id !== id));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="glass rounded-xl p-4 text-white hover:bg-white/10 transition-all flex items-center gap-3"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span>Ghi chú ({notes.length})</span>
      </button>
    );
  }

  return (
    <div className="glass rounded-xl p-4 text-white w-80 max-h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Ghi chú
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1 hover:bg-white/10 rounded transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Add new note */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addNote()}
          placeholder="Thêm ghi chú mới..."
          className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        <button
          onClick={addNote}
          disabled={!newNoteContent.trim()}
          className="px-3 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:hover:bg-white/20 rounded-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {notes.length === 0 ? (
          <p className="text-center text-white/50 text-sm py-4">
            Chưa có ghi chú nào
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-white/5 rounded-lg p-3 group"
            >
              {editingId === note.id ? (
                <input
                  type="text"
                  defaultValue={note.content}
                  autoFocus
                  onBlur={(e) => updateNote(note.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      updateNote(note.id, e.currentTarget.value);
                    } else if (e.key === 'Escape') {
                      setEditingId(null);
                    }
                  }}
                  className="w-full bg-transparent focus:outline-none"
                />
              ) : (
                <>
                  <p className="text-sm mb-1">{note.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">
                      {formatDate(note.updatedAt)}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingId(note.id)}
                        className="p-1 hover:bg-white/10 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 hover:bg-red-500/20 rounded text-red-400"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

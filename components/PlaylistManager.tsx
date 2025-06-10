
import React, { useState } from 'react';
import { YouTubePlaylist } from '../types';
import { PlusIcon } from './icons/PlusIcon';

interface PlaylistManagerProps {
  playlists: YouTubePlaylist[];
  selectedPlaylistId: string | null;
  onSelectPlaylist: (id: string | null) => void;
  onCreatePlaylist: (title: string) => Promise<void>;
  disabled?: boolean;
  onRefreshPlaylists: () => void;
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  playlists,
  selectedPlaylistId,
  onSelectPlaylist,
  onCreatePlaylist,
  disabled,
  onRefreshPlaylists,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistTitle.trim()) {
      await onCreatePlaylist(newPlaylistTitle.trim());
      setNewPlaylistTitle('');
      setShowCreateForm(false);
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="playlistSelect" className="block text-sm font-medium text-slate-300">
            Select Existing Playlist:
          </label>
          <button
            onClick={onRefreshPlaylists}
            disabled={disabled}
            className="text-xs text-sky-400 hover:text-sky-300 disabled:opacity-50"
            title="Refresh playlist list"
          >
            Refresh
          </button>
        </div>
        <select
          id="playlistSelect"
          value={selectedPlaylistId || ''}
          onChange={(e) => onSelectPlaylist(e.target.value || null)}
          disabled={disabled || playlists.length === 0}
          className="w-full bg-slate-700 border border-slate-600 text-slate-200 py-2 px-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
        >
          <option value="">-- Choose a playlist --</option>
          {playlists.map(p => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.itemCount !== undefined ? p.itemCount : 'N/A'} songs)
            </option>
          ))}
        </select>
        {playlists.length === 0 && !disabled && (
            <p className="text-xs text-slate-400 mt-1">No playlists found, or still loading. Try refreshing or create a new one.</p>
        )}
      </div>

      <div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          disabled={disabled}
          className="text-sm text-purple-400 hover:text-purple-300 flex items-center disabled:opacity-50"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          {showCreateForm ? 'Cancel' : 'Or Create New Playlist'}
        </button>
        {showCreateForm && (
          <form onSubmit={handleCreate} className="mt-3 flex space-x-2">
            <input
              type="text"
              value={newPlaylistTitle}
              onChange={(e) => setNewPlaylistTitle(e.target.value)}
              placeholder="New playlist title"
              className="flex-grow bg-slate-700 border border-slate-600 text-slate-200 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
              disabled={disabled}
            />
            <button
              type="submit"
              disabled={disabled || !newPlaylistTitle.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out disabled:opacity-50"
            >
              Create
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PlaylistManager;


import React from 'react';
import { OsuSong, SongImportStatus } from '../types';
import { MusicNoteIcon } from './icons/MusicNoteIcon';
import LoadingSpinner from './LoadingSpinner';

interface SongItemProps {
  song: OsuSong;
}

const StatusIndicator: React.FC<{ status: SongImportStatus }> = ({ status }) => {
  switch (status) {
    case 'pending':
      return <span className="text-xs text-slate-500">Pending</span>;
    case 'searching':
      return <div className="flex items-center space-x-1"><LoadingSpinner size="xs" /><span className="text-xs text-blue-400">Searching...</span></div>;
    case 'adding':
      return <div className="flex items-center space-x-1"><LoadingSpinner size="xs" /><span className="text-xs text-yellow-400">Adding...</span></div>;
    case 'added':
      return <span className="text-xs text-green-400">Added to playlist</span>;
    case 'failed':
      return <span className="text-xs text-red-400">Failed</span>;
    default:
      return null;
  }
};

const SongItem: React.FC<SongItemProps> = ({ song }) => {
  return (
    <div className="bg-slate-700 p-3 rounded-md shadow flex items-center justify-between space-x-3">
      <div className="flex items-center space-x-3 min-w-0">
        <MusicNoteIcon className="w-5 h-5 text-purple-400 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate" title={song.cleanedName}>
            {song.cleanedName}
          </p>
          <p className="text-xs text-slate-400 truncate" title={song.originalName}>
            Original: {song.originalName}
          </p>
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        <StatusIndicator status={song.status} />
        {song.status === 'failed' && song.error && (
          <p className="text-xs text-red-500 mt-0.5 truncate" title={song.error}>{song.error}</p>
        )}
         {song.status === 'added' && song.youtubeVideoId && (
          <a 
            href={`https://www.youtube.com/watch?v=${song.youtubeVideoId}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-sky-400 hover:text-sky-300 mt-0.5 block hover:underline"
          >
            View on YouTube
          </a>
        )}
      </div>
    </div>
  );
};

export default SongItem;

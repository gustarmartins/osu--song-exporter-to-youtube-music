
import React from 'react';
import { YouTubeUser } from '../types';
import { YouTubeIcon } from './icons/YouTubeIcon';

interface YouTubeAuthProps {
  isAuthenticated: boolean;
  user: YouTubeUser | null;
  onLogin: () => void;
  onLogout: () => void;
  disabled?: boolean;
}

const YouTubeAuth: React.FC<YouTubeAuthProps> = ({ isAuthenticated, user, onLogin, onLogout, disabled }) => {
  if (isAuthenticated && user) {
    return (
      <div className="flex items-center justify-between bg-slate-700 p-4 rounded-lg shadow">
        <div className="flex items-center space-x-3">
          {user.imageUrl && (
            <img src={user.imageUrl} alt={user.name || 'User Avatar'} className="w-10 h-10 rounded-full" />
          )}
          <div>
            <p className="text-sm font-medium text-slate-200">{user.name || 'YouTube User'}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          disabled={disabled}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-150 ease-in-out disabled:opacity-50"
        >
          Log Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onLogin}
      disabled={disabled}
      className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out disabled:opacity-50"
    >
      <YouTubeIcon className="w-5 h-5 mr-2" />
      Login with YouTube
    </button>
  );
};

export default YouTubeAuth;

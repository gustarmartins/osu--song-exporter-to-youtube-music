
import React, { useState, useEffect, useCallback } from 'react';
import { OsuSong, YouTubePlaylist, YouTubeUser, SongImportStatus } from './types';
import { YOUTUBE_API_CLIENT_ID, YOUTUBE_API_SCOPES, APP_TITLE } from './constants';
import { parseOsuFolderNames } from './services/osuService';
import { youtubeServiceInstance } from './services/youtubeService';
import OsuFolderSelector from './components/OsuFolderSelector';
import SongItem from './components/SongItem';
import YouTubeAuth from './components/YouTubeAuth';
import PlaylistManager from './components/PlaylistManager';
import LoadingSpinner from './components/LoadingSpinner';
import Modal from './components/Modal';
import { MusicNoteIcon } from './components/icons/MusicNoteIcon';
// import { geminiService } from './services/geminiService'; // Example of Gemini service import

const App: React.FC = () => {
  const [osuSongs, setOsuSongs] = useState<OsuSong[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [ytUser, setYtUser] = useState<YouTubeUser | null>(null);
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTaskMessage, setCurrentTaskMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessingSongs, setIsProcessingSongs] = useState<boolean>(false);

  const updateSongStatus = useCallback((songId: string, status: SongImportStatus, youtubeVideoId?: string, errorMsg?: string) => {
    setOsuSongs(prevSongs =>
      prevSongs.map(song =>
        song.id === songId ? { ...song, status, youtubeVideoId, error: errorMsg } : song
      )
    );
  }, []);
  
  useEffect(() => {
    if (!YOUTUBE_API_CLIENT_ID || YOUTUBE_API_CLIENT_ID === 'YOUR_YOUTUBE_CLIENT_ID') {
      setError("YouTube Client ID is not configured. Please set it in constants.ts");
      setIsLoading(false);
      return;
    }

    youtubeServiceInstance.loadClient()
      .then(() => {
        youtubeServiceInstance.onAuthChange((isSignedIn, user) => {
          setIsAuthenticated(isSignedIn);
          setYtUser(user);
          if (isSignedIn) {
            fetchPlaylists();
          } else {
            setPlaylists([]);
            setSelectedPlaylistId(null);
          }
        });
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error loading YouTube client:", err);
        setError("Failed to initialize YouTube client. Check console for details.");
        setIsLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPlaylists = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setCurrentTaskMessage('Fetching your YouTube playlists...');
    try {
      const fetchedPlaylists = await youtubeServiceInstance.listPlaylists();
      setPlaylists(fetchedPlaylists);
      setError(null);
    } catch (err) {
      console.error('Error fetching playlists:', err);
      setError('Failed to fetch playlists. Please try logging in again.');
      setPlaylists([]);
    } finally {
      setIsLoading(false);
      setCurrentTaskMessage('');
    }
  };

  const handleFoldersSelected = (files: FileList | null) => {
    if (files) {
      setCurrentTaskMessage('Processing song folders...');
      setIsLoading(true);
      try {
        const songs = parseOsuFolderNames(files);
        setOsuSongs(songs);
        setError(null);
      } catch (err) {
        console.error("Error parsing folder names:", err)
        setError("Could not parse folder names. Ensure you selected the osu! 'Songs' directory.");
        setOsuSongs([]);
      } finally {
        setIsLoading(false);
        setCurrentTaskMessage('');
      }
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setCurrentTaskMessage('Attempting to log in to YouTube...');
    try {
      await youtubeServiceInstance.signIn();
      // Auth change listener will update state
      setError(null);
    } catch (err) {
      console.error('Login failed:', err);
      setError('YouTube login failed. Please try again.');
    } finally {
      setIsLoading(false);
      setCurrentTaskMessage('');
    }
  };

  const handleLogout = () => {
    youtubeServiceInstance.signOut();
    // Auth change listener will update state
  };

  const handleCreatePlaylist = async (title: string) => {
    if (!isAuthenticated) {
      setError("Please log in to YouTube first.");
      return;
    }
    setIsLoading(true);
    setCurrentTaskMessage(`Creating playlist: ${title}...`);
    try {
      const newPlaylist = await youtubeServiceInstance.createPlaylist(title);
      setPlaylists(prev => [newPlaylist, ...prev]);
      setSelectedPlaylistId(newPlaylist.id);
      setError(null);
    } catch (err) {
      console.error('Error creating playlist:', err);
      setError('Failed to create playlist.');
    } finally {
      setIsLoading(false);
      setCurrentTaskMessage('');
    }
  };
  
  const handleAddSongsToPlaylist = async () => {
    if (!selectedPlaylistId || osuSongs.length === 0) {
      setError("Please select songs and a playlist first.");
      return;
    }
    setIsProcessingSongs(true);
    setError(null);

    for (const song of osuSongs) {
      if (song.status === 'added') continue; // Skip already added songs

      updateSongStatus(song.id, 'searching');
      setCurrentTaskMessage(`Searching for: ${song.cleanedName}...`);
      try {
        const searchResult = await youtubeServiceInstance.searchSong(song.cleanedName);
        if (searchResult && searchResult.id) {
          updateSongStatus(song.id, 'adding', searchResult.id);
          setCurrentTaskMessage(`Adding ${song.cleanedName} to playlist...`);
          await youtubeServiceInstance.addSongToPlaylist(selectedPlaylistId, searchResult.id);
          updateSongStatus(song.id, 'added', searchResult.id);
          setCurrentTaskMessage(`${song.cleanedName} added successfully.`);
        } else {
          updateSongStatus(song.id, 'failed', undefined, 'Song not found on YouTube');
          setCurrentTaskMessage(`Could not find ${song.cleanedName} on YouTube.`);
        }
      } catch (err: any) {
        console.error(`Error processing song ${song.cleanedName}:`, err);
        let errorDetail = 'Failed to add song.';
        if (err.result && err.result.error && err.result.error.message) {
          errorDetail = err.result.error.message;
        } else if (err.message) {
          errorDetail = err.message;
        }
        updateSongStatus(song.id, 'failed', undefined, errorDetail);
        setCurrentTaskMessage(`Error adding ${song.cleanedName}: ${errorDetail}`);
      }
      // Small delay to avoid hitting API limits too quickly
      await new Promise(resolve => setTimeout(resolve, 1000)); 
    }
    setCurrentTaskMessage('All songs processed.');
    setIsProcessingSongs(false);
  };

  if (isLoading && !currentTaskMessage && !error) { // Initial loading state
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
        <LoadingSpinner />
        <p className="text-slate-300 mt-4">Initializing application...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center space-x-3">
          <MusicNoteIcon className="w-10 h-10" />
          <span>{APP_TITLE}</span>
        </h1>
        <p className="text-slate-400 mt-2 text-sm md:text-base">Export your osu! song library to a YouTube Music playlist.</p>
      </header>

      {(isLoading && currentTaskMessage) && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex flex-col items-center justify-center z-50">
          <LoadingSpinner />
          <p className="text-slate-200 mt-4 text-lg">{currentTaskMessage}</p>
        </div>
      )}

      {error && <Modal title="Error" message={error} onClose={() => setError(null)} type="error" />}
      
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-slate-800 shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-purple-400">Step 1: Select osu! Songs Folder</h2>
          <OsuFolderSelector onFoldersSelected={handleFoldersSelected} disabled={isProcessingSongs} />
          {osuSongs.length > 0 && (
             <p className="mt-3 text-sm text-slate-400">{osuSongs.length} song folders found. Review list below.</p>
          )}
        </section>

        {osuSongs.length > 0 && (
          <section className="bg-slate-800 shadow-xl rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-pink-500">Step 2: YouTube Music Integration</h2>
            <YouTubeAuth
              isAuthenticated={isAuthenticated}
              user={ytUser}
              onLogin={handleLogin}
              onLogout={handleLogout}
              disabled={isProcessingSongs}
            />
            {isAuthenticated && (
              <PlaylistManager
                playlists={playlists}
                selectedPlaylistId={selectedPlaylistId}
                onSelectPlaylist={setSelectedPlaylistId}
                onCreatePlaylist={handleCreatePlaylist}
                disabled={isProcessingSongs || isLoading}
                onRefreshPlaylists={fetchPlaylists}
              />
            )}
          </section>
        )}

        {osuSongs.length > 0 && isAuthenticated && selectedPlaylistId && (
          <section className="bg-slate-800 shadow-xl rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-red-500">Step 3: Add to Playlist</h2>
            <button
              onClick={handleAddSongsToPlaylist}
              disabled={isProcessingSongs || isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessingSongs ? <LoadingSpinner size="sm" /> : <MusicNoteIcon className="w-5 h-5 mr-2"/>}
              {isProcessingSongs ? 'Processing Songs...' : `Add ${osuSongs.filter(s => s.status !== 'added').length} Songs to Playlist`}
            </button>
          </section>
        )}
        
        {osuSongs.length > 0 && (
          <section className="bg-slate-800 shadow-xl rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2 text-slate-300">Song Import Progress</h2>
            <p className="text-sm text-slate-400 mb-4">
              {currentTaskMessage && currentTaskMessage.startsWith("Error") ? 
                <span className="text-red-400">{currentTaskMessage}</span> : 
                <span className="text-blue-400">{currentTaskMessage || "Waiting for process to start..."}</span>
              }
            </p>
            <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
              {osuSongs.map(song => (
                <SongItem key={song.id} song={song} />
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="text-center mt-12 py-4 text-slate-500 text-sm">
        <p>Osu! To YouTube Music Exporter. Ensure you have appropriate rights to upload/create playlists.</p>
        <p className="mt-1">Note: This tool relies on YouTube search and may not always find the exact song version.</p>
      </footer>
    </div>
  );
};

export default App;

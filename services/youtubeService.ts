
import { YOUTUBE_API_CLIENT_ID, YOUTUBE_API_SCOPES } from '../constants';
import { YouTubePlaylist, YouTubeUser, YouTubeVideo, GapiPlaylist, GapiPlaylistItem, GapiSearchResult } from '../types';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gapi: any; 
  }
}
// Placeholder for API Key if some unauthenticated calls needed it, but primary functions use OAuth
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY_IF_NEEDED_FOR_NON_OAUTH_SEARCH'; // Not strictly needed if all search is authenticated

class YouTubeService {
  private gapiLoaded: boolean = false;
  private authInstance: any = null; // eslint-disable-line @typescript-eslint/no-explicit-any
  private authChangeCallback: ((isSignedIn: boolean, user: YouTubeUser | null) => void) | null = null;

  public async loadClient(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.gapiLoaded) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', async () => {
          try {
            await window.gapi.client.init({
              // apiKey: YOUTUBE_API_KEY, // Only if making non-OAuth calls. Not strictly needed if all actions are OAuth.
              clientId: YOUTUBE_API_CLIENT_ID,
              scope: YOUTUBE_API_SCOPES,
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
            });
            this.gapiLoaded = true;
            this.authInstance = window.gapi.auth2.getAuthInstance();
            this.authInstance.isSignedIn.listen(this.updateSigninStatus.bind(this));
            this.updateSigninStatus(this.authInstance.isSignedIn.get());
            resolve();
          } catch (error) {
            console.error('Error initializing Google API client:', error);
            reject(error);
          }
        });
      };
      script.onerror = (error) => {
        console.error('Error loading GAPI script:', error);
        reject(error);
      };
      document.body.appendChild(script);
    });
  }

  private updateSigninStatus(isSignedIn: boolean): void {
    if (this.authChangeCallback) {
      if (isSignedIn) {
        const currentUser = this.authInstance.currentUser.get();
        const profile = currentUser.getBasicProfile();
        const user: YouTubeUser = {
          name: profile ? profile.getName() : null,
          email: profile ? profile.getEmail() : null,
          imageUrl: profile ? profile.getImageUrl() : null,
        };
        this.authChangeCallback(true, user);
      } else {
        this.authChangeCallback(false, null);
      }
    }
  }
  
  public onAuthChange(callback: (isSignedIn: boolean, user: YouTubeUser | null) => void): void {
    this.authChangeCallback = callback;
     // Immediately call with current status if authInstance is already available
    if (this.authInstance) {
      this.updateSigninStatus(this.authInstance.isSignedIn.get());
    }
  }

  public async signIn(): Promise<void> {
    if (!this.authInstance) throw new Error('GAPI auth not initialized.');
    return this.authInstance.signIn();
  }

  public signOut(): void {
    if (!this.authInstance) throw new Error('GAPI auth not initialized.');
    this.authInstance.signOut();
  }

  public isAuthenticated(): boolean {
    return this.authInstance ? this.authInstance.isSignedIn.get() : false;
  }

  public async listPlaylists(): Promise<YouTubePlaylist[]> {
    if (!this.isAuthenticated() || !window.gapi.client.youtube) {
      throw new Error('User not authenticated or YouTube client not loaded.');
    }
    const response = await window.gapi.client.youtube.playlists.list({
      part: 'snippet,contentDetails',
      mine: true,
      maxResults: 50, // YouTube API Max per page
    });
    return response.result.items.map((item: GapiPlaylist) => ({
      id: item.id,
      title: item.snippet.title,
      itemCount: item.contentDetails?.itemCount,
    }));
  }

  public async createPlaylist(title: string): Promise<YouTubePlaylist> {
     if (!this.isAuthenticated() || !window.gapi.client.youtube) {
      throw new Error('User not authenticated or YouTube client not loaded.');
    }
    const response = await window.gapi.client.youtube.playlists.insert({
      part: 'snippet,status',
      resource: {
        snippet: {
          title: title,
          description: 'Created by Osu! Song Exporter',
        },
        status: {
          privacyStatus: 'private', // Or 'public', 'unlisted'
        },
      },
    });
    const playlist = response.result as GapiPlaylist;
    return { 
      id: playlist.id, 
      title: playlist.snippet.title,
      itemCount: 0 // New playlist
    };
  }

  public async searchSong(query: string): Promise<YouTubeVideo | null> {
    if (!window.gapi.client.youtube) { // Search can be unauthenticated if API key is set, or authenticated
        throw new Error('YouTube client not loaded.');
    }
    const response = await window.gapi.client.youtube.search.list({
      part: 'snippet',
      q: `${query} audio`, // Append audio to prioritize music
      type: 'video',
      maxResults: 1, // Get the top result
      videoCategoryId: '10', // Music category
    });
    
    if (response.result.items && response.result.items.length > 0) {
      const item = response.result.items[0] as GapiSearchResult;
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.default.url,
      };
    }
    return null;
  }

  public async addSongToPlaylist(playlistId: string, videoId: string): Promise<void> {
    if (!this.isAuthenticated() || !window.gapi.client.youtube) {
      throw new Error('User not authenticated or YouTube client not loaded.');
    }
    await window.gapi.client.youtube.playlistItems.insert({
      part: 'snippet',
      resource: {
        snippet: {
          playlistId: playlistId,
          resourceId: {
            kind: 'youtube#video',
            videoId: videoId,
          },
        },
      },
    });
  }
}

export const youtubeServiceInstance = new YouTubeService();


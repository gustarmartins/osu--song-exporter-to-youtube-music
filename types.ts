
export interface OsuSong {
  id: string; // Unique ID, e.g., original folder name
  originalName: string;
  cleanedName: string; // Name used for searching
  status: SongImportStatus;
  youtubeVideoId?: string;
  error?: string;
}

export type SongImportStatus = 'pending' | 'searching' | 'adding' | 'added' | 'failed';

export interface YouTubePlaylist {
  id: string;
  title: string;
  itemCount?: number;
}

export interface YouTubeUser {
  name: string | null;
  email: string | null;
  imageUrl: string | null;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle?: string;
  thumbnailUrl?: string;
}

// For gapi.client.youtube responses
export interface GapiPlaylistItem {
  id: string;
  snippet: {
    title: string;
    resourceId?: { // For existing playlist items
      videoId: string; 
    };
    videoOwnerChannelTitle?: string;
    thumbnails?: {
      default?: { url: string };
      medium?: { url: string };
    };
  };
  contentDetails?: {
    itemCount?: number; // For playlists list
    videoId?: string; // For playlist items search
  }
}

export interface GapiPlaylist {
  id: string;
  snippet: {
    title: string;
    description?: string;
    thumbnails?: {
        default?: { url: string };
    };
  };
  contentDetails?: {
    itemCount: number;
  };
}

export interface GapiSearchResult {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
}

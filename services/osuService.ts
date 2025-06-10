
import { OsuSong } from '../types';
import { OSU_FOLDER_NAME_CLEANUP_REGEX } from '../constants';

export const parseOsuFolderNames = (fileList: FileList): OsuSong[] => {
  const songFolderNames = new Set<string>();

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    // webkitRelativePath is like "SongFolderName/file.mp3" or "SongFolderName/image.jpg"
    // We need the first part, which is the song folder name.
    if (file.webkitRelativePath) {
      const pathParts = file.webkitRelativePath.split('/');
      if (pathParts.length > 0 && pathParts[0]) {
        songFolderNames.add(pathParts[0]);
      }
    }
  }

  return Array.from(songFolderNames).map(originalName => {
    let cleanedName = originalName;
    const match = originalName.match(OSU_FOLDER_NAME_CLEANUP_REGEX);
    if (match && match[1]) {
      cleanedName = match[1].trim();
    }
    // Further simple cleaning for common terms if regex is not enough
    cleanedName = cleanedName.replace(/(\s+)?(tv size|cut ver|short ver|full ver|game ver)\s*/i, '').trim();

    return {
      id: originalName, // Use original folder name as a unique ID
      originalName,
      cleanedName,
      status: 'pending',
    };
  });
};

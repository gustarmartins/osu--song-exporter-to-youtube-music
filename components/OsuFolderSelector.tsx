
import React from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface OsuFolderSelectorProps {
  onFoldersSelected: (files: FileList | null) => void;
  disabled?: boolean;
}

const OsuFolderSelector: React.FC<OsuFolderSelectorProps> = ({ onFoldersSelected, disabled }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFoldersSelected(event.target.files);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <label
        htmlFor="osuFolderInput"
        className={`
          w-full px-6 py-10 border-2 border-dashed border-slate-600 rounded-lg 
          text-center cursor-pointer hover:border-purple-500 transition-colors duration-200
          flex flex-col items-center justify-center group
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700'}
        `}
      >
        <UploadIcon className="w-12 h-12 text-slate-500 group-hover:text-purple-400 mb-3 transition-colors duration-200" />
        <span className="text-slate-300 group-hover:text-purple-300 font-semibold">
          Click to select your osu! "Songs" folder
        </span>
        <p className="text-xs text-slate-500 mt-1">Your browser will ask for permission to read the folder contents.</p>
        <input
          id="osuFolderInput"
          type="file"
          // @ts-ignore webkitdirectory is non-standard but widely supported for this use case
          webkitdirectory=""
          directory=""
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
      </label>
      <p className="text-xs text-slate-500">
        Navigate to your osu! installation directory and select the "Songs" subfolder.
        The application only reads folder names and does not upload any files.
      </p>
    </div>
  );
};

export default OsuFolderSelector;

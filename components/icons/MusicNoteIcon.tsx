
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const MusicNoteIcon: React.FC<IconProps> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor"
    {...props}
  >
    <path d="M10 3.515l5.54 2.827A जनरल.75.75 0 0116 7.04v5.006c0 .665-.404 1.26-.997 1.494l-5.003 2.001a1 1 0 01-.999 0l-5.003-2.001A1.5 1.5 0 013 12.046V7.04a.75.75 0 01.46-.698L9 3.515a1 1 0 011 0zM8.5 7.155V12.55a.5.5 0 00.832.372l3.068-2.23A.5.5 0 0012.5 10V8.22c0-.27-.261-.461-.501-.363L8.832 9.07a.5.5 0 01-.332-.415V7.155a.5.5 0 00-1 0v1.5a.5.5 0 00.168.372l3.068 2.23A.5.5 0 0111.5 11.5v.405l-3 1.5V7.155a.5.5 0 00-1 0v.001z" />
  </svg>
);

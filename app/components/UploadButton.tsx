"use client";
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface Props {
  isDarkMode: boolean;
}

export default function UploadButton({ isDarkMode }: Props) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        const imageUrl = e.target.result as string;
        // We'll handle the image processing in ImageProcessor component
        window.dispatchEvent(new CustomEvent('imageUploaded', { detail: { imageUrl } }));
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`relative group cursor-pointer`}
    >
      <input {...getInputProps()} />
      <button
        className={`
          px-6 py-2.5 rounded-xl text-sm font-medium
          transition-all duration-200 flex items-center gap-2
          ${isDarkMode
            ? 'bg-white text-black hover:bg-white/90'
            : 'bg-black text-white hover:bg-black/90'
          }
        `}
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        {isDragActive ? 'Drop image here...' : 'Upload Image'}
      </button>
      
      {/* Drag indicator */}
      {isDragActive && (
        <div className={`
          absolute inset-0 -m-2 rounded-2xl border-2 border-dashed
          animate-pulse pointer-events-none
          ${isDarkMode ? 'border-white/20' : 'border-black/20'}
        `} />
      )}
    </div>
  );
} 
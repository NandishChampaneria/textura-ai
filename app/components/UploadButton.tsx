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

    // Create a new FileReader
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      if (e.target?.result) {
        try {
          // Create a temporary image to get dimensions
          const img = new Image();
          img.src = e.target.result as string;
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });

          // Check if image is too large (optional, adjust limits as needed)
          if (img.width > 4096 || img.height > 4096) {
            // Resize the image before processing
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calculate new dimensions
            const scale = Math.min(4096 / img.width, 4096 / img.height);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            
            if (ctx) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              const resizedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
              window.dispatchEvent(new CustomEvent('imageUploaded', { detail: { imageUrl: resizedImageUrl } }));
            }
          } else {
            // Use original image if it's within size limits
            window.dispatchEvent(new CustomEvent('imageUploaded', { detail: { imageUrl: e.target.result } }));
          }
        } catch (error) {
          console.error('Error processing uploaded image:', error);
        }
      }
    };

    reader.onerror = () => {
      console.error('Error reading file');
    };

    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false,
    maxSize: 20 * 1024 * 1024 // 20MB limit
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
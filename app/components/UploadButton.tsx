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

    // Handle iOS image upload
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    try {
      // Create a new FileReader
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const target = e.target as FileReader | null;
        if (target?.result) {
          try {
            // Create a temporary image to get dimensions
            const img = new Image();
            
            // For iOS, we need to handle the image loading differently
            if (isIOS) {
              img.setAttribute('crossorigin', 'anonymous');
            }
            
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = (error) => {
                console.error('Error loading image:', error);
                reject(error);
              };
              
              // Set source after adding event listeners
              if (typeof target.result === 'string') {
                img.src = target.result;
              }
            });

            // Create a canvas to handle the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions based on image size
            let finalWidth = img.width;
            let finalHeight = img.height;
            
            // Resize if image is too large
            if (img.width > 4096 || img.height > 4096) {
              const scale = Math.min(4096 / img.width, 4096 / img.height);
              finalWidth = Math.floor(img.width * scale);
              finalHeight = Math.floor(img.height * scale);
            }
            
            canvas.width = finalWidth;
            canvas.height = finalHeight;
            
            if (ctx) {
              // Enable image smoothing for better quality
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              
              // Draw image to canvas
              ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
              
              // Convert to JPEG with high quality
              const processedImageUrl = canvas.toDataURL('image/jpeg', 0.95);
              
              // Dispatch event with processed image
              window.dispatchEvent(new CustomEvent('imageUploaded', {
                detail: { imageUrl: processedImageUrl }
              }));
            }
          } catch (error) {
            console.error('Error processing image:', error);
          }
        }
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };

      // Read file as data URL
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error handling file:', error);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.heic', '.heif']
    },
    multiple: false,
    maxSize: 20 * 1024 * 1024 // 20MB limit
  });

  return (
    <div 
      {...getRootProps()} 
      className={`relative group cursor-pointer`}
    >
      <input {...getInputProps()} capture="environment" />
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
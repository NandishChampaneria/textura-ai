"use client";
import { useCallback, useState, useRef, useEffect } from 'react';
import { removeBackground } from '@imgly/background-removal';
import UploadButton from './UploadButton';
import TexturaLogo from './TexturaLogo';
import Link from 'next/link';

interface TextStyle {
  color: string;
  opacity: number;
  xPosition: number;
  yPosition: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  rotation: number;
  letterSpacing: number;
}

interface TextLayer extends TextStyle {
  id: string;
  text: string;
}

interface ImageUploadEvent extends CustomEvent {
  detail: {
    imageUrl: string;
  };
}

export default function ImageProcessor() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [textLayers, setTextLayers] = useState<TextLayer[]>([{
    id: '1',
    text: 'Your Text Here',
    color: '#ffffff',
    opacity: 1,
    xPosition: 50,
    yPosition: 50,
    fontSize: 20,
    fontFamily: 'SF Pro Display',
    fontWeight: 400,
    rotation: 0,
    letterSpacing: 0
  }]);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('1');
  const [loading, setLoading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [processedImages, setProcessedImages] = useState<{
    original: HTMLImageElement | null;
    subject: HTMLImageElement | null;
    width: number;
    height: number;
  }>({ original: null, subject: null, width: 0, height: 0 });
  
  const [textStyle, setTextStyle] = useState<TextStyle>({
    color: '#ffffff',
    opacity: 1,
    xPosition: 50,
    yPosition: 50,
    fontSize: 20,
    fontFamily: 'SF Pro Display',
    fontWeight: 400,
    rotation: 0,
    letterSpacing: 0
  });

  // Font options
  const fontOptions = [
    { label: 'SF Pro Display', value: 'SF Pro Display' },
    { label: 'Inter', value: 'Inter' },
    { label: 'Helvetica', value: 'Helvetica Neue' },
    { label: 'Arial', value: 'Arial' },
    { label: 'System UI', value: 'system-ui' }
  ];

  const fontWeights = [
    { label: 'Thin', value: 100 },
    { label: 'Extra Light', value: 200 },
    { label: 'Light', value: 300 },
    { label: 'Regular', value: 400 },
    { label: 'Medium', value: 500 },
    { label: 'Semi Bold', value: 600 },
    { label: 'Bold', value: 700 },
    { label: 'Extra Bold', value: 800 },
    { label: 'Black', value: 900 }
  ];

  // Add this near the top with other constants
  const colorPresets = [
    '#FFFFFF', // White
    '#000000', // Black
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080', // Purple
    '#FFC0CB', // Pink
    '#00FF80', // Spring Green
  ];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Listen for image upload events
  useEffect(() => {
    const handleImageUpload = async (event: ImageUploadEvent) => {
      const { imageUrl } = event.detail;
      if (!imageUrl) return;
      
      setCurrentImageUrl(imageUrl);
      try {
        await processImage(imageUrl);
      } catch (error) {
        console.error('Error processing image:', error);
        setLoading(false);
      }
    };

    window.addEventListener('imageUploaded', handleImageUpload as unknown as EventListener);
    return () => {
      window.removeEventListener('imageUploaded', handleImageUpload as unknown as EventListener);
    };
  }, []);

  // Initial render and text updates
  useEffect(() => {
    if (processedImages.original && processedImages.subject) {
      updateCanvas();
    }
  }, [textLayers, processedImages]);

  // Update text layer
  const updateTextLayer = (id: string, updates: Partial<TextLayer>) => {
    setTextLayers(layers => 
      layers.map(layer => 
        layer.id === id ? { ...layer, ...updates } : layer
      )
    );
  };

  // Add new text layer
  const addTextLayer = () => {
    const newLayer: TextLayer = {
      id: Date.now().toString(),
      text: 'New Text Layer',
      color: '#ffffff',
      opacity: 1,
      xPosition: 50,
      yPosition: 50,
      fontSize: 20,
      fontFamily: 'SF Pro Display',
      fontWeight: 400,
      rotation: 0,
      letterSpacing: 0
    };
    setTextLayers(layers => [...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  // Remove text layer
  const removeTextLayer = (id: string) => {
    setTextLayers(layers => {
      const newLayers = layers.filter(layer => layer.id !== id);
      if (selectedLayerId === id && newLayers.length > 0) {
        setSelectedLayerId(newLayers[0].id);
      }
      return newLayers;
    });
  };

  // Modified updateCanvas function to handle multiple text layers
  const updateCanvas = () => {
    if (!canvasRef.current || !processedImages.original || !processedImages.subject) return;

    const { width, height } = processedImages;
    const canvas = canvasRef.current;
    
    // Adjust for device pixel ratio
    const dpr = Math.max(window.devicePixelRatio, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    const ctx = canvas.getContext('2d', {
      alpha: true,
      willReadFrequently: true,
      desynchronized: true
    });
    
    if (!ctx) return;

    // Scale context for retina displays
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear canvas and draw original image
    ctx.clearRect(0, 0, width, height);
    
    // Ensure images are loaded before drawing
    if (processedImages.original.complete) {
      ctx.drawImage(processedImages.original, 0, 0, width, height);
    }

    // Draw each text layer
    textLayers.forEach(layer => {
      if (!layer) return;  // Skip if layer is undefined
      
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const fontSize = Math.min(width, height) * (layer.fontSize / 100);
      ctx.font = `${layer.fontWeight} ${Math.ceil(fontSize)}px "${layer.fontFamily}", -apple-system, BlinkMacSystemFont, system-ui, Arial`;

      const xPos = (layer.xPosition / 100) * width;
      const yPos = (layer.yPosition / 100) * height;

      // Apply rotation
      ctx.translate(xPos, yPos);
      ctx.rotate((layer.rotation * Math.PI) / 180);
      ctx.translate(-xPos, -yPos);

      const opacity = Math.round(layer.opacity * 255).toString(16).padStart(2, '0');
      ctx.fillStyle = `${layer.color}${opacity}`;
      ctx.textRendering = 'geometricPrecision';
      ctx.fontKerning = 'normal';
      ctx.fontStretch = 'normal';
      ctx.fontVariantCaps = 'normal';
      ctx.letterSpacing = `${layer.letterSpacing}px`;
      
      ctx.fillText(layer.text, xPos, yPos);
      ctx.restore();
    });

    // Draw subject on top if it's loaded
    if (processedImages.subject.complete) {
      ctx.drawImage(processedImages.subject, 0, 0, width, height);
    }
  };

  const processImage = async (imageUrl: string) => {
    try {
      setLoading(true);

      // Create a new image and wait for it to load
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      // iOS Safari specific handling
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        img.setAttribute('crossorigin', 'anonymous');
      }
      
      // Wait for image to load before proceeding
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = (error) => {
          console.error('Error loading image:', error);
          reject(error);
        };
        img.src = imageUrl;
      });

      // Pre-process image through canvas to ensure proper format
      const preprocessCanvas = document.createElement('canvas');
      const preprocessCtx = preprocessCanvas.getContext('2d');
      preprocessCanvas.width = img.width;
      preprocessCanvas.height = img.height;
      
      if (preprocessCtx) {
        preprocessCtx.drawImage(img, 0, 0);
        const processedImageUrl = preprocessCanvas.toDataURL('image/jpeg', 0.95);
        
        // Load processed image
        const processedImg = new Image();
        processedImg.crossOrigin = "anonymous";
        
        await new Promise((resolve, reject) => {
          processedImg.onload = resolve;
          processedImg.onerror = reject;
          processedImg.src = processedImageUrl;
        });
        
        // Calculate dimensions to fit container
        const containerWidth = containerRef.current?.clientWidth ?? 800;
        const containerHeight = containerRef.current?.clientHeight ?? 600;
        const maxWidth = Math.min(containerWidth, 800);
        const maxHeight = Math.min(containerHeight, 600);
        
        let finalWidth = processedImg.width;
        let finalHeight = processedImg.height;
        
        // Scale down if image is larger than container
        if (finalWidth > maxWidth || finalHeight > maxHeight) {
          const widthRatio = maxWidth / finalWidth;
          const heightRatio = maxHeight / finalHeight;
          const scale = Math.min(widthRatio, heightRatio);
          
          finalWidth = Math.floor(finalWidth * scale);
          finalHeight = Math.floor(finalHeight * scale);
        }

        // Convert to blob for background removal
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        
        if (ctx) {
          ctx.drawImage(processedImg, 0, 0, finalWidth, finalHeight);
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.95);
          });

          // Get subject-only image
          const subjectBlob = await removeBackground(blob);
          const subjectUrl = URL.createObjectURL(subjectBlob);
          
          // Create and load the subject image
          const subjectImg = new Image();
          subjectImg.crossOrigin = "anonymous";
          
          await new Promise((resolve, reject) => {
            subjectImg.onload = resolve;
            subjectImg.onerror = reject;
            subjectImg.src = subjectUrl;
          });

          // Store processed images for reuse
          setProcessedImages({
            original: processedImg,
            subject: subjectImg,
            width: finalWidth,
            height: finalHeight
          });

          // Clean up
          URL.revokeObjectURL(subjectUrl);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error processing image:', error);
      setLoading(false);
      throw error;
    }
  };

  const exportImage = () => {
    if (!canvasRef.current) return;
    
    // Export at full resolution
    const link = document.createElement('a');
    link.download = 'processed-image.png';
    link.href = canvasRef.current.toDataURL('image/png', 1.0);
    link.click();
  };

  // Theme toggle function
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl ${
        isDarkMode ? 'bg-black/80' : 'bg-white/80'
      } border-b ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <TexturaLogo />
                <span className="text-lg font-semibold tracking-tight">Textura.ai</span>
              </Link>
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              <UploadButton isDarkMode={isDarkMode} />
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-white/10 hover:bg-white/20' 
                    : 'bg-black/5 hover:bg-black/10'
                }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Canvas Section */}
          <div className="lg:col-span-8 order-1 lg:order-1">
            <div className={`rounded-2xl p-6 h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)] ${
              isDarkMode 
                ? 'bg-zinc-900 ring-1 ring-white/10' 
                : 'bg-white ring-1 ring-black/5'
            } transition-all duration-300`}>
              <div className="w-full h-full" ref={containerRef}>
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className={`w-12 h-12 border-4 rounded-full animate-spin ${
                      isDarkMode ? 'border-white/10 border-t-white' : 'border-black/10 border-t-black'
                    }`}></div>
                    <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Processing image...
                    </p>
                  </div>
                ) : !processedImages.original ? (
                  <div className="flex flex-col items-center justify-center h-full pt-8 space-y-4">
                    <div className={`p-8 rounded-2xl border-2 border-dashed ${
                      isDarkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-600'
                    }`}>
                      <p className="text-center">Upload an image to begin</p>
                      <p className="text-sm mt-2 text-center">Supports PNG and JPEG</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-between">
                    <div className="w-full flex justify-center">
                      <canvas
                        ref={canvasRef}
                        className="max-w-full h-auto object-contain rounded-lg shadow-2xl"
                        style={{ maxHeight: 'calc(100vh - 14rem)' }}
                      />
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={exportImage}
                        className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 
                          flex items-center justify-center gap-2 ${
                          isDarkMode
                            ? 'bg-white text-black hover:bg-white/90'
                            : 'bg-black text-white hover:bg-black/90'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export Image
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="lg:col-span-4 order-2 lg:order-2">
            <div className={`rounded-2xl h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)] ${
              isDarkMode 
                ? 'bg-zinc-900 ring-1 ring-white/10' 
                : 'bg-white ring-1 ring-black/5'
            } transition-all duration-300`}>
              <div className="p-6 space-y-6 h-full overflow-y-auto">
                {/* Text Layers Management */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-bold ${
                      isDarkMode ? 'text-zinc-200' : 'text-zinc-700'
                    }`}>Text Layers</h3>
                    <button
                      onClick={addTextLayer}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        isDarkMode 
                          ? 'bg-white/10 hover:bg-white/20' 
                          : 'bg-black/5 hover:bg-black/10'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  {/* Layer List */}
                  <div className="space-y-2">
                    {textLayers.map(layer => (
                      <div
                        key={layer.id}
                        onClick={() => setSelectedLayerId(layer.id)}
                        className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedLayerId === layer.id
                            ? isDarkMode 
                              ? 'bg-white/20 ring-2 ring-white/30' 
                              : 'bg-black/10 ring-2 ring-black/20'
                            : isDarkMode
                              ? 'bg-black/20 hover:bg-white/10'
                              : 'bg-black/5 hover:bg-black/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm truncate">{layer.text}</span>
                          {textLayers.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeTextLayer(layer.id);
                              }}
                              className={`p-1 rounded-lg transition-all duration-200 ${
                                isDarkMode 
                                  ? 'hover:bg-white/20' 
                                  : 'hover:bg-black/10'
                              }`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Layer Settings */}
                {selectedLayerId && textLayers.find(l => l.id === selectedLayerId) && (
                  <div className="space-y-6">
            {/* Text Input */}
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${
                        isDarkMode ? 'text-zinc-200' : 'text-zinc-700'
                      }`}>Text</label>
              <input
                type="text"
                        value={textLayers.find(l => l.id === selectedLayerId)?.text ?? ''}
                        onChange={(e) => updateTextLayer(selectedLayerId, { text: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl transition-all duration-200 ${
                          isDarkMode 
                            ? 'bg-black/20 border border-white/10 text-white placeholder-zinc-500 focus:ring-2 focus:ring-white/20' 
                            : 'bg-zinc-50 border border-zinc-200 text-black placeholder-zinc-400 focus:ring-2 focus:ring-black/5'
                        }`}
                placeholder="Enter text..."
              />
            </div>

              {/* Font Family */}
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${
                        isDarkMode ? 'text-zinc-200' : 'text-zinc-700'
                      }`}>Font Family</label>
                <select
                        value={textLayers.find(l => l.id === selectedLayerId)?.fontFamily ?? 'SF Pro Display'}
                        onChange={(e) => updateTextLayer(selectedLayerId, { fontFamily: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl transition-all duration-200 ${
                          isDarkMode 
                            ? 'bg-black/20 border border-white/10 text-white' 
                            : 'bg-zinc-50 border border-zinc-200 text-black'
                        }`}
                >
                  {fontOptions.map(font => (
                          <option key={font.value} value={font.value} className={
                            isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-black'
                          }>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Weight */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className={`text-sm font-medium ${
                          isDarkMode ? 'text-zinc-200' : 'text-zinc-700'
                        }`}>Weight</label>
                        <span className={`text-xs px-2 py-1 rounded-md ${
                          isDarkMode ? 'bg-black/20 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          {textLayers.find(l => l.id === selectedLayerId)?.fontWeight ?? 400}
                        </span>
                </div>
                      <input
                        type="range"
                        min="100"
                        max="900"
                        step="100"
                        value={textLayers.find(l => l.id === selectedLayerId)?.fontWeight ?? 400}
                        onChange={(e) => updateTextLayer(selectedLayerId, { fontWeight: parseInt(e.target.value) })}
                        className={`w-full h-2 rounded-full appearance-none cursor-pointer ${
                          isDarkMode 
                            ? 'bg-black/20 accent-white' 
                            : 'bg-zinc-200 accent-black'
                        }`}
                      />
              </div>

              {/* Color */}
                    <div className="space-y-2">
                <div className="flex items-center justify-between">
                        <label className={`text-sm font-medium ${
                          isDarkMode ? 'text-zinc-200' : 'text-zinc-700'
                        }`}>Color</label>
                        <span className={`text-xs px-2 py-1 rounded-md font-mono ${
                          isDarkMode ? 'bg-black/20 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          {textLayers.find(l => l.id === selectedLayerId)?.color.toUpperCase() ?? '#FFFFFF'}
                  </span>
                </div>
                      <div className={`relative group p-4 rounded-xl ${
                        isDarkMode ? 'bg-black/20' : 'bg-zinc-50'
                      }`}>
                  <input
                    type="color"
                          value={textLayers.find(l => l.id === selectedLayerId)?.color ?? '#FFFFFF'}
                          onChange={(e) => updateTextLayer(selectedLayerId, { color: e.target.value })}
                          className="w-full h-12 rounded-lg cursor-pointer appearance-none
                            [&::-webkit-color-swatch-wrapper]:p-1
                            [&::-webkit-color-swatch]:rounded-md
                            [&::-moz-color-swatch]:rounded-md"
                  />
                </div>
              </div>

              {/* Opacity */}
                    <div className="space-y-2">
                <div className="flex items-center justify-between">
                        <label className={`text-sm font-medium ${
                          isDarkMode ? 'text-zinc-200' : 'text-zinc-700'
                        }`}>Opacity</label>
                        <span className={`text-xs px-2 py-1 rounded-md ${
                          isDarkMode ? 'bg-black/20 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          {Math.round((textLayers.find(l => l.id === selectedLayerId)?.opacity ?? 1) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                        value={textLayers.find(l => l.id === selectedLayerId)?.opacity ?? 1}
                        onChange={(e) => updateTextLayer(selectedLayerId, { opacity: parseFloat(e.target.value) })}
                        className={`w-full h-2 rounded-full appearance-none cursor-pointer ${
                          isDarkMode 
                            ? 'bg-black/20 accent-white' 
                            : 'bg-zinc-200 accent-black'
                        }`}
                />
              </div>

                    {/* Size */}
                    <div className="space-y-2">
                <div className="flex items-center justify-between">
                        <label className={`text-sm font-medium ${
                          isDarkMode ? 'text-zinc-200' : 'text-zinc-700'
                        }`}>Size</label>
                        <span className={`text-xs px-2 py-1 rounded-md ${
                          isDarkMode ? 'bg-black/20 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          {textLayers.find(l => l.id === selectedLayerId)?.fontSize ?? 20}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                        value={textLayers.find(l => l.id === selectedLayerId)?.fontSize ?? 20}
                        onChange={(e) => updateTextLayer(selectedLayerId, { fontSize: parseInt(e.target.value) })}
                        className={`w-full h-2 rounded-full appearance-none cursor-pointer ${
                          isDarkMode 
                            ? 'bg-black/20 accent-white' 
                            : 'bg-zinc-200 accent-black'
                        }`}
                />
              </div>

              {/* Position */}
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${
                        isDarkMode ? 'text-zinc-200' : 'text-zinc-700'
                      }`}>Position</label>
                <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                    <div className="flex items-center justify-between">
                            <span className={`text-xs ${
                              isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                            }`}>X-axis</span>
                            <span className={`text-xs px-2 py-1 rounded-md ${
                              isDarkMode ? 'bg-black/20 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                            }`}>
                              {textLayers.find(l => l.id === selectedLayerId)?.xPosition ?? 50}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                            value={textLayers.find(l => l.id === selectedLayerId)?.xPosition ?? 50}
                            onChange={(e) => updateTextLayer(selectedLayerId, { xPosition: parseInt(e.target.value) })}
                            className={`w-full h-2 rounded-full appearance-none cursor-pointer ${
                              isDarkMode 
                                ? 'bg-black/20 accent-white' 
                                : 'bg-zinc-200 accent-black'
                            }`}
                    />
                  </div>
                        <div className="space-y-2">
                    <div className="flex items-center justify-between">
                            <span className={`text-xs ${
                              isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                            }`}>Y-axis</span>
                            <span className={`text-xs px-2 py-1 rounded-md ${
                              isDarkMode ? 'bg-black/20 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                            }`}>
                              {textLayers.find(l => l.id === selectedLayerId)?.yPosition ?? 50}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                            value={textLayers.find(l => l.id === selectedLayerId)?.yPosition ?? 50}
                            onChange={(e) => updateTextLayer(selectedLayerId, { yPosition: parseInt(e.target.value) })}
                            className={`w-full h-2 rounded-full appearance-none cursor-pointer ${
                              isDarkMode 
                                ? 'bg-black/20 accent-white' 
                                : 'bg-zinc-200 accent-black'
                            }`}
                          />
                </div>
              </div>
            </div>

                    {/* Rotation */}
                <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className={`text-sm font-medium ${
                          isDarkMode ? 'text-zinc-200' : 'text-zinc-700'
                        }`}>Rotation</label>
                        <span className={`text-xs px-2 py-1 rounded-md ${
                          isDarkMode ? 'bg-black/20 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          {textLayers.find(l => l.id === selectedLayerId)?.rotation ?? 0}°
                        </span>
                  </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={textLayers.find(l => l.id === selectedLayerId)?.rotation ?? 0}
                        onChange={(e) => updateTextLayer(selectedLayerId, { rotation: parseInt(e.target.value) })}
                        className={`w-full h-2 rounded-full appearance-none cursor-pointer ${
                          isDarkMode 
                            ? 'bg-black/20 accent-white' 
                            : 'bg-zinc-200 accent-black'
                        }`}
                      />
            </div>

                    {/* Letter Spacing */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className={`text-sm font-medium ${
                          isDarkMode ? 'text-zinc-200' : 'text-zinc-700'
                        }`}>Letter Spacing</label>
                        <span className={`text-xs px-2 py-1 rounded-md ${
                          isDarkMode ? 'bg-black/20 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          {textLayers.find(l => l.id === selectedLayerId)?.letterSpacing ?? 0}px
                        </span>
          </div>
                      <input
                        type="range"
                        min="-5"
                        max="20"
                        value={textLayers.find(l => l.id === selectedLayerId)?.letterSpacing ?? 0}
                        onChange={(e) => updateTextLayer(selectedLayerId, { letterSpacing: parseInt(e.target.value) })}
                        className={`w-full h-2 rounded-full appearance-none cursor-pointer ${
                          isDarkMode 
                            ? 'bg-black/20 accent-white' 
                            : 'bg-zinc-200 accent-black'
                        }`}
                      />
                    </div>
                  </div>
                )}
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
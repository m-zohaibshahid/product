'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Rotate3d, Maximize2, ZoomIn, Info, Loader2 } from 'lucide-react';

interface Product360ViewerProps {
  images: string[];
  className?: string;
}

export default function Product360Viewer({ images, className = "" }: Product360ViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const totalFrames = images.length;
  const isFullyLoaded = imagesLoaded === totalFrames;

  // Handle Image Loading
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => setImagesLoaded(prev => prev + 1);
    });
  }, [images]);

  const handleStart = (clientX: number) => {
    if (!isFullyLoaded) return;
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || !isFullyLoaded) return;
    
    const deltaX = clientX - startX;
    const sensitivity = 5; // pixels per frame change
    
    if (Math.abs(deltaX) > sensitivity) {
      const framesToMove = Math.floor(deltaX / sensitivity);
      let nextIndex = currentIndex - framesToMove;
      
      // Infinite loop logic
      while (nextIndex < 0) nextIndex += totalFrames;
      while (nextIndex >= totalFrames) nextIndex -= totalFrames;
      
      if (nextIndex !== currentIndex) {
        setCurrentIndex(nextIndex);
        setStartX(clientX);
      }
    }
  }, [isDragging, isFullyLoaded, startX, currentIndex, totalFrames]);

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Mouse Events
  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onMouseUp = handleEnd;
  const onMouseLeave = handleEnd;

  // Touch Events
  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
  const onTouchEnd = handleEnd;

  // Rotation Progress Percentage
  const rotationDegrees = Math.round((currentIndex / totalFrames) * 360);

  return (
    <div 
      className={`relative group select-none cursor-grab active:cursor-grabbing overflow-hidden rounded-[32px] bg-zinc-900/40 border border-white/10 ${className}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      ref={containerRef}
    >
      {!isFullyLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-900/90 backdrop-blur-sm">
          <div className="relative w-24 h-24 flex items-center justify-center">
             <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
             <div 
                className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"
                style={{ clipPath: `conic-gradient(transparent 0%, transparent ${100 - (imagesLoaded/totalFrames)*100}%, white ${100 - (imagesLoaded/totalFrames)*100}%)` }}
             ></div>
             <Loader2 className="w-8 h-8 text-blue-500 animate-pulse" />
          </div>
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-white">
            Calibrating Vision {Math.round((imagesLoaded / totalFrames) * 100)}%
          </p>
        </div>
      )}

      {/* Main Vision Display */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {images.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Frame ${index}`}
            className={`absolute max-w-full max-h-full object-contain transition-opacity duration-75 pointer-events-none ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* HUD Elements */}
        <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Vision Node: Standardized</span>
              </div>
              <p className="text-2xl font-black text-white tracking-tighter italic-elegant">360° HYBRID SCAN</p>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <Rotate3d className="w-5 h-5 text-blue-400" />
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[8px] font-black uppercase">Frame {currentIndex + 1}</div>
                <div className="px-3 py-1 bg-white/10 text-white/60 rounded-lg text-[8px] font-black uppercase">{rotationDegrees}° Azimuth</div>
              </div>
              <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300" 
                  style={{ width: `${((currentIndex + 1) / totalFrames) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex gap-2">
               <button className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center transition-all pointer-events-auto"><ZoomIn className="w-4 h-4 text-white" /></button>
               <button className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center transition-all pointer-events-auto"><Maximize2 className="w-4 h-4 text-white" /></button>
            </div>
          </div>
        </div>

        {/* Visual Calibration Grid Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
           <div className="w-full h-full border-[0.5px] border-white/20 grid grid-cols-6 grid-rows-6">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-white/20"></div>
              ))}
           </div>
        </div>
      </div>
      
      {/* Interaction Hint */}
      <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-[120%] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 pointer-events-none">
         <div className="px-6 py-2 bg-blue-600 text-white rounded-full flex items-center gap-2 text-[9px] font-black uppercase tracking-widest shadow-2xl">
            <div className="flex gap-1">
               <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
               <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
               <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
            </div>
            Drag to Rotate
         </div>
      </div>
    </div>
  );
}

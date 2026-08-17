"use client";

import { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

interface BeforeAfterSliderProps {
  originalImage: string;
  tactileImage: string;
}

export default function BeforeAfterSlider({ originalImage, tactileImage }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  };

  const onPointerDown = () => (isDragging.current = true);
  const onPointerUp = () => (isDragging.current = false);
  const onPointerMove = (e: React.PointerEvent) => handleMove(e.clientX);

  useEffect(() => {
    const handleGlobalUp = () => { isDragging.current = false; };
    const handleGlobalMove = (e: MouseEvent) => {
      if (isDragging.current) handleMove(e.clientX);
    };
    
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('mousemove', handleGlobalMove);
    return () => {
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('mousemove', handleGlobalMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/3] bg-zinc-900 rounded-xl overflow-hidden select-none touch-none border border-zinc-800 cursor-ew-resize"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
    >
      {/* Base Layer (Tactile Result) */}
      <img 
        src={tactileImage} 
        alt="Tactile result" 
        className="absolute inset-0 w-full h-full object-contain bg-[#0a0a0a]" 
        draggable={false}
      />
      
      {/* Top Layer (Original Image) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img 
          src={originalImage} 
          alt="Original diagram" 
          className="absolute inset-0 w-full h-full object-contain max-w-none bg-zinc-900" 
          style={{ width: '100cqw' }}
          draggable={false}
        />
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-cyan-400 z-10 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.5)]"
        style={{ left: `calc(${position}% - 2px)` }}
      >
        <div className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-xl pointer-events-none">
          <GripVertical className="w-4 h-4" />
        </div>
      </div>
      
      <div className="absolute top-4 left-4 bg-zinc-900/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-zinc-300 border border-zinc-700 pointer-events-none">
        Original
      </div>
      <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-zinc-300 border border-zinc-700 pointer-events-none">
        Tactile View
      </div>
    </div>
  );
}

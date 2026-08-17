"use client";

import { useTactileCanvas } from '@/hooks/useTactileCanvas';
import { useTactileAudio } from '@/hooks/useTactileAudio';
import { ProcessingResult } from '@/types/diagram';
import { Volume2, VolumeX, Hand, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

interface TactileCanvasProps {
  result: ProcessingResult;
}

export default function TactileCanvas({ result }: TactileCanvasProps) {
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  
  const {
    containerRef,
    zoom,
    setZoom,
    panOffset,
    cursorPosition,
    nearestDistance,
    hoveredRegion,
    hoveredLabel,
    handlers
  } = useTactileCanvas({
    svgContent: result.tactile_svg,
    regions: result.semantic_regions,
    labels: result.extracted_labels
  });

  const { isAudioEnabled, toggleAudio } = useTactileAudio(
    nearestDistance,
    hoveredRegion,
    hoveredLabel,
    hapticsEnabled
  );

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm z-20">
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleAudio}
            className={`p-2 rounded-lg transition-colors ${isAudioEnabled ? 'bg-cyan-950 text-cyan-400' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
            title="Toggle Audio Proximity"
          >
            {isAudioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setHapticsEnabled(!hapticsEnabled)}
            className={`p-2 rounded-lg transition-colors ${hapticsEnabled ? 'bg-purple-950 text-purple-400' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
            title="Toggle Haptics"
          >
            <Hand className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
          <button onClick={() => setZoom(z => Math.max(0.1, z - 0.2))} className="p-1 text-zinc-400 hover:text-zinc-100"><Minus className="w-4 h-4" /></button>
          <span className="text-xs font-medium w-12 text-center text-zinc-300">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(5, z + 0.2))} className="p-1 text-zinc-400 hover:text-zinc-100"><Plus className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-[#0a0a0a] cursor-crosshair touch-none"
        {...handlers}
      >
        <div 
          className="absolute origin-top-left transition-transform duration-75"
          style={{ 
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            width: result.metadata.original_width,
            height: result.metadata.original_height
          }}
        >
          {/* Base SVG with tactile elevation effect */}
          <div 
            className="w-full h-full tactile-elevation"
            dangerouslySetInnerHTML={{ __html: result.tactile_svg }} 
          />

          {/* Overlays for semantic regions (visual feedback) */}
          {result.semantic_regions.map(r => (
            <div 
              key={r.id}
              className={`absolute border transition-colors duration-200 pointer-events-none rounded-sm ${hoveredRegion === r.id ? 'bg-cyan-400/10 border-cyan-400/50' : 'border-transparent'}`}
              style={{
                left: r.bounds.x,
                top: r.bounds.y,
                width: r.bounds.width,
                height: r.bounds.height
              }}
            />
          ))}

          {/* Overlays for labels (visual feedback) */}
          {result.extracted_labels.map(l => (
            <div 
              key={l.id}
              className={`absolute transition-colors duration-200 pointer-events-none rounded px-1 py-0.5 whitespace-nowrap text-[10px] font-medium font-sans
                ${hoveredLabel === l.id ? 'bg-cyan-400 text-cyan-950 scale-110 z-10' : 'bg-transparent text-transparent'}
              `}
              style={{
                left: l.x,
                top: l.y,
                transform: 'translate(-50%, -100%)',
              }}
            >
              {l.text}
            </div>
          ))}
        </div>

        {/* Custom Proximity Cursor */}
        {cursorPosition && (
          <div 
            className="absolute pointer-events-none z-50 mix-blend-difference"
            style={{
              left: panOffset.x + cursorPosition.x * zoom,
              top: panOffset.y + cursorPosition.y * zoom,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full" />
            <div 
              className="absolute top-1/2 left-1/2 rounded-full border border-white opacity-50 transition-all duration-75 ease-out"
              style={{
                transform: 'translate(-50%, -50%)',
                width: Math.min(100, nearestDistance * 2),
                height: Math.min(100, nearestDistance * 2)
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

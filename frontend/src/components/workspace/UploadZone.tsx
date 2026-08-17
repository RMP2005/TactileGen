"use client";

import { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SAMPLE_DIAGRAMS, SampleDiagram } from '@/lib/samples';

interface UploadZoneProps {
  onUpload: (file: File) => void;
}

export default function UploadZone({ onUpload }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = (file: File) => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image (JPEG, PNG, WEBP).");
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return;
    }

    onUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = async (sample: SampleDiagram) => {
    try {
      setIsLoadingSample(true);
      setError(null);
      const response = await fetch(sample.imagePath);
      const blob = await response.blob();
      const file = new File([blob], `${sample.id}.png`, { type: 'image/png' });
      validateAndProcessFile(file);
    } catch (err) {
      setError("Failed to load sample diagram. Please try uploading a file.");
    } finally {
      setIsLoadingSample(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Upload Box */}
      <div 
        className={`relative w-full aspect-[16/10] rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 text-center cursor-pointer overflow-hidden group
          ${isDragging 
            ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_30px_rgba(34,211,238,0.15)]' 
            : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-zinc-700 shadow-xl'
          }
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              validateAndProcessFile(e.target.files[0]);
            }
          }}
        />
        
        <div className="p-4 rounded-2xl bg-zinc-800/60 text-zinc-400 mb-4 group-hover:scale-110 group-hover:text-cyan-400 group-hover:bg-cyan-950/40 transition-all duration-200 border border-zinc-700/50">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-medium text-zinc-100 mb-1">Drop textbook diagram</h3>
        <p className="text-sm text-zinc-400 max-w-[280px] mb-4">Drag and drop any science, math, or engineering diagram</p>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700 text-xs text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Browse local file</span>
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5"/> JPG, PNG, WEBP</span>
          <span>Max 10MB</span>
        </div>
      </div>

      {/* Preset Sample Diagrams */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Or test with curated diagrams</span>
          </div>
          <span className="text-xs text-zinc-500">Instant evaluation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_DIAGRAMS.map((sample) => (
            <button
              key={sample.id}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectSample(sample);
              }}
              disabled={isLoadingSample}
              className="flex flex-col text-left p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl hover:border-cyan-500/50 hover:bg-zinc-900 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-medium text-cyan-400/90">{sample.category}</span>
                <BookOpen className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white mb-1">{sample.name}</h4>
              <p className="text-xs text-zinc-500 line-clamp-2">{sample.description}</p>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-950/40 border border-red-900/50 text-red-300 text-sm rounded-xl text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

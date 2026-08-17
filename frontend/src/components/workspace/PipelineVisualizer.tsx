"use client";

import { motion } from 'framer-motion';
import { PipelineStage } from '@/types/diagram';
import { Image as ImageIcon, BrainCircuit, Layers, Scissors, Fingerprint, CheckCircle2, Circle } from 'lucide-react';

interface PipelineVisualizerProps {
  stage: PipelineStage;
}

const stages = [
  { id: 'uploading', label: 'IMAGE', icon: ImageIcon },
  { id: 'understanding', label: 'UNDERSTAND', icon: BrainCircuit },
  { id: 'segmenting', label: 'SEGMENT', icon: Layers },
  { id: 'simplifying', label: 'SIMPLIFY', icon: Scissors },
  { id: 'tactile', label: 'TACTILE', icon: Fingerprint },
];

export default function PipelineVisualizer({ stage }: PipelineVisualizerProps) {
  const currentIndex = stages.findIndex(s => s.id === stage);
  const isComplete = stage === 'complete';
  const isError = stage === 'error';

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-center items-center py-12">
      <div className="flex flex-col gap-8 w-full max-w-[200px] relative">
        {/* Connecting line */}
        <div className="absolute top-4 bottom-4 left-6 w-[2px] bg-zinc-800 -z-10" />
        
        {stages.map((s, idx) => {
          const isActive = !isComplete && !isError && (currentIndex === idx || (stage === 'uploading' && idx === 0));
          const isDone = isComplete || (currentIndex > idx);
          const Icon = s.icon;
          
          return (
            <div key={s.id} className="flex items-center gap-4 group">
              <div className="relative">
                {isDone ? (
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 bg-zinc-900 rounded-full" />
                ) : isActive ? (
                  <div className="relative flex items-center justify-center w-12 h-12">
                    <motion.div 
                      className="absolute inset-0 rounded-full border-2 border-cyan-400 opacity-50"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center z-10">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                    <Circle className="w-5 h-5 text-zinc-600" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col">
                <span className={`text-sm font-semibold tracking-wider ${isActive ? 'text-cyan-400' : isDone ? 'text-zinc-200' : 'text-zinc-600'}`}>
                  {s.label}
                </span>
                {isActive && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-zinc-400"
                  >
                    Processing...
                  </motion.span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { ExtractedLabel } from '@/types/diagram';
import { Type } from 'lucide-react';

interface LabelInspectorProps {
  labels: ExtractedLabel[];
}

export default function LabelInspector({ labels }: LabelInspectorProps) {
  if (labels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
        <Type className="w-8 h-8 text-zinc-600 mb-3" />
        <p className="text-sm text-zinc-400">No text labels detected in this diagram.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Detected Labels ({labels.length})</h3>
      </div>
      
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
        {labels.map((label) => (
          <div 
            key={label.id}
            className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center text-xs font-mono text-zinc-400">
                T
              </div>
              <span className="font-medium text-zinc-200">{label.text}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${label.confidence > 0.8 ? 'bg-emerald-950/50 text-emerald-400' : 'bg-amber-950/50 text-amber-400'}`}>
                {Math.round(label.confidence * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

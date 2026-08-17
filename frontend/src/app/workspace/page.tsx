"use client";

import { useDiagramPipeline } from '@/hooks/useDiagramPipeline';
import { motion, AnimatePresence } from 'framer-motion';
import UploadZone from '@/components/workspace/UploadZone';
import PipelineVisualizer from '@/components/workspace/PipelineVisualizer';
import TactileCanvas from '@/components/workspace/TactileCanvas';
import BeforeAfterSlider from '@/components/workspace/BeforeAfterSlider';
import ExportPanel from '@/components/workspace/ExportPanel';
import LabelInspector from '@/components/workspace/LabelInspector';
import { slideInLeft, slideInRight, scaleIn } from '@/lib/motion';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { useState } from 'react';

export default function WorkspacePage() {
  const { stage, result, error, progress, processImage, reset } = useDiagramPipeline();
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  
  const handleUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setOriginalImageUrl(url);
    processImage(file);
  };

  const handleReset = () => {
    if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
    setOriginalImageUrl(null);
    reset();
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-zinc-950">
      {/* Workspace Header */}
      <div className="h-14 border-b border-zinc-800 bg-zinc-950 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          {stage !== 'idle' && (
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              New Diagram
            </button>
          )}
          <h1 className="font-medium text-zinc-200">Workspace</h1>
        </div>
        
        {stage !== 'idle' && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500">Status:</span>
            <span className={`text-sm font-medium px-2 py-1 rounded-md ${
              stage === 'complete' ? 'bg-emerald-950/50 text-emerald-400' : 
              stage === 'error' ? 'bg-red-950/50 text-red-400' : 'bg-cyan-950/50 text-cyan-400'
            }`}>
              {stage === 'complete' ? 'Processing Complete' : 
               stage === 'error' ? 'Error' : 'Processing...'}
            </span>
          </div>
        )}
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
        <AnimatePresence mode="wait">
          
          {/* STATE 1: Idle (Upload) */}
          {stage === 'idle' && (
            <motion.div 
              key="upload"
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto mt-20"
            >
              <UploadZone onUpload={handleUpload} />
            </motion.div>
          )}

          {/* STATE 2: Processing Pipeline */}
          {stage !== 'idle' && stage !== 'complete' && stage !== 'error' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto mt-10 space-y-12"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-light tracking-tight text-zinc-100">Analyzing your diagram...</h2>
                <p className="text-zinc-400">Our computer vision model is extracting semantics.</p>
              </div>
              
              <PipelineVisualizer stage={stage} />
              
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          )}

          {/* STATE 3: Complete (Results) */}
          {stage === 'complete' && result && originalImageUrl && (
            <motion.div
              key="results"
              className="h-full flex flex-col md:flex-row gap-6 max-w-7xl mx-auto"
            >
              {/* Left Column: Original & Comparison */}
              <motion.div 
                variants={slideInLeft}
                initial="hidden"
                animate="visible"
                className="w-full md:w-1/3 flex flex-col gap-6 shrink-0"
              >
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Comparison</h3>
                  <BeforeAfterSlider 
                    originalImage={originalImageUrl} 
                    tactileImage={`data:image/svg+xml;utf8,${encodeURIComponent(result.tactile_svg)}`} 
                  />
                </div>
                
                <LabelInspector labels={result.extracted_labels} />
                <ExportPanel result={result} />
              </motion.div>

              {/* Right Column: Interactive Canvas */}
              <motion.div 
                variants={slideInRight}
                initial="hidden"
                animate="visible"
                className="flex-1 min-h-[500px]"
              >
                <TactileCanvas result={result} />
              </motion.div>
            </motion.div>
          )}
          
          {/* STATE 4: Error */}
          {stage === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto mt-20 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-red-950 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCcw className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-medium text-zinc-100">Processing Failed</h2>
              <p className="text-zinc-400">{error}</p>
              <button 
                onClick={handleReset}
                className="px-6 py-3 bg-zinc-800 text-zinc-200 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>
    </div>
  );
}

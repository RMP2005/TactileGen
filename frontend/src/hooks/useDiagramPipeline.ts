import { useState, useCallback } from 'react';
import { PipelineStage, ProcessingResult } from '@/types/diagram';

export function useDiagramPipeline() {
  const [stage, setStage] = useState<PipelineStage>('idle');
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const processImage = useCallback(async (file: File) => {
    try {
      setStage('uploading');
      setProgress(10);
      
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate stages for visual effect (backend might be faster, but we want cinematic pipeline)
      const stages: PipelineStage[] = ['understanding', 'segmenting', 'simplifying', 'tactile'];
      
      let currentStageIdx = 0;
      const stageInterval = setInterval(() => {
        if (currentStageIdx < stages.length) {
          setStage(stages[currentStageIdx]);
          setProgress(20 + (currentStageIdx * 20));
          currentStageIdx++;
        }
      }, 800);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/v1/process`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server responded with error ${response.status}`);
      }

      const data: ProcessingResult = await response.json();
      
      clearInterval(stageInterval);
      setStage('complete');
      setProgress(100);
      setResult(data);
      
    } catch (err: any) {
      setStage('error');
      setError(err.message || 'An error occurred during processing.');
    }
  }, []);

  const reset = useCallback(() => {
    setStage('idle');
    setResult(null);
    setError(null);
    setProgress(0);
  }, []);

  return {
    stage,
    result,
    error,
    progress,
    processImage,
    reset
  };
}

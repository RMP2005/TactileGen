import { useState, useCallback, useRef } from "react";
import { PipelineStage, ProcessingResult } from "@/types/diagram";


export function useDiagramPipeline() {

  const [stage, setStage] = useState<PipelineStage>("idle");

  const [result, setResult] = useState<ProcessingResult | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);


  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);


  const processImage = useCallback(async (file: File) => {

    try {

      setError(null);
      setResult(null);
      clearTimers();


      setStage("uploading");
      setProgress(10);


      const formData = new FormData();
      formData.append("file", file);


      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


      let backendResult: ProcessingResult;


      // Visual pipeline — advance stages while backend works
      timersRef.current.push(
        setTimeout(() => { setStage("understanding"); setProgress(25); }, 500),
      );
      timersRef.current.push(
        setTimeout(() => { setStage("segmenting"); setProgress(45); }, 3000),
      );
      timersRef.current.push(
        setTimeout(() => { setStage("simplifying"); setProgress(65); }, 7000),
      );


      const response = await fetch(
        `${apiUrl}/api/v1/process`,
        {
          method: "POST",
          body: formData,
        }
      );


      clearTimers();


      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(
          `Processing failed (${response.status})${detail ? ": " + detail : ""}`
        );
      }


      backendResult = await response.json();


      setStage("tactile");
      setProgress(90);

      await new Promise(resolve => setTimeout(resolve, 800));


      setResult(backendResult);
      setStage("complete");
      setProgress(100);


    }
    catch (err: any) {

      clearTimers();
      setStage("error");
      setProgress(0);
      setError(
        err.message ||
        "Processing failed"
      );

    }


  }, [clearTimers]);




  const reset = useCallback(() => {

    clearTimers();
    setStage("idle");
    setResult(null);
    setError(null);
    setProgress(0);

  }, [clearTimers]);






  return {

    stage,

    result,

    error,

    progress,

    processImage,

    reset

  };

}
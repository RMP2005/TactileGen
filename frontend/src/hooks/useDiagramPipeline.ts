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


      console.log("[pipeline] fetch starting →", `${apiUrl}/api/v1/process`);
      const t0 = performance.now();

      const response = await fetch(
        `${apiUrl}/api/v1/process`,
        {
          method: "POST",
          body: formData,
        }
      );

      // Cancel visual timers and jump progress past the fake stages
      clearTimers();
      console.log("[pipeline] response received, status:", response.status,
        `(${((performance.now() - t0) / 1000).toFixed(1)}s)`);


      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(
          `Processing failed (${response.status})${detail ? ": " + detail : ""}`
        );
      }


      // Advance to tactile BEFORE the slow JSON parse so the UI
      // doesn't freeze at 65 % while the browser parses megabytes
      // of base64 inside ProcessResponse.processed_image_base64.
      setStage("tactile");
      setProgress(90);

      console.log("[pipeline] parsing response.json()…");
      const t1 = performance.now();
      const backendResult: ProcessingResult = await response.json();
      console.log("[pipeline] response.json() done",
        `(${((performance.now() - t1) / 1000).toFixed(1)}s)`);


      setResult(backendResult);
      setStage("complete");
      setProgress(100);
      console.log("[pipeline] result set, stage → complete");


    }
    catch (err: any) {

      clearTimers();
      console.error("[pipeline] error:", err);
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

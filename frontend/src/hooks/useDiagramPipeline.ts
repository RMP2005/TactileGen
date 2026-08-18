import { useState, useCallback, useRef } from "react";
import { PipelineStage, ProcessingResult } from "@/types/diagram";


export function useDiagramPipeline() {

  const [stage, setStage] = useState<PipelineStage>("idle");

  const [result, setResult] = useState<ProcessingResult | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);

  const rafRef = useRef<number | null>(null);


  const cancelRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);


  const processImage = useCallback(async (file: File) => {

    try {

      setError(null);
      setResult(null);
      cancelRaf();


      setStage("uploading");
      setProgress(0);


      const formData = new FormData();
      formData.append("file", file);


      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


      // Smooth progress animation during fetch
      let elapsed = 0;
      const tick = () => {
        elapsed += 100;
        // Logarithmic progress: fast start, slow end, caps at ~85%
        const p = Math.min(85, 85 * (1 - Math.exp(-elapsed / 8000)));
        setProgress(Math.round(p));
        rafRef.current = setTimeout(tick, 100) as unknown as number;
      };
      rafRef.current = setTimeout(tick, 100) as unknown as number;

      setStage("understanding");
      setProgress(5);

      console.log("[pipeline] fetch starting →", `${apiUrl}/api/v1/process`);
      const t0 = performance.now();

      const response = await fetch(
        `${apiUrl}/api/v1/process`,
        {
          method: "POST",
          body: formData,
        }
      );

      cancelRaf();
      console.log("[pipeline] response received, status:", response.status,
        `(${((performance.now() - t0) / 1000).toFixed(1)}s)`);


      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(
          `Processing failed (${response.status})${detail ? ": " + detail : ""}`
        );
      }


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
    catch (err: unknown) {

      cancelRaf();
      console.error("[pipeline] error:", err);
      setStage("error");
      setProgress(0);
      setError(
        (err instanceof Error ? err.message : null) ||
        "Processing failed"
      );

    }


  }, [cancelRaf]);




  const reset = useCallback(() => {

    cancelRaf();
    setStage("idle");
    setResult(null);
    setError(null);
    setProgress(0);

  }, [cancelRaf]);




  return {

    stage,

    result,

    error,

    progress,

    processImage,

    reset

  };

}

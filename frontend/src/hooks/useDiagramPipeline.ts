import { useState, useCallback, useRef, useEffect } from "react";
import { PipelineStage, ProcessingResult } from "@/types/diagram";

const STAGES: PipelineStage[] = [
  "uploading",
  "understanding",
  "segmenting",
  "simplifying",
  "tactile",
];

export function useDiagramPipeline() {
  const [stage, setStage] = useState<PipelineStage>("idle");
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const processImage = useCallback(
    async (file: File) => {
      try {
        setError(null);
        setResult(null);
        clearTimer();

        setStage("uploading");
        setProgress(0);

        const formData = new FormData();
        formData.append("file", file);

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        // Animate through backend-estimated stages while fetch is in flight
        let elapsed = 0;
        let stageIdx = 0;

        const tick = () => {
          elapsed += 200;

          // Advance through estimated stages based on time
          // 0-3s: uploading → understanding
          // 3-8s: understanding → segmenting
          // 8-15s: segmenting → simplifying
          // 15s+: simplifying → tactile
          if (elapsed > 15000 && stageIdx < 4) stageIdx = 4;
          else if (elapsed > 8000 && stageIdx < 3) stageIdx = 3;
          else if (elapsed > 3000 && stageIdx < 2) stageIdx = 2;
          else if (elapsed > 1000 && stageIdx < 1) stageIdx = 1;

          // Logarithmic progress: fast start, slow end, caps at 85%
          const p = Math.min(85, 85 * (1 - Math.exp(-elapsed / 8000)));
          setProgress(Math.round(p));
          setStage(STAGES[stageIdx]);

          timerRef.current = setTimeout(tick, 200);
        };

        timerRef.current = setTimeout(tick, 200);

        console.log("[pipeline] upload started");

        const t0 = performance.now();
        console.log(
          "[pipeline] request sent →",
          `${apiUrl}/api/v1/process`
        );

        const response = await fetch(`${apiUrl}/api/v1/process`, {
          method: "POST",
          body: formData,
        });

        clearTimer();
        console.log(
          "[pipeline] response received, status:",
          response.status,
          `(${((performance.now() - t0) / 1000).toFixed(1)}s)`
        );

        if (!response.ok) {
          let detail = "";
          try {
            const body = await response.json();
            detail = body.detail || body.message || JSON.stringify(body);
          } catch {
            detail = await response.text().catch(() => "");
          }
          // Truncate very long error messages
          if (detail.length > 300) detail = detail.slice(0, 300) + "…";
          throw new Error(
            `Backend error (${response.status})${detail ? ": " + detail : ""}`
          );
        }

        setStage("tactile");
        setProgress(90);
        console.log("[pipeline] parsing response.json()…");

        const t1 = performance.now();
        const backendResult: ProcessingResult = await response.json();
        console.log(
          "[pipeline] response.json() done",
          `(${((performance.now() - t1) / 1000).toFixed(1)}s)`
        );

        setResult(backendResult);
        setStage("complete");
        setProgress(100);
        console.log("[pipeline] completed");
      } catch (err: unknown) {
        clearTimer();
        console.error("[pipeline] failed:", err);
        setStage("error");
        setProgress(0);
        setError(
          (err instanceof Error ? err.message : null) ||
            "Processing failed"
        );
      }
    },
    [clearTimer]
  );

  const reset = useCallback(() => {
    clearTimer();
    setStage("idle");
    setResult(null);
    setError(null);
    setProgress(0);
  }, [clearTimer]);

  return {
    stage,
    result,
    error,
    progress,
    processImage,
    reset,
  };
}

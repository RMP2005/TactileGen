import { useState, useCallback } from "react";
import { PipelineStage, ProcessingResult } from "@/types/diagram";


export function useDiagramPipeline() {

  const [stage, setStage] = useState<PipelineStage>("idle");

  const [result, setResult] = useState<ProcessingResult | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);



  const processImage = useCallback(async (file: File) => {

    try {

      setError(null);
      setResult(null);


      setStage("uploading");
      setProgress(10);



      const formData = new FormData();

      formData.append(
        "file",
        file
      );



      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:8000";



      let backendResult: ProcessingResult;



      // START VISUAL PIPELINE

      setTimeout(() => {
        setStage("understanding");
        setProgress(25);
      }, 500);



      setTimeout(() => {
        setStage("segmenting");
        setProgress(45);
      }, 2500);



      setTimeout(() => {
        setStage("simplifying");
        setProgress(70);
      }, 5000);




      const response = await fetch(
        `${apiUrl}/api/v1/process`,
        {
          method:"POST",
          body:formData
        }
      );



      if(!response.ok){

        throw new Error(
          "Processing failed"
        );

      }



      backendResult =
        await response.json();




      // Always show simplify before tactile

      await new Promise(
        resolve => setTimeout(resolve,6000)
      );



      setStage("tactile");

      setProgress(90);



      await new Promise(
        resolve => setTimeout(resolve,1500)
      );



      setResult(
        backendResult
      );


      setStage("complete");

      setProgress(100);



    }
    catch(err:any){

      setStage("error");

      setError(
        err.message ||
        "Processing failed"
      );

    }


  }, []);





  const reset = useCallback(() => {

    setStage("idle");

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
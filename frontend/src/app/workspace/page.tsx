"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  AudioLines,
  Menu,
  ScanLine,
  Waves,
  Download
} from "lucide-react";

import { useDiagramPipeline } from "@/hooks/useDiagramPipeline";


export default function WorkspacePage() {


  const {
    result,
    progress,
    processImage,
    stage,
  } = useDiagramPipeline();



  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"original" | "tactile">("tactile");
  const sampleImages = [
    {
      name: "Cell Structure",
      path: "/samples/cell.png"
    },
    {
      name: "Circuit Diagram",
      path: "/samples/circuit.png"
    },
    {
      name: "Ray Diagram",
      path: "/samples/ray.png"
    }
  ];


  const handleUpload = (file: File) => {
    const handleSample = async (path: string) => {

      try {
    
        const response = await fetch(path);
    
        const blob = await response.blob();
    
        const file = new File(
          [blob],
          path.split("/").pop() || "sample.png",
          {
            type: blob.type
          }
        );
    
    
        setImageUrl(
          URL.createObjectURL(file)
        );
    
    
        setViewMode("tactile");
    
    
        processImage(file);
    
    
      } catch(err){
    
        console.log("Sample loading failed", err);
    
      }
    
    };
    setImageUrl(
      URL.createObjectURL(file)
    );

    setViewMode("tactile");

    processImage(file);

};

const handleSample = async (path: string) => {

  try {

    const response = await fetch(path);

    const blob = await response.blob();

    const file = new File(
      [blob],
      path.split("/").pop() || "sample.png",
      {
        type: blob.type
      }
    );


    setImageUrl(
      URL.createObjectURL(file)
    );


    setViewMode("tactile");


    processImage(file);


  } catch(error) {

    console.error(
      "Sample loading failed:",
      error
    );

  }

};

  const confidence =
    result?.semantic_regions?.length
      ? Math.round(
          (result.semantic_regions.reduce(
            (sum, r) => sum + r.confidence,
            0
          ) /
            result.semantic_regions.length) *
            100
        )
      : null;




  const statusText = () => {

    if(stage === "understanding")
      return "UNDERSTANDING STRUCTURE";

    if(stage === "segmenting")
      return "DETECTING REGIONS";

    if(stage === "simplifying")
      return "SIMPLIFYING PATHS";

    if(stage === "tactile")
      return "GENERATING TACTILE MAP";

    if(stage === "complete")
      return "READY";

    return "AI TACTILE GENERATION";

  };




  return (

    <main className="min-h-screen bg-[#070706] text-[#e8e2d6] overflow-hidden">



      <nav className="h-20 border-b border-white/10 flex items-center justify-between px-10">


        <div className="flex items-center gap-3">

          <div className="w-7 h-7 rounded-full border border-orange-400/50 flex items-center justify-center">

            <ScanLine className="w-4 h-4 text-orange-400"/>

          </div>


          <span className="font-serif text-xl tracking-wide">
            TactileGen
          </span>


        </div>





        <div className="hidden md:flex gap-12 text-xs tracking-[0.25em] text-zinc-500">


          <span>
            STRUCTURES {result?.metadata?.total_regions_detected ?? "--"}
          </span>


          <span>
            PATHS {result?.tactile_paths?.length ?? "--"}
          </span>


          <span>
            LABELS {result?.extracted_labels?.length ?? "--"}
          </span>


          <span>
            CONFIDENCE {confidence ? `${confidence}%` : "--"}
          </span>


        </div>



        <Menu className="text-zinc-400"/>


      </nav>







      <section className="grid lg:grid-cols-[420px_1fr] gap-16 px-16 py-20">





        <div className="flex flex-col justify-center">


          <p className="text-xs tracking-[0.4em] text-orange-400 mb-8">
            EXPERIMENTAL ACCESSIBILITY LABORATORY
          </p>




          <h1 className="font-serif text-7xl leading-[0.95]">

            Make every

            <br/>

            <span className="italic text-orange-400">
              diagram
            </span>

            <br/>

            touchable.

          </h1>




          <p className="mt-8 text-zinc-500 leading-relaxed max-w-sm">

            Transform visual diagrams into tactile-ready structures using
            intelligent computer vision.

          </p>





          <label className="mt-10 inline-flex items-center gap-4 bg-orange-400 text-black w-fit px-7 py-4 cursor-pointer">


            Enter the instrument


            <ArrowRight className="w-4"/>


            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e)=>{

                if(e.target.files?.[0]){

                  handleUpload(e.target.files[0]);

                }

              }}
            />


          </label>
          <div className="mt-10">

<p className="text-xs tracking-[0.3em] text-zinc-500 mb-4">
TRY SAMPLE DIAGRAMS
</p>


<div className="flex flex-col gap-3">

{
sampleImages.map((sample)=>(

<button
key={sample.name}

className="text-left border border-white/10 px-4 py-3 text-sm text-zinc-400 hover:border-orange-400 hover:text-orange-400 transition"

onClick={async()=>{

const response = await fetch(sample.path);

const blob = await response.blob();

const file = new File(
[blob],
sample.name+".png",
{
type:"image/png"
}
);

handleUpload(file);

}}

>

{sample.name}

</button>

))
}

</div>

</div>





          <div className="mt-24 border-l border-orange-400/30 pl-6">


            <p className="text-xs text-orange-400">
              01
            </p>


            <h3 className="mt-3 font-serif text-xl">
              ORIGINAL IMAGE
            </h3>


            <p className="text-sm text-zinc-600 mt-2">
              Raw visual information
            </p>


          </div>


        </div>









        <div className="border border-white/10 bg-[#0b0b09] p-8">



          <div className="flex justify-between text-xs tracking-widest text-zinc-500 mb-8">


          <button
onClick={() =>
  handleSample("/samples/sample_cell.png")
}
>
 Cell Structure
</button>


<button
onClick={() =>
  handleSample("/samples/sample_circuit.png")
}
>
 Circuit Diagram
</button>


<button
onClick={() =>
  handleSample("/samples/sample_optics.png")
}
>
 Ray Diagram
</button>



            <span className="text-orange-400">

              {statusText()}

            </span>


          </div>






          <div className="aspect-video border border-white/10 bg-[#151512] flex items-center justify-center relative overflow-hidden">



          {
  viewMode === "original" && imageUrl ? (

    <img
      src={imageUrl}
      className="max-h-full object-contain"
    />

  ) : result?.processed_image_base64 ? (

    <img
      src={result.processed_image_base64}
      className="max-h-full object-contain"
    />

  ) : imageUrl ? (

    <img
      src={imageUrl}
      className="max-h-full object-contain"
    />

  ) : (

    <div className="text-zinc-600">
      Upload diagram to begin
    </div>

  )
}



            <div className="absolute inset-0 border border-orange-400/20 rounded-full scale-75 animate-pulse"/>



          </div>
          <div className="flex gap-3 mt-6">


<button
onClick={()=>setViewMode("original")}
className={`px-5 py-3 text-xs tracking-widest border ${
viewMode === "original"
? "border-orange-400 text-orange-400"
: "border-white/20"
}`}
>
ORIGINAL
</button>



<button
onClick={()=>setViewMode("tactile")}
className={`px-5 py-3 text-xs tracking-widest border ${
viewMode === "tactile"
? "border-orange-400 text-orange-400"
: "border-white/20"
}`}
>
TACTILE
</button>


</div>





          {
            result && (

              <div className="flex gap-4 mt-6">


                <a
                  href={result.processed_image_base64}
                  download="tactile_output.png"
                  className="flex items-center gap-2 border border-orange-400/40 px-5 py-3 text-xs tracking-widest text-orange-400"
                >

                  <Download className="w-3"/>

                  DOWNLOAD PNG

                </a>




                <a
                  href={
                    "data:image/svg+xml;charset=utf-8," +
                    encodeURIComponent(result.tactile_svg)
                  }
                  download="tactile_output.svg"
                  className="flex items-center gap-2 border border-white/20 px-5 py-3 text-xs tracking-widest"
                >

                  <Download className="w-3"/>

                  DOWNLOAD SVG

                </a>


              </div>

            )
          }







          <div className="mt-8">


            <div className="flex justify-between text-xs text-zinc-500">


              <span>
                TRANSFORMATION PROGRESS
              </span>


              <span>
                {progress}%
              </span>


            </div>




            <div className="h-px bg-zinc-700 mt-4 relative">


              <div
                className="absolute left-0 top-0 h-px bg-orange-400 transition-all duration-500"
                style={{
                  width:`${progress}%`
                }}
              />


            </div>





            


            <div className="flex justify-between mt-6 text-xs tracking-widest text-zinc-500">


<span
  className={
    stage === "uploading"
      ? "text-orange-400"
      : ""
  }
>
  01 ORIGINAL
</span>



<span
  className={
    stage === "understanding" ||
    stage === "segmenting"
      ? "text-orange-400"
      : ""
  }
>
  02 STRUCTURE
</span>




<span
  className={
    stage === "simplifying"
      ? "text-orange-400"
      : ""
  }
>
  03 SIMPLIFY
</span>




<span
  className={
    stage === "tactile" ||
    stage === "complete"
      ? "text-orange-400"
      : ""
  }
>
  04 TACTILE
</span>


</div>


</div>


</div>


</section>





<footer className="border-t border-white/10 px-16 py-6 flex justify-between text-xs tracking-widest text-zinc-500">


<div className="flex gap-8">


<span className="flex gap-2 items-center">

<AudioLines className="w-4"/>

AUDIO ON

</span>



<span className="flex gap-2 items-center">

<Waves className="w-4"/>

HAPTICS ON

</span>


</div>



<Link href="/" className="text-orange-400">

EXPLORE WORKSPACE →

</Link>


</footer>



</main>

);
}
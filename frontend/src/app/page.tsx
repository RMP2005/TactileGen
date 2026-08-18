"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Activity,
  AudioLines,
  ScanLine,
  Crosshair,
  Menu,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#070706] text-[#e8e2d6] overflow-hidden">

      {/* NAVBAR */}
      <nav className="h-20 border-b border-white/10 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-orange-400/60 flex items-center justify-center">
            <Activity size={16} className="text-orange-400" />
          </div>
          <span className="font-serif tracking-wide text-xl">
            TactileGen
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[11px] tracking-[0.25em] text-zinc-500">
          <span className="text-orange-400">LIVE INSTRUMENT</span>
          <span>STRUCTURES</span>
          <span>PATHS</span>
          <span>LABELS</span>
          <span>CONFIDENCE</span>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/workspace"
            className="px-5 py-2 bg-cyan-400 text-black rounded-full text-sm font-medium"
          >
            Try a diagram →
          </Link>

          <Menu size={20}/>
        </div>
      </nav>


      {/* HERO */}
      <section className="grid lg:grid-cols-2 gap-10 px-10 lg:px-20 py-20">

        {/* LEFT */}
        <div className="flex flex-col justify-center">

          <p className="text-orange-400 text-xs tracking-[0.4em] mb-8">
            EXPERIMENTAL ACCESSIBILITY LABORATORY
          </p>

          <h1 className="font-serif text-6xl lg:text-8xl leading-[0.9]">
            Make every
            <br/>
            <span className="italic text-orange-400">
              diagram
            </span>
            <br/>
            touchable.
          </h1>


          <p className="mt-10 max-w-md text-zinc-500 leading-relaxed">
            Move across the specimen. Drag to reconstruct its information.
            Transform visual structures into tactile fields using AI-powered
            semantic understanding.
          </p>


          <Link
            href="/workspace"
            className="mt-10 w-fit bg-orange-400 text-black px-7 py-4 text-sm font-semibold"
          >
            Enter the instrument →
          </Link>


          <div className="mt-20 border-l border-orange-400/40 pl-6">
            <p className="text-orange-400 text-xs">01</p>
            <h3 className="mt-3 text-xl font-serif">
              ORIGINAL IMAGE
            </h3>
            <p className="text-zinc-600 text-sm">
              Raw visual information
            </p>
          </div>

        </div>



        {/* RIGHT INSTRUMENT PANEL */}
        <div className="border border-white/10 bg-[#0b0b09] p-6 relative">

          <div className="flex justify-between text-xs tracking-widest text-zinc-500 mb-6">
            <span>LIVE SPECIMEN / CELL STRUCTURE</span>
            <span className="text-orange-400">
              READING SOURCE IMAGE
            </span>
          </div>


          <div className="aspect-video bg-[#151512] border border-white/10 flex items-center justify-center relative overflow-hidden">

            {/* fake diagram */}
            <div className="w-[70%] h-[70%] bg-[#ddd] relative">

              <div className="absolute inset-8 border-4 border-black rounded-[50%]" />

              <div className="absolute top-[40%] left-[45%] w-20 h-20 border-4 border-black rounded-full">
                <div className="absolute w-6 h-6 bg-black rounded-full top-5 left-5"/>
              </div>


              <span className="absolute top-10 left-12 text-black font-bold text-sm">
                Cell Membrane
              </span>

              <span className="absolute top-20 right-20 text-black font-bold text-sm">
                Nucleus
              </span>

              <span className="absolute bottom-16 right-20 text-black font-bold text-sm">
                Mitochondria
              </span>

            </div>


            <motion.div
  animate={{
    scale: [1, 1.2, 1],
    opacity: [0.4, 1, 0.4],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
  }}
  className="absolute w-40 h-40 border border-orange-400 rounded-full"
/>

</div>  // aspect-video close

</div>  // RIGHT INSTRUMENT PANEL close

</section>
</main>
);
}
"use client";

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, contourEmergence } from '@/lib/motion';
import { UploadCloud, BrainCircuit, Layers, Fingerprint, Scissors, ShieldAlert, ArrowRight, Zap, Download } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/common/Footer';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-20 pb-32">
        <motion.div 
          className="max-w-4xl w-full text-center space-y-8 z-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800/50 text-cyan-400 text-sm font-medium mb-4">
            <SparklesIcon />
            <span>AI-Powered Tactile Graphics</span>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-light tracking-tight text-zinc-100 leading-tight"
          >
            Make every diagram <br/>
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              touchable.
            </span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            TactileGen transforms complex educational diagrams into simplified tactile-ready representations using computer vision and semantic segmentation.
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <Link 
              href="/workspace"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-400 text-cyan-950 px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              Try a diagram
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#how-it-works"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent text-zinc-100 border border-zinc-700 px-8 py-4 rounded-full font-medium text-lg hover:bg-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              See how it works
            </a>
          </motion.div>
        </motion.div>

        {/* Hero Illustration */}
        <motion.div 
          className="mt-24 w-full max-w-2xl aspect-video relative z-10 mx-auto"
          initial="hidden"
          animate="visible"
        >
          <div className="absolute inset-0 bg-zinc-900/50 rounded-2xl border border-zinc-800 backdrop-blur-sm p-8 flex items-center justify-center shadow-2xl overflow-hidden">
            <svg viewBox="0 0 400 300" className="w-full h-full max-w-md stroke-cyan-400 stroke-2 fill-transparent drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              {/* Decorative cell outline being drawn */}
              <motion.path 
                variants={contourEmergence}
                d="M 100 150 C 100 50, 300 50, 300 150 C 300 250, 100 250, 100 150 Z"
                strokeWidth="4"
              />
              <motion.path 
                variants={contourEmergence}
                d="M 150 150 C 150 120, 250 120, 250 150 C 250 180, 150 180, 150 150 Z"
                strokeWidth="2"
                strokeDasharray="4 4"
                transition={{ delay: 0.5, duration: 2 }}
              />
              <motion.circle 
                variants={contourEmergence}
                cx="200" cy="150" r="10"
                fill="rgba(34,211,238,0.2)"
                transition={{ delay: 1, duration: 1 }}
              />
            </svg>
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Pipeline Section */}
      <section id="how-it-works" className="py-32 px-6 bg-zinc-950/50 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">The Processing Pipeline</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">From complex pixels to clean, elevated paths in five automated steps.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 md:gap-0 relative">
            {/* Desktop Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-zinc-800 -translate-y-1/2 z-0" />
            
            <PipelineCard 
              icon={<UploadCloud className="w-6 h-6 text-cyan-400" />}
              title="Upload"
              description="Ingest original diagram"
              delay={0.1}
            />
            <PipelineCard 
              icon={<BrainCircuit className="w-6 h-6 text-cyan-400" />}
              title="Understand"
              description="Extract semantic meaning"
              delay={0.2}
            />
            <PipelineCard 
              icon={<Layers className="w-6 h-6 text-cyan-400" />}
              title="Segment"
              description="Isolate key regions"
              delay={0.3}
            />
            <PipelineCard 
              icon={<Scissors className="w-6 h-6 text-cyan-400" />}
              title="Simplify"
              description="Remove visual clutter"
              delay={0.4}
            />
            <PipelineCard 
              icon={<Fingerprint className="w-6 h-6 text-cyan-400" />}
              title="Tactile"
              description="Generate raised paths"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-emerald-400" />}
              title="Real AI, Not Filters"
              description="We use deep semantic segmentation to understand the structural parts of a diagram, avoiding the messy noise of standard edge-detection filters."
            />
            <FeatureCard 
              icon={<Fingerprint className="w-8 h-8 text-cyan-400" />}
              title="Interactive Preview"
              description="Explore generated diagrams with your cursor. Experience audio-spatial feedback and haptic vibrations before exporting."
            />
            <FeatureCard 
              icon={<Download className="w-8 h-8 text-purple-400" />}
              title="Export Anywhere"
              description="Download structured, layer-separated SVG files ready for tactile embossers, or high-contrast PNGs for low-vision learners."
            />
          </div>
        </div>
      </section>

      {/* Honesty / Disclaimer */}
      <section className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <ShieldAlert className="w-10 h-10 text-zinc-500 mx-auto mb-6" />
          <h3 className="text-xl font-medium text-zinc-200 mb-4">A note on accessibility</h3>
          <p className="text-zinc-400 leading-relaxed">
            TactileGen creates tactile-ready digital representations designed to bridge the gap in educational materials. 
            Final physical embossing may require human review to ensure optimal readability. We do not claim clinical or accessibility certification.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function PipelineCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      className="relative z-10 flex flex-col items-center p-6 bg-zinc-950 border border-zinc-800 rounded-2xl w-full md:w-48 shadow-xl"
    >
      <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="text-zinc-100 font-medium mb-2">{title}</h4>
      <p className="text-xs text-zinc-500 text-center">{description}</p>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 transition-colors"
    >
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-medium text-zinc-100 mb-4">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}

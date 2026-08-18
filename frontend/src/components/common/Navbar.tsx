"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fingerprint, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  
  const isWorkspace = pathname?.startsWith('/workspace');
  
  if (isWorkspace) return null;



  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-zinc-100 hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md"
        >
          <Fingerprint className="w-6 h-6 text-cyan-400" />
          <span className="font-medium tracking-tight text-lg">TactileGen</span>
        </Link>
        
        <nav className="flex items-center gap-6">
          {!isWorkspace && (
            <Link 
              href="/workspace"
              className="group flex items-center gap-2 text-sm font-medium bg-cyan-400 text-cyan-950 px-4 py-2 rounded-full hover:bg-cyan-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              Try a diagram
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
          {isWorkspace && (
            <Link
              href="/"
              className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-md px-2 py-1"
            >
              Back to Home
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

"use client";

import { Download, FileImage, FileCode2 } from 'lucide-react';
import { ProcessingResult } from '@/types/diagram';

interface ExportPanelProps {
  result: ProcessingResult;
}

export default function ExportPanel({ result }: ExportPanelProps) {
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadSvg = () => {
    downloadFile(result.tactile_svg, 'tactile_diagram.svg', 'image/svg+xml');
  };

  const downloadPng = () => {
    const a = document.createElement('a');
    const href = result.processed_image_base64.startsWith('data:')
      ? result.processed_image_base64
      : `data:image/png;base64,${result.processed_image_base64}`;
    a.href = href;
    a.download = 'tactile_diagram_hc.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">Export Options</h3>
      <button 
        onClick={downloadSvg}
        className="flex items-center justify-between w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-cyan-400 hover:bg-cyan-950/20 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-800 rounded-lg group-hover:bg-cyan-900/50 group-hover:text-cyan-400 transition-colors">
            <FileCode2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium text-zinc-200">Vector SVG</span>
            <span className="text-xs text-zinc-500">For tactile embossers</span>
          </div>
        </div>
        <Download className="w-5 h-5 text-zinc-600 group-hover:text-cyan-400" />
      </button>

      <button 
        onClick={downloadPng}
        className="flex items-center justify-between w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-cyan-400 hover:bg-cyan-950/20 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-800 rounded-lg group-hover:bg-cyan-900/50 group-hover:text-cyan-400 transition-colors">
            <FileImage className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium text-zinc-200">High-Contrast PNG</span>
            <span className="text-xs text-zinc-500">For low-vision screens</span>
          </div>
        </div>
        <Download className="w-5 h-5 text-zinc-600 group-hover:text-cyan-400" />
      </button>
    </div>
  );
}

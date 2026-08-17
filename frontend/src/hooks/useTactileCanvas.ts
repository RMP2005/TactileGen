import { useState, useCallback, useRef, MouseEvent, TouchEvent, WheelEvent } from 'react';
import { parseSvgPaths, distanceToPath, Point } from '@/lib/vector-utils';
import { SemanticRegion, ExtractedLabel } from '@/types/diagram';

interface UseTactileCanvasProps {
  svgContent?: string;
  regions?: SemanticRegion[];
  labels?: ExtractedLabel[];
}

export function useTactileCanvas({ svgContent, regions = [], labels = [] }: UseTactileCanvasProps) {
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState<{x: number, y: number} | null>(null);
  const [nearestDistance, setNearestDistance] = useState<number>(Infinity);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPanPoint = useRef({ x: 0, y: 0 });
  
  // Cache parsed paths
  const parsedPathsRef = useRef<Point[][]>([]);
  if (svgContent && parsedPathsRef.current.length === 0) {
    parsedPathsRef.current = parseSvgPaths(svgContent);
  }

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    if (isDragging.current) {
      const dx = clientX - lastPanPoint.current.x;
      const dy = clientY - lastPanPoint.current.y;
      setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastPanPoint.current = { x: clientX, y: clientY };
      return;
    }

    // Calculate position in SVG space
    const x = (clientX - rect.left - panOffset.x) / zoom;
    const y = (clientY - rect.top - panOffset.y) / zoom;
    
    setCursorPosition({ x, y });

    // Calculate proximity
    if (parsedPathsRef.current.length > 0) {
      let minDist = Infinity;
      for (const path of parsedPathsRef.current) {
        const dist = distanceToPath({ x, y }, path);
        if (dist < minDist) minDist = dist;
      }
      setNearestDistance(minDist * zoom); // Screen space distance
    }

    // Check labels
    const hoveredL = labels.find(l => 
      x >= l.x && x <= l.x + l.width &&
      y >= l.y && y <= l.y + l.height
    );
    setHoveredLabel(hoveredL ? hoveredL.id : null);

    // Check regions (simplified bounds check)
    const hoveredR = regions.find(r => 
      x >= r.bounds.x && x <= r.bounds.x + r.bounds.width &&
      y >= r.bounds.y && y <= r.bounds.y + r.bounds.height
    );
    setHoveredRegion(hoveredR ? hoveredR.id : null);

  }, [zoom, panOffset, labels, regions]);

  const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onMouseDown = (e: MouseEvent) => {
    isDragging.current = true;
    lastPanPoint.current = { x: e.clientX, y: e.clientY };
  };
  
  const onMouseUp = () => {
    isDragging.current = false;
  };
  
  const onMouseLeave = () => {
    isDragging.current = false;
    setCursorPosition(null);
    setNearestDistance(Infinity);
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const zoomFactor = -e.deltaY > 0 ? 1.1 : 0.9;
    setZoom(prev => Math.max(0.1, Math.min(prev * zoomFactor, 10)));
  };

  return {
    containerRef,
    zoom,
    setZoom,
    panOffset,
    cursorPosition,
    nearestDistance,
    hoveredRegion,
    hoveredLabel,
    handlers: {
      onMouseMove,
      onTouchMove,
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      onWheel
    }
  };
}

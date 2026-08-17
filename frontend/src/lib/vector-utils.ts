export interface Point {
  x: number;
  y: number;
}

export function distanceToSegment(p: Point, v: Point, w: Point): number {
  const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;
  if (l2 === 0) return Math.sqrt((p.x - v.x) ** 2 + (p.y - v.y) ** 2);
  
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  
  const proj = {
    x: v.x + t * (w.x - v.x),
    y: v.y + t * (w.y - v.y)
  };
  
  return Math.sqrt((p.x - proj.x) ** 2 + (p.y - proj.y) ** 2);
}

export function distanceToPath(point: Point, pathPoints: Point[]): number {
  if (pathPoints.length < 2) return Infinity;
  
  let minDistance = Infinity;
  for (let i = 0; i < pathPoints.length - 1; i++) {
    const d = distanceToSegment(point, pathPoints[i], pathPoints[i+1]);
    if (d < minDistance) {
      minDistance = d;
    }
  }
  return minDistance;
}

export function parseSvgPaths(svgString: string): Point[][] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const paths = doc.querySelectorAll('path');
  
  const allPathsPoints: Point[][] = [];
  
  paths.forEach(path => {
    const d = path.getAttribute('d');
    if (!d) return;
    
    // Very simplified parser for basic commands
    // Real implementation should use a robust SVG path parser, 
    // but this suffices for the scope.
    const points: Point[] = [];
    const commands = d.match(/[a-zA-Z][^a-zA-Z]*/g) || [];
    
    let currentX = 0, currentY = 0;
    
    for (const cmd of commands) {
      const type = cmd[0];
      const args = cmd.slice(1).trim().split(/[\s,]+/).map(Number);
      
      if (type === 'M' || type === 'L') {
        for (let i = 0; i < args.length; i += 2) {
          currentX = args[i];
          currentY = args[i+1];
          if (!isNaN(currentX) && !isNaN(currentY)) {
            points.push({ x: currentX, y: currentY });
          }
        }
      } else if (type === 'm' || type === 'l') {
        for (let i = 0; i < args.length; i += 2) {
          currentX += args[i];
          currentY += args[i+1];
          if (!isNaN(currentX) && !isNaN(currentY)) {
            points.push({ x: currentX, y: currentY });
          }
        }
      }
    }
    
    if (points.length > 0) {
      allPathsPoints.push(points);
    }
  });
  
  return allPathsPoints;
}

export function getBoundingBox(points: Point[]) {
  if (points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
  
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

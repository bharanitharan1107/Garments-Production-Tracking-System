import { useEffect, useRef, useState } from 'react';

// Continent polygons in [latitude, longitude] coordinates
const landmasses = [
  // North America
  [
    [50, -120], [60, -125], [70, -165], [72, -160], [75, -120], [80, -100], 
    [75, -80], [70, -80], [60, -50], [50, -60], [45, -60], [30, -80], 
    [25, -100], [20, -105], [15, -95], [20, -90], [25, -80], [30, -80], [35, -120]
  ],
  // Greenland
  [
    [60, -50], [70, -60], [80, -70], [85, -40], [80, -20], [70, -30], [60, -40]
  ],
  // South America
  [
    [12, -72], [10, -60], [5, -53], [-5, -35], [-20, -40], [-35, -50], 
    [-55, -68], [-50, -75], [-40, -73], [-20, -70], [-10, -75], [-5, -80], 
    [0, -80], [5, -75]
  ],
  // Africa
  [
    [35, -5], [37, 10], [32, 15], [30, 32], [25, 34], [15, 40], [12, 45], 
    [5, 48], [0, 42], [-15, 40], [-30, 30], [-34, 20], [-30, 15], [-20, 10], 
    [-10, 12], [5, 10], [5, -10], [15, -17], [30, -10]
  ],
  // Eurasia (Europe + Asia)
  [
    [70, -10], [75, 20], [75, 60], [75, 100], [75, 140], [70, 170], [60, 170], 
    [55, 160], [50, 140], [40, 120], [30, 120], [25, 105], [20, 110], [10, 105], 
    [10, 100], [20, 95], [15, 80], [10, 75], [20, 70], [25, 60], [30, 35], 
    [20, 40], [15, 45], [12, 43], [30, 30], [40, 25], [35, 15], [45, 15], 
    [45, -5], [50, -10], [60, 5], [60, -10]
  ],
  // India
  [
    [25, 70], [25, 90], [20, 85], [10, 78], [8, 77], [10, 76], [20, 72]
  ],
  // Australia
  [
    [-11, 130], [-15, 145], [-25, 150], [-35, 150], [-38, 145], [-35, 115], 
    [-22, 113], [-20, 120]
  ]
];

interface GlobePoint {
  x: number;
  y: number;
  z: number;
}

interface CityInfo {
  lat: number;
  lon: number;
  name: string;
  code: string;
}

const CITIES: Record<string, CityInfo> = {
  'BOM': { lat: 19.076, lon: 72.877, name: 'Mumbai', code: 'BOM' },
  'JFK': { lat: 40.7128, lon: -74.006, name: 'New York', code: 'JFK' },
  'LHR': { lat: 51.5074, lon: -0.1278, name: 'London', code: 'LHR' },
  'SYD': { lat: -33.8688, lon: 151.2093, name: 'Sydney', code: 'SYD' },
  'HND': { lat: 35.6762, lon: 139.6503, name: 'Tokyo', code: 'HND' },
};

function isPointInPolygon(point: number[], polygon: number[][]) {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Generate the land dots list once when parsing
const generateLandPoints = (): GlobePoint[] => {
  const points: GlobePoint[] = [];
  const stepLat = 3.5;
  const stepLon = 3.5;

  for (let lat = -80; lat <= 80; lat += stepLat) {
    for (let lon = -180; lon <= 180; lon += stepLon) {
      const p = [lat, lon];
      let isLand = false;
      for (const poly of landmasses) {
        if (isPointInPolygon(p, poly)) {
          isLand = true;
          break;
        }
      }
      if (isLand) {
        const radLat = lat * Math.PI / 180;
        const radLon = lon * Math.PI / 180;
        points.push({
          x: Math.cos(radLat) * Math.cos(radLon),
          y: Math.sin(radLat),
          z: Math.cos(radLat) * Math.sin(radLon),
        });
      }
    }
  }
  return points;
};

const LAND_POINTS = generateLandPoints();

interface GlobeProps {
  activeDest: string;
  className?: string;
}

export default function Globe({ activeDest, className = '' }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Refs to store rotation angles and interaction state to prevent re-renders
  const yawRef = useRef<number>(-1.2); // Start looking at Indian Ocean
  const pitchRef = useRef<number>(0.3);
  const targetYawRef = useRef<number | null>(null);
  const targetPitchRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastInteractionTimeRef = useRef<number>(Date.now());
  const pulseTimeRef = useRef<number>(0);

  // Convert active destination string to code
  const getCityCode = (destName: string): string => {
    const lower = destName.toLowerCase();
    if (lower.includes('new york') || lower.includes('jfk') || lower.includes('usa')) return 'JFK';
    if (lower.includes('london') || lower.includes('lhr') || lower.includes('uk')) return 'LHR';
    if (lower.includes('sydney') || lower.includes('syd') || lower.includes('australia')) return 'SYD';
    if (lower.includes('tokyo') || lower.includes('hnd') || lower.includes('japan')) return 'HND';
    return 'JFK';
  };

  const destCode = getCityCode(activeDest);
  const startCode = 'BOM';

  // Smoothly center camera when activeDest changes
  useEffect(() => {
    const startCity = CITIES[startCode];
    const endCity = CITIES[destCode];
    if (startCity && endCity) {
      // Calculate midpoint coordinates
      const latMid = (startCity.lat + endCity.lat) / 2;
      const lonMid = (startCity.lon + endCity.lon) / 2;

      // target yaw and pitch
      targetYawRef.current = -lonMid * Math.PI / 180;
      targetPitchRef.current = latMid * Math.PI / 180;
      lastInteractionTimeRef.current = Date.now();
    }
  }, [activeDest, destCode]);

  // Handle Drag Interactions
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    lastInteractionTimeRef.current = Date.now();
    targetYawRef.current = null;
    targetPitchRef.current = null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    yawRef.current += dx * 0.006;
    pitchRef.current -= dy * 0.006;

    // Clamp pitch to prevent going upside down
    pitchRef.current = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, pitchRef.current));

    dragStartRef.current = { x: e.clientX, y: e.clientY };
    lastInteractionTimeRef.current = Date.now();
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // Main Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // Handle retina screens / sizing dynamically
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const R = Math.min(width, height) * 0.38; // Globe radius relative to size

      // Idle Rotation logic (if no user interaction for 4 seconds)
      const now = Date.now();
      if (!isDraggingRef.current && targetYawRef.current === null && now - lastInteractionTimeRef.current > 4000) {
        yawRef.current += 0.0015;
      }

      // Smooth camera interpolation
      if (targetYawRef.current !== null && targetPitchRef.current !== null) {
        // Easing interpolation for Yaw
        let dy = targetYawRef.current - yawRef.current;
        // Normalize angle difference to (-PI, PI) to turn the shortest path
        dy = Math.atan2(Math.sin(dy), Math.cos(dy));
        
        const dp = targetPitchRef.current - pitchRef.current;

        yawRef.current += dy * 0.06;
        pitchRef.current += dp * 0.06;

        if (Math.abs(dy) < 0.001 && Math.abs(dp) < 0.001) {
          targetYawRef.current = null;
          targetPitchRef.current = null;
        }
      }

      // Setup 3D Rotation matrices
      const cosY = Math.cos(yawRef.current);
      const sinY = Math.sin(yawRef.current);
      const cosX = Math.cos(pitchRef.current);
      const sinX = Math.sin(pitchRef.current);

      // 3D Projection function
      const project = (x3d: number, y3d: number, z3d: number) => {
        // Spin (Y rotation)
        const x1 = x3d * cosY - z3d * sinY;
        const y1 = y3d;
        const z1 = x3d * sinY + z3d * cosY;

        // Tilt (X rotation)
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX; // positive = facing viewer

        return {
          sx: cx + x2 * R,
          sy: cy - y2 * R,
          sz: z2,
        };
      };

      // Draw dynamic glowing space background (behind globe)
      const bgGrad = ctx.createRadialGradient(cx, cy, R * 0.8, cx, cy, R * 1.5);
      bgGrad.addColorStop(0, 'rgba(10, 11, 24, 0.6)');
      bgGrad.addColorStop(0.5, 'rgba(13, 14, 30, 0.3)');
      bgGrad.addColorStop(1, 'rgba(9, 9, 11, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Grid / Meridians and Parallels (Front Hemisphere only)
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.06)';
      
      // Latitude Parallels (-60 to 60 deg)
      for (let latDeg = -60; latDeg <= 60; latDeg += 30) {
        const radLat = latDeg * Math.PI / 180;
        const cosLat = Math.cos(radLat);
        const sinLat = Math.sin(radLat);
        
        ctx.beginPath();
        let first = true;
        for (let lonDeg = -180; lonDeg <= 180; lonDeg += 5) {
          const radLon = lonDeg * Math.PI / 180;
          const { sx, sy, sz } = project(cosLat * Math.cos(radLon), sinLat, cosLat * Math.sin(radLon));
          if (sz > 0) {
            if (first) {
              ctx.moveTo(sx, sy);
              first = false;
            } else {
              ctx.lineTo(sx, sy);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Longitude Meridians
      for (let lonDeg = -180; lonDeg < 180; lonDeg += 30) {
        const radLon = lonDeg * Math.PI / 180;
        const cosLon = Math.cos(radLon);
        const sinLon = Math.sin(radLon);

        ctx.beginPath();
        let first = true;
        for (let latDeg = -90; latDeg <= 90; latDeg += 5) {
          const radLat = latDeg * Math.PI / 180;
          const { sx, sy, sz } = project(Math.cos(radLat) * cosLon, Math.sin(radLat), Math.cos(radLat) * sinLon);
          if (sz > 0) {
            if (first) {
              ctx.moveTo(sx, sy);
              first = false;
            } else {
              ctx.lineTo(sx, sy);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Draw Landmass Dots
      for (const p of LAND_POINTS) {
        const { sx, sy, sz } = project(p.x, p.y, p.z);
        if (sz > 0.05) {
          // Fade points near the edges (depth cue)
          const alpha = sz * sz * 0.5;
          ctx.fillStyle = `rgba(147, 197, 253, ${alpha})`; // Sleek Ice Blue dots
          ctx.fillRect(sx - 0.75, sy - 0.75, 1.5, 1.5);
        }
      }

      // Draw Shipping Route Arcs
      const startCity = CITIES[startCode];
      const endCity = CITIES[destCode];

      if (startCity && endCity) {
        // Convert cities to unit 3D vectors
        const latA = startCity.lat * Math.PI / 180;
        const lonA = startCity.lon * Math.PI / 180;
        const vA = {
          x: Math.cos(latA) * Math.cos(lonA),
          y: Math.sin(latA),
          z: Math.cos(latA) * Math.sin(lonA)
        };

        const latB = endCity.lat * Math.PI / 180;
        const lonB = endCity.lon * Math.PI / 180;
        const vB = {
          x: Math.cos(latB) * Math.cos(lonB),
          y: Math.sin(latB),
          z: Math.cos(latB) * Math.sin(lonB)
        };

        // Angular distance between vectors
        const cosOmega = vA.x * vB.x + vA.y * vB.y + vA.z * vB.z;
        const omega = Math.acos(Math.max(-1, Math.min(1, cosOmega)));

        // Alt amplitude proportional to routing distance
        const altAmp = 0.22 * Math.sin(omega / 2);

        // Generate points along the arc
        const arcPoints: { sx: number; sy: number; sz: number }[] = [];
        const numSteps = 60;
        for (let i = 0; i <= numSteps; i++) {
          const t = i / numSteps;
          // Linear interpolation followed by normalization (approximate slerp)
          const xt = vA.x * (1 - t) + vB.x * t;
          const yt = vA.y * (1 - t) + vB.y * t;
          const zt = vA.z * (1 - t) + vB.z * t;
          const len = Math.sqrt(xt * xt + yt * yt + zt * zt);

          const alt = altAmp * Math.sin(t * Math.PI);
          const rScale = 1 + alt;

          const { sx, sy, sz } = project((xt / len) * rScale, (yt / len) * rScale, (zt / len) * rScale);
          arcPoints.push({ sx, sy, sz });
        }

        // Draw Route Line
        // Front arc and Back arc sections drawn separately for correct 3D occlusion
        ctx.lineWidth = 1.8;
        ctx.shadowBlur = 0; // reset shadow
        
        ctx.beginPath();
        let pathStarted = false;
        for (const pt of arcPoints) {
          if (pt.sz > 0.0) { // front of globe
            if (!pathStarted) {
              ctx.moveTo(pt.sx, pt.sy);
              pathStarted = true;
            } else {
              ctx.lineTo(pt.sx, pt.sy);
            }
          } else {
            pathStarted = false;
          }
        }
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.75)'; // Glowing Cyan/Blue
        ctx.stroke();

        // Draw dotted/dashed style for the back-side occlusion (under the globe depth effect)
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.12)';
        ctx.beginPath();
        let backPathStarted = false;
        for (const pt of arcPoints) {
          if (pt.sz <= 0.0) {
            if (!backPathStarted) {
              ctx.moveTo(pt.sx, pt.sy);
              backPathStarted = true;
            } else {
              ctx.lineTo(pt.sx, pt.sy);
            }
          } else {
            backPathStarted = false;
          }
        }
        ctx.stroke();

        // Animated cargo/plane pulse along the arc
        pulseTimeRef.current = (pulseTimeRef.current + 0.008) % 1.0;
        const pulseIndex = Math.floor(pulseTimeRef.current * numSteps);
        const pulsePt = arcPoints[pulseIndex];
        
        if (pulsePt && pulsePt.sz > 0) {
          // Glow effect on drawing context
          ctx.save();
          ctx.beginPath();
          ctx.arc(pulsePt.sx, pulsePt.sy, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#60a5fa';
          ctx.shadowBlur = 12;
          ctx.fill();

          // Render tail trail points
          for (let k = 1; k <= 5; k++) {
            const tailIdx = (pulseIndex - k + numSteps + 1) % (numSteps + 1);
            const tailPt = arcPoints[tailIdx];
            if (tailPt && tailPt.sz > 0) {
              ctx.beginPath();
              ctx.arc(tailPt.sx, tailPt.sy, 2.5 - k * 0.4, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(147, 197, 253, ${0.8 - k * 0.15})`;
              ctx.fill();
            }
          }
          ctx.restore();
        }

        // Draw pulsing cities (Start BOM & End Target)
        [
          { city: startCity, label: 'BOM (Origin)', color: 'rgba(59, 130, 246, ' },
          { city: endCity, label: `${destCode} (Destination)`, color: 'rgba(255, 255, 255, ' }
        ].forEach(({ city, label, color }) => {
          const latRad = city.lat * Math.PI / 180;
          const lonRad = city.lon * Math.PI / 180;
          const px = Math.cos(latRad) * Math.cos(lonRad);
          const py = Math.sin(latRad);
          const pz = Math.cos(latRad) * Math.sin(lonRad);

          const { sx, sy, sz } = project(px, py, pz);

          if (sz > 0) {
            // Pulse animation scale
            const pulseScale = (Math.sin(Date.now() * 0.005) + 1) * 0.5; // [0, 1]
            const pulseRadius = 3 + pulseScale * 8;
            const pulseAlpha = 0.8 - pulseScale * 0.8;

            ctx.save();
            // Outer Ring
            ctx.beginPath();
            ctx.arc(sx, sy, pulseRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `${color}${pulseAlpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Core Center Dot
            ctx.beginPath();
            ctx.arc(sx, sy, 3, 0, Math.PI * 2);
            ctx.fillStyle = color === 'rgba(255, 255, 255, ' ? '#ffffff' : '#3b82f6';
            ctx.shadowBlur = 6;
            ctx.shadowColor = ctx.fillStyle;
            ctx.fill();
            ctx.restore();

            // City Tag / Label
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.font = 'bold 9px sans-serif';
            ctx.textAlign = 'center';
            ctx.shadowBlur = 0;
            ctx.fillText(label, sx, sy - 10);
          }
        });
      }

      // Draw Globe Outer Atmosphere Blue Outline (Sleek edge ring)
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.35)';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // Atmospheric glowing halo overlay
      ctx.save();
      const haloGrad = ctx.createRadialGradient(cx, cy, R - 6, cx, cy, R + 26);
      haloGrad.addColorStop(0, 'rgba(59, 130, 246, 0)');
      haloGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.08)');
      haloGrad.addColorStop(0.85, 'rgba(96, 165, 250, 0.18)');
      haloGrad.addColorStop(1, 'rgba(96, 165, 250, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R + 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeDest, destCode]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      {/* Decorative Crosshair Grid Details in background */}
      <div className="absolute inset-0 pointer-events-none border border-[var(--border-primary)] rounded-xl">
        {/* Ticks on corners */}
        <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-[var(--border-primary)]" />
        <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-[var(--border-primary)]" />
        <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-[var(--border-primary)]" />
        <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-[var(--border-primary)]" />
        
        {/* Lat/Long Grid coordinates simulation overlay */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[var(--text-neutral-450)] tracking-widest">
          3D VISUALIZER · LIVE FLIGHT COORDINATES
        </div>
        <div className="absolute bottom-4 left-6 text-[8px] font-mono text-[var(--text-neutral-450)]">
          SPHERE RATIO: 1.00 : 0.38
        </div>
        <div className="absolute bottom-4 right-6 text-[8px] font-mono text-[var(--text-neutral-450)] uppercase">
          CARRIER LOCK: {destCode}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing max-w-full max-h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      />
    </div>
  );
}

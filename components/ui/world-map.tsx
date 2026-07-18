"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import DottedMap from "dotted-map";
import Image from "next/image";
import { useTheme } from "next-themes";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

export function WorldMap({
  dots = [],
  lineColor = "#C9A45C", // Premium Gold color to match S Square Architects theme
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useTheme();

  // Create a dotted map of the world
  const map = new DottedMap({ height: 100, grid: "diagonal" });

  const svgMap = map.getSVG({
    radius: 0.22,
    color: theme === "dark" ? "#FFFFFF25" : "#00000015",
    shape: "circle",
    backgroundColor: theme === "dark" ? "transparent" : "transparent",
  });

  // Project points specifically for India bounding box (approx. Lat 8° to 38° N, Lng 68° to 98° E)
  // This maps coordinates onto our custom India-focused viewport of 800x800
  const projectPoint = (lat: number, lng: number) => {
    const minLat = 8.0;
    const maxLat = 38.0;
    const minLng = 68.0;
    const maxLng = 98.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 800;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 800;
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 60; // Curve arc depth
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto aspect-square dark:bg-zinc-950 bg-stone-50 rounded-xl border border-stone-200 dark:border-zinc-800 relative font-sans p-6 overflow-hidden">
      {/* Background Dotted Outline of India (Uses a custom high-end vector mask) */}
      <div className="absolute inset-0 opacity-40 dark:opacity-30 flex items-center justify-center p-8 pointer-events-none select-none">
        <svg
          viewBox="0 0 800 800"
          className="w-full h-full text-stone-300 dark:text-zinc-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        >
          {/* Detailed simplified vector of India boundary scaled to 800x800 coordinate grid */}
          <path d="M 230,120 L 260,110 L 300,60 L 350,50 L 380,80 L 400,120 L 440,160 L 420,200 L 410,240 L 460,250 L 490,240 L 530,260 L 520,290 L 550,300 L 620,320 L 680,310 L 730,340 L 700,380 L 640,360 L 600,380 L 620,410 L 670,410 L 660,430 L 600,430 L 580,460 L 620,490 L 640,490 L 600,530 L 530,520 L 510,480 L 460,480 L 440,510 L 400,520 L 360,560 L 360,630 L 390,750 L 380,780 L 370,790 L 360,780 L 340,710 L 310,640 L 280,580 L 230,520 L 210,480 L 190,440 L 170,410 L 190,380 L 220,370 L 220,330 L 180,330 L 140,310 L 110,320 L 80,310 L 90,260 L 110,240 L 160,240 L 190,250 L 210,200 L 205,160 Z" />
        </svg>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 800 800"
        className="w-full h-full absolute inset-0 z-10 pointer-events-none select-none p-6"
      >
        {/* Animated Connecting Arcs */}
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1.5"
                initial={{
                  pathLength: 0,
                }}
                animate={{
                  pathLength: 1,
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.6 * i,
                  ease: "easeInOut",
                }}
                key={`start-upper-${i}`}
              ></motion.path>
            </g>
          );
        })}

        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <stop offset="20%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="80%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Pulsing City Points */}
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          
          return (
            <g key={`points-group-${i}`}>
              {/* Start Point (e.g. Ludhiana Head Office) */}
              <g key={`start-${i}`}>
                <circle cx={startPoint.x} cy={startPoint.y} r="3.5" fill={lineColor} />
                <circle cx={startPoint.x} cy={startPoint.y} r="3.5" fill={lineColor} opacity="0.6">
                  <animate attributeName="r" from="3.5" to="12" dur="2s" begin="0s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="2s" begin="0s" repeatCount="indefinite" />
                </circle>
              </g>

              {/* End Point (Project Locations) */}
              <g key={`end-${i}`}>
                <circle cx={endPoint.x} cy={endPoint.y} r="3.5" fill={lineColor} />
                <circle cx={endPoint.x} cy={endPoint.y} r="3.5" fill={lineColor} opacity="0.6">
                  <animate attributeName="r" from="3.5" to="12" dur="2s" begin="0.3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="2s" begin="0.3s" repeatCount="indefinite" />
                </circle>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

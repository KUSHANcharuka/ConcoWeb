"use client"

import React from "react"
import { MapPin } from "lucide-react"

export function WorldGlobe() {
  // SVG viewBox size: 800 x 400
  // Sri Lanka coordinates: Lat 7.87, Lng 80.77
  // x = ((lng + 180) / 360) * 800 = 579.5
  // y = ((90 - lat) / 180) * 400 = 182.5
  const pinX = 579.5
  const pinY = 182.5

  return (
    <div className="w-full bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 p-4 sm:p-8 md:p-12 relative flex items-center justify-center select-none shadow-sm">
      {/* Grid Blueprint Styling in the background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

      {/* SVG Map Container */}
      <div className="w-full max-w-[800px] aspect-[2/1] relative">
        <svg
          viewBox="0 0 800 400"
          className="w-full h-full text-zinc-800 dark:text-zinc-800 fill-zinc-900/40 stroke-zinc-800/80 stroke-[1.5]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cartographic faint lines */}
          {/* Equator */}
          <line
            x1="0"
            y1="200"
            x2="800"
            y2="200"
            stroke="currentColor"
            strokeDasharray="4 8"
            className="opacity-25"
          />
          {/* Prime Meridian */}
          <line
            x1="400"
            y1="0"
            x2="400"
            y2="400"
            stroke="currentColor"
            strokeDasharray="4 8"
            className="opacity-25"
          />

          {/* Continent Polygons */}
          {/* North America */}
          <polygon
            points="33,44 178,33 267,44 289,89 222,144 200,167 178,167 167,156 144,133 140,129 111,78 33,67"
            className="hover:fill-zinc-800/80 hover:stroke-zinc-700/80 transition-colors duration-300"
          />

          {/* Greenland */}
          <polygon
            points="244,22 333,22 356,44 289,67 244,44"
            className="hover:fill-zinc-800/80 hover:stroke-zinc-700/80 transition-colors duration-300"
          />

          {/* South America */}
          <polygon
            points="240,173 289,178 322,189 322,211 311,244 256,311 244,322 233,300 244,244 222,211"
            className="hover:fill-zinc-800/80 hover:stroke-zinc-700/80 transition-colors duration-300"
          />

          {/* Eurasia */}
          <polygon
            points="433,44 533,33 622,33 778,44 756,78 711,111 644,151 633,178 613,167 571,182 553,151 498,173 496,144 473,173 473,144 433,133 378,122 377,89 400,66"
            className="hover:fill-zinc-800/80 hover:stroke-zinc-700/80 transition-colors duration-300"
          />

          {/* Africa */}
          <polygon
            points="367,122 471,133 489,166 507,189 488,233 444,276 433,267 422,222 422,189 367,167"
            className="hover:fill-zinc-800/80 hover:stroke-zinc-700/80 transition-colors duration-300"
          />

          {/* Australia */}
          <polygon
            points="651,224 716,224 740,253 724,284 656,278 651,249"
            className="hover:fill-zinc-800/80 hover:stroke-zinc-700/80 transition-colors duration-300"
          />

          {/* Antarctica */}
          <polygon
            points="0,378 133,356 267,356 400,356 533,356 667,356 800,378 800,400 0,400"
            className="hover:fill-zinc-800/80 hover:stroke-zinc-700/80 transition-colors duration-300"
          />

          {/* Sri Lanka Glow Rings in SVG */}
          <circle
            cx={pinX}
            cy={pinY}
            r="8"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            className="animate-ping origin-center"
            style={{ transformOrigin: `${pinX}px ${pinY}px` }}
          />
          <circle
            cx={pinX}
            cy={pinY}
            r="3.5"
            fill="#f59e0b"
            className="animate-pulse"
          />
        </svg>

        {/* Floating CSS Tooltip over Sri Lanka (using percentage position to remain fully responsive) */}
        <div
          className="absolute -translate-x-1/2 -translate-y-full mb-3.5 flex flex-col items-center pointer-events-none"
          style={{ left: "72.43%", top: "45.62%" }}
        >
          {/* Tooltip box */}
          <div className="bg-zinc-900/95 dark:bg-black/90 border border-primary/45 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 whitespace-nowrap animate-bounce duration-1000">
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-ping shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider leading-none">
                Colombo Hub
              </span>
              <span className="text-zinc-50 font-extrabold text-[11px] mt-0.5 leading-none">
                Sri Lanka
              </span>
            </div>
          </div>
          {/* Triangle pointer */}
          <div className="w-2 h-2 bg-zinc-900 dark:bg-black border-r border-b border-primary/45 rotate-45 -mt-1 shadow-xs" />
        </div>
      </div>

      {/* Footer Info Overlay */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
        <span className="text-[10px] md:text-xs font-semibold tracking-wider text-zinc-500 uppercase">
          World Map View
        </span>
        <span className="text-[10px] md:text-xs font-bold tracking-wider text-primary uppercase flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          Sri Lanka HQ R&D Hub
        </span>
      </div>
    </div>
  )
}

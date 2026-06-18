"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Sparkles } from "lucide-react";

export interface CarouselItem {
  id: string | number;
  image: string;
  title: string;
  stepNumber: string;
  description: string;
  details?: string[];
}

interface CarouselProps {
  items: CarouselItem[];
  themeColor?: string; // e.g. "#ecf000"
}

export default function Carousel({ items, themeColor = "#ecf000" }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scrolling to determine the active centered card
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    const children = container.querySelectorAll("[data-carousel-card]");
    
    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, index) => {
      const card = child as HTMLDivElement;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  };

  // Scroll to a specific card index
  const scrollToCard = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.querySelectorAll("[data-carousel-card]");
    const card = children[index] as HTMLDivElement;
    if (!card) return;

    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const containerWidth = container.offsetWidth;

    container.scrollTo({
      left: cardCenter - containerWidth / 2,
      behavior: "smooth",
    });
  };

  // Set initial scroll to center card
  useEffect(() => {
    setTimeout(() => {
      scrollToCard(0);
    }, 100);
  }, []);

  const handlePrev = () => {
    const nextIdx = Math.max(0, activeIndex - 1);
    scrollToCard(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(items.length - 1, activeIndex + 1);
    scrollToCard(nextIdx);
  };

  return (
    <div className="relative w-full overflow-hidden py-12 bg-transparent select-none">
      
      {/* ─── Carousel Scroll Container ─── */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full flex gap-6 md:gap-10 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none py-10 relative z-10"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Spacer at start to allow first card to align center */}
        <div className="shrink-0 w-[calc(50vw-150px)] sm:w-[calc(50vw-180px)] md:w-[calc(50vw-200px)]" />

        {items.map((item, index) => {
          const isCenter = index === activeIndex;
          const isLeft = index < activeIndex;

          return (
            <motion.div
              key={item.id}
              data-carousel-card
              onClick={() => scrollToCard(index)}
              animate={{
                scale: isCenter ? 1.05 : 0.9,
                rotate: isCenter ? 0 : isLeft ? 5 : -5,
                y: isCenter ? -10 : 10,
                zIndex: isCenter ? 20 : 10,
              }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className={`shrink-0 w-[300px] sm:w-[360px] md:w-[380px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl relative transition-shadow duration-500 bg-zinc-900 border ${
                isCenter 
                  ? "border-lime/40 shadow-lime/10" 
                  : "border-zinc-800/80 opacity-60 hover:opacity-85 shadow-black/50"
              }`}
            >
              
              {/* Premium Phone Mockup Top Bar Header */}
              <div className="bg-zinc-950 px-6 pt-4 pb-2 flex items-center justify-between border-b border-zinc-900 text-[10px] text-zinc-400 font-medium font-sans">
                <span className="font-semibold text-white tracking-tight">9:41</span>
                
                {/* Dynamic Island Notch */}
                <div className="h-4 w-16 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-3 border border-zinc-800/60 hidden sm:block" />
                
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.07 19.58 10.47 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                  </svg>
                  <div className="w-4 h-2 bg-zinc-400 rounded-sm relative">
                    <div className="absolute right-[-2px] top-[2px] w-[2px] h-[4px] bg-zinc-400 rounded-sm" />
                  </div>
                </div>
              </div>

              {/* Main Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-950">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  draggable={false}
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating Tags */}
                <div className="absolute top-4 left-4 z-10">
                  <span 
                    className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full border shadow-sm backdrop-blur-md"
                    style={{
                      backgroundColor: isCenter ? `${themeColor}20` : "rgba(39, 39, 42, 0.6)",
                      borderColor: isCenter ? themeColor : "rgba(63, 63, 70, 0.5)",
                      color: isCenter ? "#white" : "#d4d4d8",
                    }}
                  >
                    Workflow
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 text-[9px] font-mono font-bold tracking-wider bg-black/60 border border-zinc-850 text-lime rounded-md shadow-sm">
                    STEP {item.stepNumber}
                  </span>
                </div>
              </div>

              {/* Card Content Footer */}
              <div className="p-6 bg-zinc-950 flex flex-col justify-between min-h-[190px]">
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    {isCenter && <Sparkles className="w-4 h-4 text-lime animate-pulse" />}
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Simulated Interactive elements inside mockup */}
                <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isCenter ? "bg-lime animate-ping" : "bg-zinc-700"}`} />
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                      {isCenter ? "Active Step" : "Queued"}
                    </span>
                  </div>

                  {isCenter && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-1 text-[9px] font-bold text-lime uppercase tracking-wider bg-lime/10 px-2.5 py-1 rounded-full border border-lime/30"
                    >
                      <Check className="w-3 h-3 text-lime" />
                      Ready
                    </motion.div>
                  )}
                </div>

              </div>

            </motion.div>
          );
        })}

        {/* Spacer at end to allow last card to align center */}
        <div className="shrink-0 w-[calc(50vw-150px)] sm:w-[calc(50vw-180px)] md:w-[calc(50vw-200px)]" />
      </div>

      {/* ─── Bottom Navigation Arrows and Dots ─── */}
      <div className="flex flex-col items-center gap-4 mt-6 relative z-20">
        
        {/* Progress Dots */}
        <div className="flex items-center gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToCard(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex 
                  ? "w-8 bg-lime" 
                  : "w-2 bg-zinc-700 hover:bg-zinc-500"
              }`}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className={`w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center transition-all bg-zinc-950/80 hover:bg-zinc-900 hover:border-zinc-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer`}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          
          <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
            {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>

          <button
            onClick={handleNext}
            disabled={activeIndex === items.length - 1}
            className={`w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center transition-all bg-zinc-950/80 hover:bg-zinc-900 hover:border-zinc-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer`}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

      </div>

    </div>
  );
}

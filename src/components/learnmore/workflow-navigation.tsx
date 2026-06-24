"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle, ArrowRight, FileSpreadsheet, Download, RefreshCw, Box, Layers, Coins, Cpu, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    id: 1,
    title: "Open Revit Model",
    subtitle: "Start",
    desc: "Open Revit model in Revit application.",
  },
  {
    id: 2,
    title: "Run Revit to BOQ Plugin",
    subtitle: "Step 02",
    desc: "Plugin identifies all construction elements in the model automatically.",
  },
  {
    id: 3,
    title: "Apply Measurement Rules",
    subtitle: "Step 03",
    desc: "Plugin measures each element according to standard BOQ conventions.",
  },
  {
    id: 4,
    title: "AI Predicts Rates",
    subtitle: "Step 04",
    desc: "Based on your historical project data and market rates, the tool suggests a rate for each line item.",
  },
  {
    id: 5,
    title: "BOQ Generated",
    subtitle: "Complete",
    desc: "Output is a standard BOQ in CSV, XLS, or your firm's preferred format. Ready for review, adjustment, and pricing.",
  },
];

export default function WorkflowNavigation() {
  const [activeStep, setActiveStep] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState({
    walls: false,
    slabs: false,
    columns: false,
    doors: false,
    mep: false,
  });
  const [countUp, setCountUp] = useState(0);
  const [selectedRateItem, setSelectedRateItem] = useState("concrete");

  // Auto-rotate steps (optional but good for a dynamic feel if not hovered)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Handle scans on activeStep changes
  useEffect(() => {
    if (activeStep === 1) {
      setScanning(true);
      setScannedItems({ walls: false, slabs: false, columns: false, doors: false, mep: false });
      
      const timers = [
        setTimeout(() => setScannedItems(prev => ({ ...prev, walls: true })), 600),
        setTimeout(() => setScannedItems(prev => ({ ...prev, slabs: true })), 1200),
        setTimeout(() => setScannedItems(prev => ({ ...prev, columns: true })), 1800),
        setTimeout(() => setScannedItems(prev => ({ ...prev, doors: true })), 2400),
        setTimeout(() => {
          setScannedItems(prev => ({ ...prev, mep: true }));
          setScanning(false);
        }, 3000)
      ];

      return () => timers.forEach(clearTimeout);
    }
  }, [activeStep]);

  // Count up animation for Step 4
  useEffect(() => {
    if (activeStep === 3 || activeStep === 4) {
      setCountUp(0);
      const timer = setTimeout(() => {
        let current = 0;
        const target = 45185;
        const stepTime = 15;
        const increment = Math.ceil(target / (300 / stepTime));
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCountUp(target);
            clearInterval(counter);
          } else {
            setCountUp(current);
          }
        }, stepTime);
        return () => clearInterval(counter);
      }, 200);
    }
  }, [activeStep]);

  return (
    <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950/40 border-t border-b border-zinc-200 dark:border-zinc-900 overflow-hidden relative">
      {/* Background blueprint details */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.015] dark:opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        
        {/* LEFT COLUMN: Sidebar Navigation */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-450 dark:text-zinc-550">
              Workflow Navigation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-955 dark:text-white uppercase">
              BIM to Bill Pipeline
            </h2>
          </div>

          <div className="flex flex-col space-y-4">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`text-left group flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isActive
                      ? "bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-md scale-[1.01]"
                      : "bg-transparent border-transparent hover:bg-zinc-100/50 dark:hover:bg-zinc-900/20"
                  }`}
                >
                  {/* Circle number badge */}
                  <div className="relative shrink-0 mt-0.5">
                    {/* Glowing highlight indicator under active badge */}
                    {isActive && (
                      <div className="absolute inset-[-4px] rounded-full bg-lime/40 dark:bg-lime/20 blur-sm animate-pulse" />
                    )}
                    <div
                      className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-black font-mono transition-all duration-300 border ${
                        isActive
                          ? "bg-lime text-black border-lime"
                          : "bg-white dark:bg-zinc-900 text-zinc-450 dark:text-zinc-505 border-zinc-200 dark:border-zinc-800"
                      }`}
                    >
                      {`0${step.id}`}
                    </div>
                  </div>

                  <div>
                    <h4
                      className={`text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-colors ${
                        isActive
                          ? "text-zinc-955 dark:text-white"
                          : "text-zinc-500 dark:text-zinc-455 group-hover:text-zinc-850 dark:group-hover:text-zinc-300"
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-550 leading-relaxed font-bold mt-0.5">
                      {step.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Dynamic Glassmorphic Card */}
        <div className="lg:col-span-7 w-full">
          <div className="relative bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2.5rem] p-8 sm:p-10 shadow-xl min-h-[480px] flex flex-col justify-between overflow-hidden">
            {/* Soft decorative background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-lime/5 rounded-full blur-[80px] pointer-events-none" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4">
                    <div>
                      <span className="text-[9px] font-extrabold tracking-widest text-zinc-400 dark:text-zinc-505 uppercase block mb-1">
                        Pipeline Phase 0{steps[activeStep].id}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black uppercase text-zinc-955 dark:text-white">
                        {steps[activeStep].title}
                      </h3>
                    </div>
                    <span className="text-5xl font-black font-mono opacity-10 dark:opacity-20 text-zinc-900 dark:text-white select-none">
                      {`0${steps[activeStep].id}`}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed mt-4">
                    {steps[activeStep].desc}
                  </p>
                </div>

                {/* INTERACTIVE COMPONENT DETAILS */}
                <div className="my-6 flex-1 flex items-center justify-center w-full">
                  
                  {/* Step 1: Open Revit Model */}
                  {activeStep === 0 && (
                    <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Box className="w-4 h-4 text-lime" />
                          <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Revit Integration Status</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">ACTIVE</span>
                      </div>
                      
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-900 rounded-xl space-y-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-450 dark:text-zinc-500 font-medium">Revit Version:</span>
                          <span className="font-bold text-zinc-700 dark:text-zinc-300">Autodesk Revit 2026</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-450 dark:text-zinc-500 font-medium">Model File:</span>
                          <span className="font-bold text-zinc-700 dark:text-zinc-300">Residential_Tower_C.rvt</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-450 dark:text-zinc-500 font-medium">File Size:</span>
                          <span className="font-bold text-zinc-700 dark:text-zinc-300">412 MB</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-500 bg-lime/10 border border-lime/20 p-3 rounded-xl">
                        <Check className="w-4 h-4 text-lime shrink-0" />
                        <span>Ready. Plugin resides directly on Revit ribbon panel.</span>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Run Revit to BOQ Plugin */}
                  {activeStep === 1 && (
                    <div className="w-full max-w-md bg-zinc-950 dark:bg-black rounded-2xl p-5 border border-zinc-800/80 font-mono text-[11px] text-zinc-350 shadow-inner relative overflow-hidden">
                      {scanning && (
                        <div className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-lime to-transparent shadow-[0_0_8px_rgba(163,230,53,0.8)] opacity-60 animate-[scan_2.5s_ease-in-out_infinite]" />
                      )}
                      
                      <div className="flex justify-between items-center text-zinc-500 border-b border-zinc-800/60 pb-2.5 mb-3">
                        <span className="flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-lime" />
                          element_classifier.dll
                        </span>
                        <span className={`text-[9px] px-2 py-0.5 rounded ${scanning ? 'bg-lime/10 text-lime animate-pulse' : 'bg-zinc-800 text-zinc-400'}`}>
                          {scanning ? 'SCANNING ELEMENTS...' : 'IDENTIFICATION COMPLETE'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={scannedItems.walls ? "text-white font-bold" : "text-zinc-600"}>
                            {scannedItems.walls ? "✓" : "·"} Walls (by type, material, height)
                          </span>
                          <span className="text-[9px] text-zinc-500">{scannedItems.walls ? "245 detected" : "waiting..."}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={scannedItems.slabs ? "text-white font-bold" : "text-zinc-600"}>
                            {scannedItems.slabs ? "✓" : "·"} Slabs (by area, thickness, finish)
                          </span>
                          <span className="text-[9px] text-zinc-500">{scannedItems.slabs ? "18 detected" : "waiting..."}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={scannedItems.columns ? "text-white font-bold" : "text-zinc-600"}>
                            {scannedItems.columns ? "✓" : "·"} Columns and Beams
                          </span>
                          <span className="text-[9px] text-zinc-500">{scannedItems.columns ? "142 detected" : "waiting..."}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={scannedItems.doors ? "text-white font-bold" : "text-zinc-600"}>
                            {scannedItems.doors ? "✓" : "·"} Doors and Windows
                          </span>
                          <span className="text-[9px] text-zinc-500">{scannedItems.doors ? "78 detected" : "waiting..."}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={scannedItems.mep ? "text-white font-bold" : "text-zinc-600"}>
                            {scannedItems.mep ? "✓" : "·"} MEP Elements (if configured)
                          </span>
                          <span className="text-[9px] text-zinc-500">{scannedItems.mep ? "Configured" : "waiting..."}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Apply Measurement Rules */}
                  {activeStep === 2 && (
                    <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-5 shadow-sm space-y-3.5">
                      <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2 text-xs font-bold uppercase text-zinc-450 dark:text-zinc-400">
                        <span>Standard measurement mappings</span>
                        <span className="text-[10px] text-zinc-400">SMM7 / POMI</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded-xl">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Surface Area</span>
                            <span className="text-[9px] text-zinc-400">Walls, slab finishes</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-lime">1,240.50 m²</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded-xl">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Linear Metres</span>
                            <span className="text-[9px] text-zinc-400">Beams, architectural trims</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-lime">482.30 m</span>
                        </div>

                        <div className="flex items-center justify-between p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded-xl">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Number Counts</span>
                            <span className="text-[9px] text-zinc-400">Doors, windows, sanitary fixtures</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-lime">78 Units</span>
                        </div>

                        <div className="flex items-center justify-between p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded-xl">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Volume Measurements</span>
                            <span className="text-[9px] text-zinc-400">Concrete structural cores, fill materials</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-lime">340.20 m³</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: AI Predicts Rates */}
                  {activeStep === 3 && (
                    <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200 flex items-center gap-1.5">
                          <Coins className="w-4 h-4 text-lime" />
                          Rate Card Inference
                        </span>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase">Historical Rates Engine</span>
                      </div>

                      <div className="flex gap-2">
                        {["concrete", "steel", "finish"].map((item) => (
                          <button
                            key={item}
                            onClick={() => setSelectedRateItem(item)}
                            className={`flex-1 py-1.5 text-[10px] font-extrabold uppercase rounded-lg border transition-all cursor-pointer ${
                              selectedRateItem === item
                                ? "bg-zinc-955 text-white dark:bg-white dark:text-black border-transparent"
                                : "bg-transparent text-zinc-450 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100/50"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>

                      <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-900 rounded-xl space-y-3 min-h-[96px] flex flex-col justify-center">
                        {selectedRateItem === "concrete" && (
                          <>
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-zinc-800 dark:text-zinc-200">C30 Concrete rate:</span>
                              <span className="text-lime font-mono">$150.00 / m³</span>
                            </div>
                            <div className="text-[10px] text-zinc-450 dark:text-zinc-500 leading-normal">
                              Based on 98% confidence match with <strong className="text-zinc-700 dark:text-zinc-350">Tender-Residential-C</strong>.
                            </div>
                          </>
                        )}
                        {selectedRateItem === "steel" && (
                          <>
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-zinc-800 dark:text-zinc-200">Reinforcement T16 rate:</span>
                              <span className="text-lime font-mono">$950.00 / t</span>
                            </div>
                            <div className="text-[10px] text-zinc-450 dark:text-zinc-500 leading-normal">
                              Based on 95% confidence match with <strong className="text-zinc-700 dark:text-zinc-350">Core-Substructure-B</strong>.
                            </div>
                          </>
                        )}
                        {selectedRateItem === "finish" && (
                          <>
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-zinc-800 dark:text-zinc-200">Slab Finish Formwork rate:</span>
                              <span className="text-lime font-mono">$35.00 / m²</span>
                            </div>
                            <div className="text-[10px] text-zinc-450 dark:text-zinc-500 leading-normal">
                              Based on 96% confidence match with <strong className="text-zinc-700 dark:text-zinc-350">Tower-A-Finishes</strong>.
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 5: BOQ Generated */}
                  {activeStep === 4 && (
                    <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden text-[10px] sm:text-xs">
                      <div className="bg-zinc-100 dark:bg-zinc-950 p-3 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800">
                        <span className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                          residential_tower_boq.xlsx
                        </span>
                        <span className="text-[9px] font-bold text-zinc-400">Tender-ready</span>
                      </div>
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-zinc-50 dark:bg-zinc-905 border-b border-zinc-250 dark:border-zinc-850 text-zinc-450 text-[9px] uppercase font-extrabold">
                            <th className="p-2.5 pl-4">Description</th>
                            <th className="p-2.5">Unit</th>
                            <th className="p-2.5">Qty</th>
                            <th className="p-2.5">Rate</th>
                            <th className="p-2.5 pr-4 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850 font-medium">
                          <tr>
                            <td className="p-2.5 pl-4 text-zinc-900 dark:text-zinc-150">C30 Concrete Walls</td>
                            <td className="p-2.5 text-zinc-500">m³</td>
                            <td className="p-2.5 text-zinc-800 dark:text-zinc-200">124.50</td>
                            <td className="p-2.5 text-zinc-500">$150.00</td>
                            <td className="p-2.5 pr-4 text-right text-zinc-800 dark:text-zinc-200 font-semibold">$18,675.00</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 pl-4 text-zinc-900 dark:text-zinc-150">Reinforcement T16</td>
                            <td className="p-2.5 text-zinc-500">t</td>
                            <td className="p-2.5 text-zinc-800 dark:text-zinc-200">12.80</td>
                            <td className="p-2.5 text-zinc-500">$950.00</td>
                            <td className="p-2.5 pr-4 text-right text-zinc-800 dark:text-zinc-200 font-semibold">$12,160.00</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 pl-4 text-zinc-900 dark:text-zinc-150">Formwork (Rough)</td>
                            <td className="p-2.5 text-zinc-500">m²</td>
                            <td className="p-2.5 text-zinc-800 dark:text-zinc-200">410.00</td>
                            <td className="p-2.5 text-zinc-500">$35.00</td>
                            <td className="p-2.5 pr-4 text-right text-zinc-800 dark:text-zinc-200 font-semibold">$14,350.00</td>
                          </tr>
                          <tr className="bg-lime/5 font-extrabold text-[11px] sm:text-xs">
                            <td colSpan={4} className="p-2.5 pl-4 text-zinc-900 dark:text-white uppercase tracking-wider">Estimated Total</td>
                            <td className="p-2.5 pr-4 text-right text-lime font-black">
                              ${countUp.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>

                {/* Card footer CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-5">
                  {activeStep === 4 ? (
                    <>
                      <div className="text-center sm:text-left">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-505 block mb-0.5">
                          Download options
                        </span>
                        <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200">
                          Export model takeoff tables natively in Excel, CSV, or PDF.
                        </span>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-4 bg-white dark:bg-zinc-950 font-extrabold text-[10px] tracking-wider uppercase shadow-sm cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> CSV
                        </Button>
                        <Button
                          className="flex-1 sm:flex-initial bg-lime text-black hover:bg-lime/90 font-extrabold text-[10px] tracking-wider px-6 py-4.5 rounded-xl uppercase shadow-md cursor-pointer border-0 shrink-0"
                        >
                          Export XLS
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center sm:text-left">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-505 block mb-0.5">
                          Ready to integrate?
                        </span>
                        <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200">
                          Deploy in under 1 week onto your corporate Revit workstations.
                        </span>
                      </div>
                      <Button
                        asChild
                        className="w-full sm:w-auto bg-lime text-black hover:bg-lime/90 font-extrabold text-[10px] tracking-wider px-6 py-4.5 rounded-xl uppercase shadow-md cursor-pointer border-0 shrink-0"
                      >
                        <a
                          href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Book a demo →
                        </a>
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Embedded CSS for parsing cursor scan animation */}
      <style jsx>{`
        @keyframes scan {
          0%, 100% {
            top: 5px;
          }
          50% {
            top: calc(100% - 7px);
          }
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}

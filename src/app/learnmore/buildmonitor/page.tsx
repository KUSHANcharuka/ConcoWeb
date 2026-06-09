"use client";

import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer";
import {
  motion,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Check,
  X,
  FileText,
  FileSearch,
  Layers,
  BarChart3,
  Wrench,
  Scale,
  Hammer,
  Ruler,
  Cog,
  BrainCircuit,
  Store,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BuildmonitorPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-lime/30 selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-20 max-w-6xl mx-auto">
        <Link
          href="/learnmore"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors group mb-10"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Learn More
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-200/50 dark:bg-zinc-800 border border-zinc-350 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                Active Regions: Middle East, Sri Lanka
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
              BuildMonitor Mobile App
            </h1>

            <p className="text-xl sm:text-2xl text-zinc-500 font-medium leading-normal">
              Daily progress reports that write themselves
            </p>

            <p className="text-base sm:text-lg text-zinc-650 dark:text-zinc-400 leading-relaxed max-w-xl">
              Site personnel record progress on mobile — photos, quantities, activities. Daily Progress Report generates automatically in your contract's required format. No additional input needed.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="rounded-xl px-6 py-6 font-bold shadow-md cursor-pointer bg-primary text-black hover:bg-primary/90"
              >
                <a
                  href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book a demo →
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              The Challenge
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Reports that write themselves
            </h2>
            <div className="w-16 h-1 bg-[var(--color-lime)] rounded-full" />
          </div>
          <div className="lg:col-span-7 text-zinc-650 dark:text-zinc-450 text-base sm:text-lg leading-relaxed space-y-6">
            <p>Site engineers spend hours each day compiling progress reports instead of managing actual construction work.</p><p>BuildMonitor captures site data on mobile and generates Daily Progress Reports automatically in your contract format.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">
            Key Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-xs">
              <h3 className="font-bold text-base text-zinc-950 dark:text-zinc-50">Mobile-First Data Capture</h3>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-xs">
              <h3 className="font-bold text-base text-zinc-950 dark:text-zinc-50">Auto-Generated Reports</h3>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-xs">
              <h3 className="font-bold text-base text-zinc-950 dark:text-zinc-50">Contract Format Compliance</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
            Daily reports that write themselves.
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            See how BuildMonitor turns site data into formatted reports.
          </p>
          <div className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-xl px-8 py-6 font-bold shadow-md bg-primary text-black hover:bg-primary/90 cursor-pointer"
            >
              <a
                href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a demo →
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

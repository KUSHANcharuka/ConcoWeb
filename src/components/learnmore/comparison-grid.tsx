"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import Link from "next/link";

export interface FeatureItem {
  text: string;
  type?: "check" | "x";
}

export interface CardData {
  title: string;
  subtitle: string;
  badge?: string;
  features: (string | FeatureItem)[];
  metric?: {
    value: string;
    label?: string;
  };
  button: {
    text: string;
    href: string;
  };
}

interface ComparisonGridProps {
  sectionTitle: string;
  card1: CardData;
  card2: CardData;
  card3: CardData;
}

export default function ComparisonGrid({
  sectionTitle,
  card1,
  card2,
  card3,
}: ComparisonGridProps) {
  
  const renderMetric = (metric?: { value: string; label?: string }) => {
    if (!metric || !metric.value) return null;

    const valUpper = metric.value.toUpperCase();
    const lblUpper = metric.label ? metric.label.toUpperCase() : "";

    // Special case for FAST / UNRELIABLE
    if (valUpper.includes("UNRELIABLE") || lblUpper.includes("FAST") || valUpper.includes("FAST")) {
      return (
        <div className="text-center mb-6 select-none leading-none">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">
            FAST /
          </span>
          <span className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
            UNRELIABLE
          </span>
        </div>
      );
    }

    return (
      <div className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase text-center mb-6 select-none">
        {metric.value}{" "}
        {metric.label && (
          <span className="text-xs font-bold text-zinc-450 dark:text-zinc-500">
            {metric.label}
          </span>
        )}
      </div>
    );
  };

  const renderCard = (card: CardData, index: number) => {
    const isRecommended = index === 1;

    // Card custom styles
    let borderStyles = "";
    let buttonStyles = "";
    let animationStyles = "";
    let lineBg = "";

    if (index === 0) {
      // Traditional / Left card
      borderStyles = "border-t-8 border-b-8 border-t-zinc-300 border-b-zinc-300 dark:border-t-zinc-700 dark:border-b-zinc-700 border-x border-zinc-200 dark:border-zinc-800 md:scale-95 md:translate-x-2";
      buttonStyles = "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100";
      animationStyles = "md:scale-95 md:translate-x-2 min-h-[520px]";
      lineBg = "bg-zinc-300/40 dark:bg-zinc-700/40";
    } else if (index === 1) {
      // Concolabs Recommended / Middle card
      borderStyles = "border-t-8 border-b-8 border-t-zinc-900 border-b-zinc-900 dark:border-t-zinc-100 dark:border-b-zinc-100 border-x border-zinc-300 dark:border-zinc-750 md:scale-105 z-10 shadow-2xl";
      buttonStyles = "bg-zinc-900 hover:bg-zinc-850 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-black";
      animationStyles = "md:scale-105 z-10 min-h-[560px]";
      lineBg = "bg-zinc-400/60 dark:bg-zinc-600/60";
    } else {
      // General AI / Right card
      borderStyles = "border-t-8 border-b-8 border-t-zinc-400 border-b-zinc-400 dark:border-t-zinc-600 dark:border-b-zinc-650 border-x border-zinc-200 dark:border-zinc-800 md:scale-95 md:-translate-x-2";
      buttonStyles = "bg-zinc-200 hover:bg-zinc-300 text-zinc-800 dark:bg-zinc-750 dark:hover:bg-zinc-650 dark:text-zinc-200";
      animationStyles = "md:scale-95 md:-translate-x-2 min-h-[520px]";
      lineBg = "bg-zinc-350/40 dark:bg-zinc-700/40";
    }

    if (card.button.text.toLowerCase().includes("book") && card.button.text.toLowerCase().includes("demo")) {
      buttonStyles = "bg-[#FFEF1A] text-black hover:bg-[#FFEF1A]/90 border-0 transition-colors duration-300";
    }

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -6, scale: isRecommended ? 1.06 : 1.01 }}
        className={`relative p-8 rounded-2xl bg-white dark:bg-zinc-900 flex flex-col justify-between shadow-lg transition-all duration-300 ${borderStyles} ${animationStyles}`}
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center w-full">
            <div className={`h-[2px] flex-1 ${lineBg}`} />
            <h4 className="px-4 text-sm font-black tracking-widest text-zinc-900 dark:text-white uppercase font-sans text-center whitespace-nowrap">
              {card.title}
            </h4>
            <div className={`h-[2px] flex-1 ${lineBg}`} />
          </div>
          <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest mt-1.5 text-center">
            {card.subtitle}
          </span>
        </div>

        <ul className="space-y-0 my-8 flex-1 flex flex-col justify-center">
          {card.features.map((feature, fIdx) => {
            const isObj = typeof feature === "object";
            const text = isObj ? feature.text : feature;
            // Default to 'check' for middle card, 'x' for left/right
            const type = isObj ? feature.type : (isRecommended ? "check" : "x");

            return (
              <li
                key={fIdx}
                className="py-4 border-b border-zinc-100 dark:border-zinc-800/40 flex items-center justify-center gap-2 text-sm text-zinc-650 dark:text-zinc-450 text-center font-medium leading-relaxed last:border-b-0"
              >
                {type === "check" ? (
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <span>{text}</span>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col items-center">
          {renderMetric(card.metric)}
          
          {isRecommended && (
            card.button.href.startsWith("http") ? (
              <a
                href={card.button.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full max-w-[200px] py-3 text-center font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0 rounded-sm ${buttonStyles}`}
              >
                {card.button.text}
              </a>
            ) : (
              <Link
                href={card.button.href}
                className={`w-full max-w-[200px] py-3 text-center font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0 rounded-sm ${buttonStyles}`}
              >
                {card.button.text}
              </Link>
            )
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <section className="bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
            Comparative Advantage
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            {sectionTitle}
          </h2>
        </div>

        <div className="relative pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 px-4 items-stretch max-w-5xl mx-auto pt-6">
            {renderCard(card1, 0)}
            {renderCard(card2, 1)}
            {renderCard(card3, 2)}
          </div>
        </div>
      </div>
    </section>
  );
}

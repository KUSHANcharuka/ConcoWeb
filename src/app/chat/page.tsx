"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  HardHat,
  Sparkles,
  RotateCcw,
  ArrowLeft,
  ChevronDown,
  Zap,
  Shield,
  Clock,
  Check,
  FileText,
  Calendar,
  Layers,
  Building2,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PRODUCTS,
  ROLES,
  STORY,
  calculateROI,
  type Product,
} from "@/lib/chatbot-data";

const BRAND_YELLOW = "#FFEF1A";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type MessageType =
  | "text"
  | "chips"
  | "product_card"
  | "story_card"
  | "roi_card"
  | "pricing_card"
  | "proposal_form"
  | "booking_grid"
  | "booking_confirmed";

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  type: MessageType;
  content?: string;
  chips?: Array<{ label: string; action: () => void }>;
  productKey?: string;
  whyMatch?: string;
  bookingTime?: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  { emoji: "📐", label: "BOQ Automation", text: "How does Quanto automate BOQ take-offs?" },
  { emoji: "💰", label: "Calculate ROI", text: "Calculate my team's ROI and time savings" },
  { emoji: "🤖", label: "BuilderBot AI", text: "What can BuilderBot AI do for contract review?" },
  { emoji: "📋", label: "Planning Regulations", text: "How does the Planning Law Chatbot work?" },
  { emoji: "📱", label: "Site Progress", text: "How does BuildMonitor mobile reporting work?" },
  { emoji: "💡", label: "Explore Solutions", text: "Help me find the right tool for my role" },
];

const STAGE_NAMES = ["Diagnose", "Recommend", "Prove", "Proposal"];

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function ProgressRail({ currentStage }: { currentStage: number }) {
  return (
    <div className="flex items-center justify-between gap-2 px-4 sm:px-8 py-2.5 bg-gray-50/80 border-b border-gray-100">
      {STAGE_NAMES.map((name, idx) => {
        const stageNum = idx + 1;
        const isActive = currentStage === stageNum;
        const isDone = currentStage > stageNum;

        return (
          <div key={name} className="flex-1 text-center relative pt-2">
            <div
              className={`absolute top-0 left-0 right-0 h-1 rounded-full transition-colors duration-300 ${
                isDone
                  ? "bg-black"
                  : isActive
                  ? "bg-[#FFEF1A]"
                  : "bg-gray-200"
              }`}
            />
            <span
              className={`text-[11px] font-semibold tracking-wide transition-colors ${
                isActive || isDone ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {stageNum}. {name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 mb-6">
      <div
        className="flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center shadow-md"
        style={{ background: BRAND_YELLOW }}
      >
        <Bot className="w-4 h-4 text-black" strokeWidth={2.2} />
      </div>
      <div className="bg-white border border-gray-150 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-gray-400"
              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCardComponent({
  productKey,
  whyMatch,
  onAddProposal,
  isAdded,
  onExplore,
}: {
  productKey: string;
  whyMatch?: string;
  onAddProposal: (key: string) => void;
  isAdded: boolean;
  onExplore: (key: string) => void;
}) {
  const p: Product | undefined = PRODUCTS[productKey];
  if (!p) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="bg-white border border-gray-200 rounded-2xl p-4 my-2 max-w-md shadow-sm"
    >
      <div className="flex items-center gap-2.5 font-bold text-sm text-gray-900">
        <span className="w-7 h-7 rounded-lg bg-gray-100 text-black flex items-center justify-center text-xs font-black">
          {p.glyph}
        </span>
        <span className="flex-1">{p.name}</span>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            p.badge[1] === "rnd"
              ? "bg-purple-100 text-purple-700"
              : p.badge[1] === "scaling"
              ? "bg-amber-100 text-amber-800"
              : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {p.badge[0]}
        </span>
      </div>

      <p className="text-xs text-gray-600 mt-2 font-medium">{p.vp}</p>

      <ul className="mt-2.5 space-y-1 text-xs text-gray-700 pl-4 list-disc">
        {p.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {p.tags.map((t) => (
          <span key={t} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium">
            {t}
          </span>
        ))}
      </div>

      {whyMatch && (
        <div className="mt-3 text-xs text-amber-900 bg-amber-50 border-l-2 border-amber-400 p-2 rounded-r-md">
          Why you: matches &ldquo;{whyMatch}&rdquo;.
        </div>
      )}

      <div className="flex gap-2 mt-3.5 pt-2 border-t border-gray-100">
        <button
          onClick={() => onExplore(productKey)}
          className="flex-1 py-2 text-xs font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
        >
          Explore
        </button>
        <button
          onClick={() => onAddProposal(productKey)}
          disabled={isAdded}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            isAdded
              ? "bg-emerald-100 text-emerald-800 cursor-default"
              : "bg-[#FFEF1A] text-black hover:bg-[#f5e500] shadow-sm"
          }`}
        >
          {isAdded ? "✓ Added" : "+ Add to proposal"}
        </button>
      </div>
    </motion.div>
  );
}

function ROICalculatorComponent({
  onAttachROI,
  isAttached,
}: {
  onAttachROI: () => void;
  isAttached: boolean;
}) {
  const [estimates, setEstimates] = useState(8);
  const [hours, setHours] = useState(20);
  const [rate, setRate] = useState(45);

  const { savedHours, savedCost } = calculateROI(estimates, hours, rate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-4 my-2 max-w-md shadow-sm space-y-3.5"
    >
      <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
        <Zap className="w-4 h-4 text-amber-500" />
        <span>Interactive ROI Estimator</span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-gray-700 font-medium mb-1">
            <span>Estimates / month</span>
            <span className="font-bold text-black">{estimates}</span>
          </div>
          <input
            type="range"
            min="1"
            max="40"
            value={estimates}
            onChange={(e) => setEstimates(Number(e.target.value))}
            className="w-full accent-black h-1.5 bg-gray-200 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-700 font-medium mb-1">
            <span>Hours per estimate</span>
            <span className="font-bold text-black">{hours} hrs</span>
          </div>
          <input
            type="range"
            min="2"
            max="80"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full accent-black h-1.5 bg-gray-200 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-700 font-medium mb-1">
            <span>Blended rate / hr</span>
            <span className="font-bold text-black">${rate}</span>
          </div>
          <input
            type="range"
            min="15"
            max="120"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-black h-1.5 bg-gray-200 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-150 rounded-xl p-3 text-center">
        <div className="text-sm font-extrabold text-gray-900">
          ≈ <span className="text-amber-600">{savedHours} hrs</span> &nbsp;·&nbsp;{" "}
          <span className="text-emerald-600">${savedCost.toLocaleString()}</span> saved / mo
        </div>
        <p className="text-[10px] text-gray-500 mt-1">
          Assumes Concolabs tools eliminate ~85% of manual take-off and admin drag.
        </p>
      </div>

      <button
        onClick={onAttachROI}
        disabled={isAttached}
        className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all ${
          isAttached
            ? "bg-emerald-100 text-emerald-800 cursor-default"
            : "bg-[#FFEF1A] text-black hover:bg-[#f5e500] shadow-sm"
        }`}
      >
        {isAttached ? "✓ ROI attached to proposal" : "Add ROI to proposal"}
      </button>
    </motion.div>
  );
}

function ProposalFormComponent({
  proposalKeys,
  roiAttached,
  onGenerate,
}: {
  proposalKeys: string[];
  roiAttached: boolean;
  onGenerate: (data: { name: string; company: string; email: string }) => void;
}) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError(true);
      return;
    }
    setError(false);
    setIsSubmitting(true);
    setTimeout(() => {
      onGenerate({ name, company, email });
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-4 my-2 max-w-md shadow-sm"
    >
      <div className="flex items-center gap-2 font-bold text-sm text-gray-900 border-b border-gray-100 pb-2.5 mb-3">
        <FileText className="w-4 h-4 text-black" />
        <span>Your Custom Proposal</span>
      </div>

      <ul className="text-xs text-gray-700 space-y-1.5 mb-4 pl-4 list-disc">
        {proposalKeys.map((k) => (
          <li key={k} className="font-semibold text-gray-900">
            {PRODUCTS[k]?.name || k}
          </li>
        ))}
        {roiAttached && <li className="text-emerald-700 font-semibold">ROI calculation estimate (attached)</li>}
      </ul>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Full Name</label>
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus-within:border-black focus-within:bg-white transition-all">
            <User className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Jane Surveyor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs bg-transparent outline-none text-gray-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Company</label>
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus-within:border-black focus-within:bg-white transition-all">
              <Building2 className="w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Firm Ltd"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full text-xs bg-transparent outline-none text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Work Email</label>
            <div
              className={`flex items-center gap-2 px-3 py-2 border rounded-xl bg-gray-50 focus-within:bg-white transition-all ${
                error ? "border-red-500" : "border-gray-200 focus-within:border-black"
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <input
                type="email"
                placeholder="jane@firm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs bg-transparent outline-none text-gray-900"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 text-xs font-bold rounded-xl bg-[#FFEF1A] text-black hover:bg-[#f5e500] shadow-sm transition-all disabled:opacity-60 mt-1"
        >
          {isSubmitting ? "Building your proposal..." : "Generate proposal PDF"}
        </button>
      </form>
    </motion.div>
  );
}

function BookingGridComponent({ onSelectSlot }: { onSelectSlot: (slot: string) => void }) {
  const slots = [
    { day: "Mon 29", time: "09:00" },
    { day: "Tue 30", time: "10:30" },
    { day: "Wed 1", time: "13:00" },
    { day: "Thu 2", time: "15:30" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-4 my-2 max-w-md shadow-sm"
    >
      <div className="flex items-center gap-2 font-bold text-sm text-gray-900 mb-3">
        <Calendar className="w-4 h-4 text-black" />
        <span>Pick a 30-min Walkthrough Slot</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {slots.map((s) => {
          const slotStr = `${s.day} · ${s.time}`;
          return (
            <button
              key={slotStr}
              onClick={() => onSelectSlot(slotStr)}
              className="p-2 border border-gray-200 rounded-xl text-center hover:bg-black hover:text-white hover:border-black transition-all group"
            >
              <div className="text-xs font-bold text-gray-900 group-hover:text-white">{s.time}</div>
              <div className="text-[10px] text-gray-500 group-hover:text-gray-300 mt-0.5">{s.day}</div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────

export default function ChatPage() {
  const router = useRouter();
  const [stage, setStage] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [proposal, setProposal] = useState<Set<string>>(new Set());
  const [roiAttached, setRoiAttached] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<MessageItem[]>([]);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }, []);

  useEffect(() => {
    scrollToBottom(false);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Initial Welcome Flow
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          type: "text",
          content:
            "Hi — I help construction teams cut admin out of their day. To point you to the right tools, what's your role?",
          timestamp: new Date(),
        },
        {
          id: "welcome-chips",
          role: "assistant",
          type: "chips",
          chips: Object.keys(ROLES).map((roleName) => ({
            label: roleName,
            action: () => handlePickRole(roleName),
          })),
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  const addAssistantMessage = useCallback(
    (msg: Partial<MessageItem>, delay = 600) => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            role: "assistant",
            type: "text",
            timestamp: new Date(),
            ...msg,
          },
        ]);
      }, delay);
    },
    []
  );

  const handlePickRole = (roleName: string) => {
    setSelectedRole(roleName);
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        type: "text",
        content: roleName,
        timestamp: new Date(),
      },
    ]);

    const painPoints = ROLES[roleName] || [];

    addAssistantMessage(
      {
        content: "Got it. What's eating the most time right now?",
      },
      500
    );

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `chips-${Date.now()}`,
          role: "assistant",
          type: "chips",
          chips: [
            ...painPoints.map(([pain, keys]) => ({
              label: pain,
              action: () => handlePickPain(pain, keys),
            })),
            {
              label: "Something else…",
              action: () => {
                inputRef.current?.focus();
                addAssistantMessage({
                  content: "Sure — type it in your own words and I'll find the closest tool.",
                });
              },
            },
          ],
          timestamp: new Date(),
        },
      ]);
    }, 1100);
  };

  const handlePickPain = (painText: string, keys: string[]) => {
    setStage(2);
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        type: "text",
        content: painText,
        timestamp: new Date(),
      },
    ]);

    addAssistantMessage(
      {
        content: `That's exactly what we remove. Here ${
          keys.length > 1 ? "are the closest fits" : "is the closest fit"
        }, strongest match first:`,
      },
      600
    );

    setTimeout(() => {
      const cardMsgs: MessageItem[] = keys.map((key, idx) => ({
        id: `card-${key}-${Date.now()}`,
        role: "assistant",
        type: "product_card",
        productKey: key,
        whyMatch: idx === 0 ? painText : undefined,
        timestamp: new Date(),
      }));

      const followUpChips: MessageItem = {
        id: `followup-${Date.now()}`,
        role: "assistant",
        type: "chips",
        chips: [
          { label: "Show me a customer story", action: handleShowStory },
          { label: "Calculate my ROI", action: handleShowROI },
          { label: "What does it cost?", action: () => handleShowPricing(keys[0]!) },
        ],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, ...cardMsgs, followUpChips]);
    }, 1200);
  };

  const handleExploreProduct = (key: string) => {
    const p = PRODUCTS[key];
    if (!p) return;
    addAssistantMessage({
      content: `**${p.name}.** ${p.vp} ${p.bullets.join(". ")}. Available for: ${p.tags.join(
        ", "
      )}.`,
    });
  };

  const handleAddProposal = (key: string) => {
    setProposal((prev) => new Set(prev).add(key));
    setStage((prev) => Math.max(prev, 3));
  };

  const handleShowStory = () => {
    setStage((prev) => Math.max(prev, 3));
    setMessages((prev) => [
      ...prev,
      {
        id: `user-story-${Date.now()}`,
        role: "user",
        type: "text",
        content: "Show me a customer story",
        timestamp: new Date(),
      },
    ]);

    addAssistantMessage(
      {
        content: `A ${STORY.region.split("·")[0]?.trim()} in the UAE cut estimating time dramatically:`,
      },
      500
    );

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `story-${Date.now()}`,
          role: "assistant",
          type: "story_card",
          timestamp: new Date(),
        },
      ]);
    }, 1100);
  };

  const handleShowROI = () => {
    setStage((prev) => Math.max(prev, 3));
    setMessages((prev) => [
      ...prev,
      {
        id: `user-roi-${Date.now()}`,
        role: "user",
        type: "text",
        content: "Calculate my ROI",
        timestamp: new Date(),
      },
    ]);

    addAssistantMessage(
      {
        content: "Let's estimate your own saving. Adjust the sliders:",
      },
      500
    );

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `roi-${Date.now()}`,
          role: "assistant",
          type: "roi_card",
          timestamp: new Date(),
        },
      ]);
    }, 1100);
  };

  const handleShowPricing = (key: string) => {
    const p = PRODUCTS[key];
    if (!p) return;
    setStage((prev) => Math.max(prev, 3));
    setMessages((prev) => [
      ...prev,
      {
        id: `user-price-${Date.now()}`,
        role: "user",
        type: "text",
        content: `What does ${p.name} cost?`,
        timestamp: new Date(),
      },
    ]);

    addAssistantMessage(
      {
        content: `Here's how **${p.name}** is priced:`,
      },
      500
    );

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `pricing-${Date.now()}`,
          role: "assistant",
          type: "pricing_card",
          productKey: key,
          timestamp: new Date(),
        },
      ]);
    }, 1100);
  };

  const handleBuildProposal = () => {
    if (proposal.size === 0) {
      addAssistantMessage({
        content:
          "Add at least one tool first and I'll build a proposal. Want a recommendation? Just pick your role!",
      });
      return;
    }

    setStage(4);
    addAssistantMessage(
      {
        content: "Here's your proposal so far. Add your details and I'll generate it.",
      },
      400
    );

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `proposal-form-${Date.now()}`,
          role: "assistant",
          type: "proposal_form",
          timestamp: new Date(),
        },
      ]);
    }, 900);
  };

  const handleProposalGenerated = () => {
    addAssistantMessage({
      content:
        "Proposal ready ✓ &nbsp; [Download PDF (#) · Email it to me (#)]\n\nLet's lock in a demo walkthrough next!",
    });
    setTimeout(() => {
      handleStartBooking();
    }, 1000);
  };

  const handleStartBooking = () => {
    setStage(4);
    addAssistantMessage(
      {
        content: "Let's lock in a 30-minute walkthrough. Pick a time that suits you:",
      },
      400
    );

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `booking-grid-${Date.now()}`,
          role: "assistant",
          type: "booking_grid",
          timestamp: new Date(),
        },
      ]);
    }, 900);
  };

  const handleConfirmBooking = (slotStr: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `user-slot-${Date.now()}`,
        role: "user",
        type: "text",
        content: slotStr,
        timestamp: new Date(),
      },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `confirmed-${Date.now()}`,
          role: "assistant",
          type: "booking_confirmed",
          bookingTime: slotStr,
          timestamp: new Date(),
        },
      ]);

      addAssistantMessage({
        content: "All set! Anything else you'd like to explore before the call?",
      });
    }, 600);
  };

  // Free text intent router
  const sendUserMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setInput("");
      setMessages((prev) => [
        ...prev,
        {
          id: `user-txt-${Date.now()}`,
          role: "user",
          type: "text",
          content: trimmed,
          timestamp: new Date(),
        },
      ]);

      const t = trimmed.toLowerCase();

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);

        if (/price|cost|how much/.test(t)) {
          const k = proposal.size ? Array.from(proposal)[0]! : "quanto2d";
          handleShowPricing(k);
          return;
        }
        if (/roi|save|saving|worth/.test(t)) {
          handleShowROI();
          return;
        }
        if (/story|customer|case|reference/.test(t)) {
          handleShowStory();
          return;
        }
        if (/book|demo|call|meeting|schedule/.test(t)) {
          handleStartBooking();
          return;
        }
        if (/proposal|quote/.test(t)) {
          handleBuildProposal();
          return;
        }

        // Product matching
        for (const k in PRODUCTS) {
          const p = PRODUCTS[k]!;
          if (
            t.includes(p.name.toLowerCase()) ||
            p.name.toLowerCase().split(" ").some((w) => w.length > 4 && t.includes(w))
          ) {
            setMessages((prev) => [
              ...prev,
              {
                id: `bot-p-${Date.now()}`,
                role: "assistant",
                type: "text",
                content: `**${p.name}** — ${p.vp}`,
                timestamp: new Date(),
              },
              {
                id: `card-p-${Date.now()}`,
                role: "assistant",
                type: "product_card",
                productKey: k,
                timestamp: new Date(),
              },
            ]);
            return;
          }
        }

        if (/offline|sync/.test(t)) {
          addAssistantMessage({
            content:
              "Several tools are offline-first — **BuildMonitor** and **MeasureonAir** sync site-to-office automatically when you're back online.",
          });
          return;
        }

        if (/fidic|contract|legal/.test(t)) {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-fid-${Date.now()}`,
              role: "assistant",
              type: "text",
              content:
                "**BuilderBot.ai** is FIDIC-trained and returns clause-referenced answers across your contracts, 3D models and project records.",
              timestamp: new Date(),
            },
            {
              id: `card-fid-${Date.now()}`,
              role: "assistant",
              type: "product_card",
              productKey: "builderbot",
              timestamp: new Date(),
            },
          ]);
          return;
        }

        // Fallback
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-fallback-${Date.now()}`,
            role: "assistant",
            type: "text",
            content: "Good question. To point you to the right tool, which best describes your role?",
            timestamp: new Date(),
          },
          {
            id: `fallback-chips-${Date.now()}`,
            role: "assistant",
            type: "chips",
            chips: Object.keys(ROLES).map((r) => ({
              label: r,
              action: () => handlePickRole(r),
            })),
            timestamp: new Date(),
          },
        ]);
      }, 700);
    },
    [proposal, addAssistantMessage]
  );

  const handleReset = () => {
    setStage(1);
    setSelectedRole(null);
    setProposal(new Set());
    setRoiAttached(false);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        type: "text",
        content:
          "Hi — I help construction teams cut admin out of their day. To point you to the right tools, what's your role?",
        timestamp: new Date(),
      },
      {
        id: `welcome-chips-${Date.now()}`,
        role: "assistant",
        type: "chips",
        chips: Object.keys(ROLES).map((r) => ({
          label: r,
          action: () => handlePickRole(r),
        })),
        timestamp: new Date(),
      },
    ]);
  };

  const renderMessageContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const rendered = parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-bold text-gray-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      });
      return (
        <span key={lineIdx}>
          {rendered}
          {lineIdx < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#FAFAF8] text-gray-900 font-sans">
      {/* ── Header ── */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-gray-100"
        style={{
          background: "linear-gradient(135deg, #111111 0%, #1e1e1e 100%)",
        }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
        >
          <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </span>
          <span className="hidden sm:inline">Go back</span>
        </button>

        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-md font-extrabold text-black"
            style={{ background: BRAND_YELLOW }}
          >
            C
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-white leading-tight">Conco Assistant</p>
              <Sparkles className="w-3.5 h-3.5 text-[#FFEF1A]" />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-gray-400">Online · Instant AI advice</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-200 transition-colors"
          title="Reset conversation"
        >
          <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
            <RotateCcw className="w-4 h-4" />
          </span>
          <span className="hidden sm:inline">Restart</span>
        </button>
      </header>

      {/* Progress Rail */}
      <ProgressRail currentStage={stage} />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 xl:w-80 border-r border-gray-150 bg-white p-6 gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-3">
              Quick Scenarios
            </p>
            <div className="flex flex-col gap-1.5">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => void sendUserMessage(p.text)}
                  className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-all group"
                >
                  <span className="text-base">{p.emoji}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <div className="rounded-2xl p-4 bg-gray-900 text-white shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold text-[#FFEF1A] mb-1">
                <Layers className="w-4 h-4" />
                <span>Custom Proposal</span>
              </div>
              <p className="text-xs text-gray-300 mb-3">
                {proposal.size} tool{proposal.size !== 1 ? "s" : ""} selected
                {roiAttached ? " · ROI attached" : ""}.
              </p>
              <button
                onClick={handleBuildProposal}
                className="w-full text-center text-xs font-bold py-2 rounded-xl bg-[#FFEF1A] text-black hover:bg-[#f5e500] transition-colors"
              >
                Build Proposal →
              </button>
            </div>
          </div>
        </aside>

        {/* Chat Stream Column */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden relative">
            <div
              ref={scrollAreaRef}
              className="h-full overflow-y-auto px-4 sm:px-8 lg:px-12 py-6"
              style={{ scrollbarWidth: "thin" }}
            >
              <div className="max-w-2xl mx-auto">
                {messages.map((msg) => {
                  const isUser = msg.role === "user";

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-end gap-2.5 mb-4 ${
                        isUser ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {!isUser ? (
                        <div
                          className="flex-shrink-0 w-8 h-8 rounded-2xl flex items-center justify-center shadow-sm font-extrabold text-xs text-black"
                          style={{ background: BRAND_YELLOW }}
                        >
                          C
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-8 h-8 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-sm">
                          <HardHat className="w-4 h-4" />
                        </div>
                      )}

                      <div className="max-w-[85%] sm:max-w-[75%]">
                        {/* Text Type */}
                        {msg.type === "text" && msg.content && (
                          <div
                            className={`rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                              isUser
                                ? "bg-gray-150 text-gray-900 rounded-br-xs font-medium"
                                : "bg-white border border-gray-200 text-gray-800 rounded-bl-xs"
                            }`}
                          >
                            {renderMessageContent(msg.content)}
                          </div>
                        )}

                        {/* Chips Type */}
                        {msg.type === "chips" && msg.chips && (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {msg.chips.map((chip, i) => (
                              <button
                                key={i}
                                onClick={chip.action}
                                className="px-3.5 py-2 text-xs font-semibold rounded-full border border-black text-black bg-white hover:bg-black hover:text-white transition-all shadow-xs"
                              >
                                {chip.label}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Product Card Type */}
                        {msg.type === "product_card" && msg.productKey && (
                          <ProductCardComponent
                            productKey={msg.productKey}
                            whyMatch={msg.whyMatch}
                            onAddProposal={handleAddProposal}
                            isAdded={proposal.has(msg.productKey)}
                            onExplore={handleExploreProduct}
                          />
                        )}

                        {/* Story Card Type */}
                        {msg.type === "story_card" && (
                          <div className="bg-white border border-gray-200 rounded-2xl p-4 my-2 max-w-md shadow-sm space-y-2">
                            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                              Customer Story · {STORY.region}
                            </div>
                            <div className="text-3xl font-extrabold text-gray-900 leading-tight">
                              {STORY.metric}
                            </div>
                            <p className="text-xs text-gray-600 font-medium">{STORY.sub}</p>
                            <Link
                              href="/customers"
                              className="inline-block mt-2 text-xs font-bold text-black hover:underline"
                            >
                              Read full customer story →
                            </Link>
                          </div>
                        )}

                        {/* ROI Card Type */}
                        {msg.type === "roi_card" && (
                          <ROICalculatorComponent
                            onAttachROI={() => {
                              setRoiAttached(true);
                              setStage((prev) => Math.max(prev, 3));
                            }}
                            isAttached={roiAttached}
                          />
                        )}

                        {/* Pricing Card Type */}
                        {msg.type === "pricing_card" && msg.productKey && (
                          <div className="bg-white border border-gray-200 rounded-2xl p-4 my-2 max-w-md shadow-sm space-y-2">
                            <div className="font-bold text-sm text-gray-900">
                              {PRODUCTS[msg.productKey]?.name} Pricing
                            </div>
                            <div className="text-xl font-extrabold text-black">
                              {PRODUCTS[msg.productKey]?.price}
                            </div>
                            <p className="text-xs text-gray-500">
                              Final custom figures locked in your official proposal PDF.
                            </p>
                            <button
                              onClick={() => handleAddProposal(msg.productKey!)}
                              disabled={proposal.has(msg.productKey!)}
                              className={`w-full mt-2 py-2 text-xs font-bold rounded-xl transition-all ${
                                proposal.has(msg.productKey!)
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-[#FFEF1A] text-black hover:bg-[#f5e500]"
                              }`}
                            >
                              {proposal.has(msg.productKey!) ? "✓ Added to proposal" : "+ Add to proposal"}
                            </button>
                          </div>
                        )}

                        {/* Proposal Form Type */}
                        {msg.type === "proposal_form" && (
                          <ProposalFormComponent
                            proposalKeys={Array.from(proposal)}
                            roiAttached={roiAttached}
                            onGenerate={handleProposalGenerated}
                          />
                        )}

                        {/* Booking Grid Type */}
                        {msg.type === "booking_grid" && (
                          <BookingGridComponent onSelectSlot={handleConfirmBooking} />
                        )}

                        {/* Booking Confirmed Type */}
                        {msg.type === "booking_confirmed" && (
                          <div className="bg-white border border-gray-200 rounded-2xl p-5 my-2 max-w-md text-center shadow-sm space-y-2">
                            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-lg font-bold">
                              ✓
                            </div>
                            <div className="font-bold text-sm text-gray-900">
                              Booked — {msg.bookingTime}
                            </div>
                            <p className="text-xs text-gray-500">
                              A calendar invite and meeting link have been queued for your work email.
                            </p>
                            <div className="pt-2 flex justify-center gap-3 text-xs font-semibold text-black">
                              <a href="#" className="hover:underline">
                                Google
                              </a>
                              <span>·</span>
                              <a href="#" className="hover:underline">
                                Outlook
                              </a>
                              <span>·</span>
                              <a href="#" className="hover:underline">
                                iCal
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Floating Proposal Tray Banner */}
          <AnimatePresence>
            {(proposal.size > 0 || roiAttached) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={handleBuildProposal}
                className="mx-4 sm:mx-8 mb-2 p-3 bg-gray-900 text-white rounded-2xl flex items-center justify-between cursor-pointer shadow-lg hover:bg-black transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span>📄</span>
                  <span>
                    <strong className="text-[#FFEF1A] font-bold">{proposal.size}</strong> tool
                    {proposal.size !== 1 ? "s" : ""} in proposal
                    {roiAttached ? " · ROI attached" : ""}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#FFEF1A]">Review & Generate →</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <div className="flex-shrink-0 border-t border-[#C9D4DF] bg-white px-4 sm:px-8 lg:px-12 py-3.5">
            <div className="max-w-2xl mx-auto space-y-3">
              {/* Row 1: Pill input with Circular Navy Send button */}
              <div className="flex items-center gap-2.5">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendUserMessage(input);
                    }
                  }}
                  placeholder="Type your question..."
                  className="flex-1 px-4 py-3 text-sm border border-[#C9D4DF] rounded-full bg-white outline-none transition-colors text-[#1B2733] placeholder:text-[#5B6770] focus:border-[#1E6FB8]"
                />
                <button
                  onClick={() => sendUserMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
                  style={{ background: "#0B2A4A" }}
                  title="Send"
                >
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-white">
                    <path d="M3 11l18-8-8 18-2-7-8-3z" />
                  </svg>
                </button>
              </div>

              {/* Row 2: Two CTA buttons matching screenshot */}
              <div className="flex gap-2.5">
                <button
                  onClick={handleBuildProposal}
                  className="flex-1 py-2.5 px-4 text-xs font-bold rounded-lg transition-colors text-center"
                  style={{ background: "#000000", color: "#FFFFFF" }}
                >
                  Build my proposal
                </button>
                <button
                  onClick={handleStartBooking}
                  className="flex-1 py-2.5 px-4 text-xs font-bold rounded-lg transition-colors text-center hover:brightness-95"
                  style={{ background: BRAND_YELLOW, color: "#000000" }}
                >
                  Book a demo
                </button>
              </div>

              <div className="text-[10px] text-gray-400 text-center">
                Conco Assistant · Interactive AI Platform
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

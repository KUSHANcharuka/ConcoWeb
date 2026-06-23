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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────────────
// Types & Constants
// ─────────────────────────────────────────────────────────────
const BRAND_YELLOW = "#FFEF1A";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  { emoji: "📐", label: "Measurements", text: "How does MeasureOnAir work on-site?" },
  { emoji: "💰", label: "Payment Apps", text: "How are payment applications generated automatically?" },
  { emoji: "🤖", label: "BuilderBot AI", text: "What can BuilderBot AI do for my construction projects?" },
  { emoji: "🔗", label: "Revit Integration", text: "How does MeasureOnAir integrate with Revit and BIM?" },
  { emoji: "📋", label: "Contracts", text: "How does BuilderBot help with contract review?" },
  { emoji: "💡", label: "Get Started", text: "How do I get started with Concolabs?" },
];

const AI_RESPONSES: Record<string, string> = {
  default:
    "Great question! I'm **ConstrAI**, your construction intelligence assistant.\n\nI can help you explore:\n• 📐 MeasureOnAir — site measurement automation\n• 💰 Payment Application generation\n• 🤖 BuilderBot AI — contract intelligence\n• 🔗 Revit & BIM integrations\n\nWhat would you like to know?",
  measureonair:
    "**MeasureOnAir** transforms how your team captures site data.\n\nHere's how it works:\n1. 📱 Record measurements on mobile or tablet, directly on-site\n2. 🔄 Data syncs automatically to the cloud\n3. ✅ Certified payment applications are generated instantly\n4. 📊 BOQ reconciliation happens in real-time\n\nNo more manual data entry, spreadsheets, or transcription errors. Teams typically save **3–5 hours per payment application cycle**.\n\nWould you like to book a demo to see it live?",
  payment:
    "Payment applications are **generated automatically** — here's the full flow:\n\n1. 📐 Site measurements recorded via MeasureOnAir\n2. 📋 BOQ baseline pulled from Revit or 2D drawings\n3. 🔄 System cross-references measurements vs. BOQ\n4. ✅ Certified pay app generated — ready for approval\n5. 🤖 BuilderBot reviews for contract compliance\n\nWhat used to take **3 days** now takes under **30 minutes**. 🚀\n\nOur clients report zero payment disputes after switching to automated applications.",
  builderbot:
    "**BuilderBot AI** is your construction contract intelligence engine.\n\nCapabilities:\n• 📋 Review contracts for unfavourable or risky clauses\n• 💡 Suggest remediation strategies with precedent references\n• 🔍 Cross-reference pay applications with contract terms\n• 📊 Flag potential disputes *before* they escalate\n• 🔒 Runs entirely in your browser — your data never leaves your environment\n\nBuilderBot has processed **thousands of construction contracts** and identifies risk clauses with high accuracy.\n\nWant to see a contract review demo?",
  revit:
    "MeasureOnAir integrates directly with **Revit and your BIM workflows**.\n\nHow it works:\n• 🏗️ Export BOQ directly from your Revit model via our plugin\n• 📥 BOQ auto-imports into MeasureOnAir as the baseline\n• 📐 Site measurements reconcile against model quantities\n• ⚠️ Variances are flagged instantly for review\n• 📊 Full audit trail maintained\n\nFor teams **without BIM**, we also support:\n• 2D drawing extraction\n• Manual BOQ upload (Excel, CSV)\n• PDF drawing processing\n\nThis makes Concolabs accessible to all team sizes.",
  contract:
    "BuilderBot's contract review is powered by **domain-specific AI** trained on thousands of construction contracts.\n\nIt identifies:\n• ⚠️ Unfair risk transfer clauses\n• 📅 Payment term anomalies\n• 🔒 Liability cap issues\n• 📋 Variation order ambiguities\n• ⚖️ Dispute resolution weaknesses\n\nFor each issue found, BuilderBot provides:\n1. Plain-English explanation of the risk\n2. Suggested alternative clause wording\n3. Precedent references from similar contracts\n\nMost contract reviews complete in **under 5 minutes**.",
  getstarted:
    "Getting started with Concolabs is straightforward!\n\n**Step 1:** Book a 30-minute discovery call\n→ We'll understand your team's workflow and pain points\n\n**Step 2:** Tailored demo\n→ See MeasureOnAir and BuilderBot working with your actual project data\n\n**Step 3:** Pilot setup\n→ 2-week pilot on a live project, fully supported by our team\n\n**Step 4:** Full deployment\n→ Training, onboarding, and dedicated support\n\nMost teams are fully operational within **1–2 weeks**.\n\n📞 Ready to start? [Book a Demo →](/demo)",
};

function getAIResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("measure") || lower.includes("site") || lower.includes("on-site"))
    return AI_RESPONSES.measureonair!;
  if (lower.includes("payment") || lower.includes("pay app") || lower.includes("application"))
    return AI_RESPONSES.payment!;
  if (lower.includes("builderbot") || lower.includes("builder bot"))
    return AI_RESPONSES.builderbot!;
  if (lower.includes("revit") || lower.includes("bim") || lower.includes("boq") || lower.includes("integration"))
    return AI_RESPONSES.revit!;
  if (lower.includes("contract") || lower.includes("clause") || lower.includes("review"))
    return AI_RESPONSES.contract!;
  if (lower.includes("start") || lower.includes("begin") || lower.includes("onboard") || lower.includes("demo") || lower.includes("pricing"))
    return AI_RESPONSES.getstarted!;
  return AI_RESPONSES.default!;
}

// ─────────────────────────────────────────────────────────────
// Typing Indicator
// ─────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 mb-6">
      <div
        className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
        style={{ background: BRAND_YELLOW }}
      >
        <Bot className="w-5 h-5 text-black" strokeWidth={2.2} />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm">
        <div className="flex gap-1.5 items-center h-5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-gray-400"
              animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Message Bubble
// ─────────────────────────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  const renderContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const rendered = parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
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
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex items-end gap-3 mb-6 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {!isUser ? (
        <div
          className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ background: BRAND_YELLOW }}
        >
          <Bot className="w-5 h-5 text-black" strokeWidth={2.2} />
        </div>
      ) : (
        <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gray-900 flex items-center justify-center shadow-lg">
          <HardHat className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[72%] lg:max-w-[60%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "text-black rounded-br-sm font-medium"
            : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
        }`}
        style={isUser ? { background: BRAND_YELLOW } : {}}
      >
        {isUser ? message.content : renderContent(message.content)}

        {/* Timestamp */}
        <p className={`text-[10px] mt-2 ${isUser ? "text-black/50 text-right" : "text-gray-400"}`}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stats Bar
// ─────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { icon: Zap, label: "Instant replies", value: "< 2s avg" },
    { icon: Shield, label: "Secure & private", value: "Enterprise grade" },
    { icon: Clock, label: "Available", value: "24 / 7" },
  ];
  return (
    <div className="flex items-center justify-center gap-6 py-3 px-6 border-b border-gray-100">
      {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-2 text-xs text-gray-500">
          <Icon className="w-3.5 h-3.5" style={{ color: BRAND_YELLOW }} />
          <span className="font-medium text-gray-700">{value}</span>
          <span className="hidden sm:inline">· {label}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi! I'm **ConstrAI**, your construction intelligence assistant powered by Concolabs.\n\nI can help you understand how MeasureOnAir, BuilderBot, and our automation platform can transform your construction workflow.\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }, []);

  useEffect(() => {
    scrollToBottom(false);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleScroll = () => {
    const el = scrollAreaRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
  };

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));

    const aiMsg: Message = {
      id: `a-${Date.now()}`,
      role: "assistant",
      content: getAIResponse(trimmed),
      timestamp: new Date(),
    };
    setIsTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content:
          "👋 Hi! I'm **ConstrAI**, your construction intelligence assistant powered by Concolabs.\n\nI can help you understand how MeasureOnAir, BuilderBot, and our automation platform can transform your construction workflow.\n\nWhat would you like to know?",
        timestamp: new Date(),
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#FAFAF8]">
      {/* ── Header ── */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100"
        style={{
          background: "linear-gradient(135deg, #111111 0%, #1e1e1e 100%)",
          boxShadow: "0 1px 0 rgba(255,239,26,0.2)",
        }}
      >
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors group"
        >
          <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </span>
          <span className="hidden sm:inline">Go back</span>
        </button>

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: BRAND_YELLOW }}
          >
            <Bot className="w-5 h-5 text-black" strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-white leading-tight">ConstrAI</p>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFEF1A]" />
              </motion.div>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-gray-400">Online · Replies instantly</span>
            </div>
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors group"
          title="Reset conversation"
        >
          <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </span>
          <span className="hidden sm:inline text-xs">New chat</span>
        </button>
      </header>

      {/* Stats bar */}
      <StatsBar />

      {/* ── Messages Area ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - desktop only */}
        <aside className="hidden lg:flex flex-col w-72 xl:w-80 border-r border-gray-100 bg-white p-6 gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
              Quick Topics
            </p>
            <div className="flex flex-col gap-1.5">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => void sendMessage(p.text)}
                  className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-[#FFEF1A]/10 hover:text-black transition-all duration-200 group"
                >
                  <span className="text-base">{p.emoji}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <div
              className="rounded-2xl p-4"
              style={{ background: `linear-gradient(135deg, #111111 0%, #1e1e1e 100%)` }}
            >
              <p className="text-xs font-semibold text-white mb-1">Ready to see it live?</p>
              <p className="text-xs text-gray-400 mb-3">Book a 30-min demo with our team.</p>
              <Link
                href="/demo"
                className="block w-full text-center text-xs font-bold py-2 rounded-xl transition-all hover:opacity-90"
                style={{ background: BRAND_YELLOW, color: "#000" }}
              >
                Book a Demo →
              </Link>
            </div>
          </div>
        </aside>

        {/* Chat column */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Messages scroll area */}
          <div
            ref={scrollAreaRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-6"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}
          >
            <div className="max-w-2xl mx-auto">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Scroll to bottom button */}
          <AnimatePresence>
            {showScrollBtn && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => scrollToBottom()}
                className="absolute bottom-36 right-8 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-10"
              >
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Mobile suggested prompts (shown only at start) */}
          {messages.length <= 1 && (
            <div className="lg:hidden px-4 sm:px-8 pb-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-2">
                Quick topics
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => void sendMessage(p.text)}
                    className="flex-shrink-0 text-xs font-medium px-3 py-2 rounded-full border border-gray-200 bg-white hover:border-[#FFEF1A] hover:bg-[#FFEF1A]/10 transition-all duration-200 text-gray-700 hover:text-black whitespace-nowrap"
                  >
                    {p.emoji} {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Input Area ── */}
          <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 sm:px-8 lg:px-12 py-4">
            <div className="max-w-2xl mx-auto">
              <div
                className="flex items-end gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all duration-200 focus-within:border-[#FFEF1A] focus-within:ring-2 focus-within:ring-[#FFEF1A]/30 focus-within:bg-white"
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    // Auto-resize
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about measurements, contracts, payment apps, integrations..."
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none leading-relaxed overflow-y-auto"
                  style={{ maxHeight: "120px", scrollbarWidth: "none" }}
                />
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => void sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  style={{ background: input.trim() ? BRAND_YELLOW : "#e5e7eb" }}
                >
                  <Send className="w-4 h-4 text-black" strokeWidth={2.2} />
                </motion.button>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-2">
                ConstrAI · Powered by Concolabs · Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Bot,
  ChevronDown,
  HardHat,
  Sparkles,
  RotateCcw,
  Minimize2,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface SuggestedPrompt {
  label: string;
  text: string;
}

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const BRAND_YELLOW = "#FFEF1A";

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { label: "📐 Measurements", text: "How does MeasureOnAir work on-site?" },
  { label: "💰 Payment Apps", text: "How are payment applications generated?" },
  { label: "🤖 BuilderBot", text: "What can BuilderBot AI do for me?" },
  { label: "🔗 Integration", text: "How does it integrate with Revit?" },
];

// Canned AI responses for demo purposes
const AI_RESPONSES: Record<string, string> = {
  default:
    "Great question! I'm ConstrAI, your construction intelligence assistant. I can help you explore Concolabs products like MeasureOnAir, BuilderBot, and our payment application automation. What would you like to know?",
  measureonair:
    "**MeasureOnAir** lets your team capture site measurements directly on mobile or tablet. The data flows automatically into:\n\n• ✅ Certified payment applications\n• ✅ BOQ reconciliation\n• ✅ BuilderBot for contract reviews\n\nNo more manual data entry or Excel headaches. Would you like a demo?",
  payment:
    "Payment applications are **generated automatically** the moment site measurements are recorded. The system:\n\n1. Pulls your BOQ baseline (Revit or 2D drawings)\n2. Cross-references your site measurements\n3. Produces a certified pay app ready for approval\n\nThis reduces a 3-day process to under 30 minutes. 🚀",
  builderbot:
    "**BuilderBot AI** is your construction contract intelligence engine. It can:\n\n• 📋 Review contracts for risk clauses\n• 💡 Suggest remediation strategies\n• 🔍 Cross-reference payment applications with contract terms\n• 📊 Flag disputes before they escalate\n\nIt runs entirely in your browser — no data leaves your environment.",
  revit:
    "MeasureOnAir integrates directly with **Revit via our BOQ export plugin**. Your model becomes the single source of truth:\n\n• Export BOQ from Revit → auto-imported into MeasureOnAir\n• Site measurements reconcile against the model quantities\n• Variances are flagged instantly\n\nWe also support 2D drawing extraction for teams without BIM.",
};

function getAIResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("measure") || lower.includes("site") || lower.includes("on-site"))
    return AI_RESPONSES.measureonair!;
  if (lower.includes("payment") || lower.includes("application") || lower.includes("pay app"))
    return AI_RESPONSES.payment!;
  if (lower.includes("builderbot") || lower.includes("builder") || lower.includes("contract") || lower.includes("ai"))
    return AI_RESPONSES.builderbot!;
  if (lower.includes("revit") || lower.includes("integration") || lower.includes("bim") || lower.includes("boq"))
    return AI_RESPONSES.revit!;
  return AI_RESPONSES.default!;
}

// ─────────────────────────────────────────────────────────────
// Typing Indicator
// ─────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-1.5 mb-3">
      <div
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
        style={{ background: BRAND_YELLOW }}
      >
        <Bot className="w-3 h-3 text-black" />
      </div>
      <div className="bg-white border border-gray-100 rounded-xl rounded-bl-sm px-3 py-2 shadow-sm">
        <div className="flex gap-1 items-center h-3">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1 h-1 rounded-full bg-gray-400"
              animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
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

  // Simple markdown-like rendering for bold text
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex items-end gap-1.5 mb-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
          style={{ background: BRAND_YELLOW }}
        >
          <Bot className="w-3 h-3 text-black" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed shadow-sm whitespace-pre-line ${
          isUser
            ? "text-black rounded-br-sm"
            : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
        }`}
        style={isUser ? { background: BRAND_YELLOW } : {}}
      >
        {isUser ? message.content : renderContent(message.content)}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center shadow-sm">
          <HardHat className="w-3 h-3 text-white" />
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Widget
// ─────────────────────────────────────────────────────────────
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi! I'm **ConstrAI**, your construction intelligence assistant.\n\nAsk me anything about MeasureOnAir, BuilderBot, or how Concolabs can streamline your projects.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!isMinimized) scrollToBottom();
  }, [messages, isTyping, isMinimized, scrollToBottom]);

  const handleScroll = () => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setShowScrollBtn(!atBottom);
  };

  const sendMessage = useCallback(
    async (text: string) => {
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

      // Simulate AI thinking delay
      await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));

      const response = getAIResponse(trimmed);
      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    },
    []
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content:
          "👋 Hi! I'm **ConstrAI**, your construction intelligence assistant.\n\nAsk me anything about MeasureOnAir, BuilderBot, or how Concolabs can streamline your projects.",
        timestamp: new Date(),
      },
    ]);
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    setIsMinimized(false);
  };

  return (
    <>
      {/* ─── CHAT PANEL ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.85, y: 30, originX: 1, originY: 1 }}
            animate={
              isMinimized
                ? { opacity: 1, scale: 1, y: 0, height: 64 }
                : { opacity: 1, scale: 1, y: 0, height: "auto" }
            }
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed bottom-20 right-4 z-50 rounded-2xl overflow-hidden shadow-xl"
            style={{
              width: "min(300px, calc(100vw - 2rem))",
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,239,26,0.25)",
            }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center justify-between px-3 py-2.5"
              style={{
                background: `linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)`,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shadow-md"
                  style={{ background: BRAND_YELLOW }}
                >
                  <Bot className="w-4 h-4 text-black" strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white leading-tight">
                    ConstrAI
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-gray-400">
                      Online · Replies instantly
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                <button
                  onClick={handleReset}
                  className="p-1 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-200"
                  title="Reset conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsMinimized((p) => !p)}
                  className="p-1 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-200"
                  title="Minimize"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={toggleOpen}
                  className="p-1 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-200"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── Body (hidden when minimized) ── */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Messages */}
                  <div
                    ref={scrollAreaRef}
                    onScroll={handleScroll}
                    className="h-[240px] overflow-y-auto px-3 pt-3 pb-2 scroll-smooth"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}
                  >
                    {messages.map((msg) => (
                      <MessageBubble key={msg.id} message={msg} />
                    ))}
                    {isTyping && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Scroll to bottom */}
                  <AnimatePresence>
                    {showScrollBtn && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={scrollToBottom}
                        className="absolute bottom-28 right-4 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Suggested Prompts */}
                  {messages.length <= 1 && (
                    <div className="px-3 pb-2">
                      <p className="text-[9px] uppercase tracking-widest text-gray-400 font-medium mb-1.5">
                        Quick questions
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {SUGGESTED_PROMPTS.map((p) => (
                          <button
                            key={p.label}
                            onClick={() => void sendMessage(p.text)}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-gray-200 bg-gray-50 hover:border-[#FFEF1A] hover:bg-[#FFEF1A]/10 transition-all duration-200 text-gray-700 hover:text-black"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="h-px bg-gray-100 mx-3" />

                  {/* Input Area */}
                  <div className="p-2.5">
                    <div
                      className="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-1.5 transition-all focus-within:border-[#FFEF1A] focus-within:ring-2 focus-within:ring-[#FFEF1A]/30"
                    >
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about measurements, contracts..."
                        rows={1}
                        className="flex-1 resize-none bg-transparent text-xs text-gray-800 placeholder-gray-400 outline-none leading-relaxed max-h-16 overflow-y-auto"
                        style={{ scrollbarWidth: "none" }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => void sendMessage(input)}
                        disabled={!input.trim() || isTyping}
                        className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: input.trim()
                            ? BRAND_YELLOW
                            : "#e5e7eb",
                        }}
                      >
                        <Send className="w-3 h-3 text-black" strokeWidth={2.2} />
                      </motion.button>
                    </div>
                    <p className="text-[9px] text-gray-400 text-center mt-1.5">
                      ConstrAI · Powered by Concolabs
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── FLOATING ACTION BUTTON ─── */}
      <div className="fixed bottom-4 right-4 z-50">
        {/* Pulse ring */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: BRAND_YELLOW, opacity: 0.4 }}
            animate={{ scale: [1, 1.6, 1.6], opacity: [0.4, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        )}

        <motion.button
          id="chat-widget-fab"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleOpen}
          className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
          style={{
            background: isOpen
              ? "#1a1a1a"
              : `linear-gradient(135deg, ${BRAND_YELLOW} 0%, #f5e000 100%)`,
            boxShadow: isOpen
              ? "0 6px 24px rgba(0,0,0,0.3)"
              : `0 6px 24px rgba(255,239,26,0.5)`,
          }}
          aria-label={isOpen ? "Close chat" : "Open ConstrAI chat"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5 text-white" strokeWidth={2.2} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Bot className="w-5 h-5 text-black" strokeWidth={2.2} />
                <motion.div
                  className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center"
                  style={{ background: "#1a1a1a" }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-1.5 h-1.5 text-[#FFEF1A]" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}

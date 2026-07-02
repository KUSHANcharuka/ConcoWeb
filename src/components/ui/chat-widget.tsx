"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Bot,
  Sparkles,
  RotateCcw,
  Minimize2,
  Zap,
} from "lucide-react";
import {
  PRODUCTS,
  ROLES,
  STORY,
  calculateROI,
  type Product,
} from "@/lib/chatbot-data";

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const BRAND_YELLOW = "#FFEF1A";
const NAVY = "#000000ff";
const BLUE = "#000000ff";
const AMBER = "#f2ea00ff";
const LINE_COLOR = "#C9D4DF";

const STAGE_NAMES = ["Diagnose", "Recommend", "Prove", "Proposal"];

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

// ─────────────────────────────────────────────────────────────
// Mini Sub-components
// ─────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 pl-7 py-2">
      <span className="w-1.5 h-1.5 rounded-full bg-[#1E6FB8] animate-bounce" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#1E6FB8] animate-bounce [animation-delay:0.2s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#1E6FB8] animate-bounce [animation-delay:0.4s]" />
    </div>
  );
}

function renderMessageContent(text: string) {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-[#0B2A4A]">
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
}

// ─────────────────────────────────────────────────────────────
// Main Widget
// ─────────────────────────────────────────────────────────────
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [stage, setStage] = useState(1);
  const [proposal, setProposal] = useState<Set<string>>(new Set());
  const [roiAttached, setRoiAttached] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen, isMinimized, scrollToBottom]);

  // ── Welcome flow ──
  const handleReset = useCallback(() => {
    setStage(1);
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
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      handleReset();
    }
  }, [isOpen]);

  const addAssistantMessage = useCallback(
    (msg: Partial<MessageItem>, delay = 600) => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `widget-msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
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

  const handlePickRole = useCallback(
    (roleName: string) => {
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
        { content: "Got it. What's eating the most time right now?" },
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
                  addAssistantMessage({
                    content:
                      "Sure — type it in your own words and I'll find the closest tool.",
                  });
                },
              },
            ],
            timestamp: new Date(),
          },
        ]);
      }, 1100);
    },
    [addAssistantMessage]
  );

  const handlePickPain = useCallback(
    (painText: string, keys: string[]) => {
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
          content: `That's exactly what we remove. Here is the strongest match for your team:`,
        },
        500
      );

      setTimeout(() => {
        const cardMsgs: MessageItem[] = keys.slice(0, 2).map((key, idx) => ({
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
            { label: "Show customer story", action: handleShowStory },
            { label: "Calculate ROI", action: handleShowROI },
            { label: "Build proposal", action: handleBuildProposal },
          ],
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, ...cardMsgs, followUpChips]);
      }, 1100);
    },
    [addAssistantMessage]
  );

  const handleExploreProduct = useCallback(
    (key: string) => {
      const p = PRODUCTS[key];
      if (!p) return;
      addAssistantMessage({
        content: `**${p.name}.** ${p.vp} ${p.bullets.join(". ")}.`,
      });
    },
    [addAssistantMessage]
  );

  const handleAddProposal = useCallback((key: string) => {
    setProposal((prev) => new Set(prev).add(key));
    setStage((prev) => Math.max(prev, 3));
  }, []);

  const handleShowStory = useCallback(() => {
    setStage((prev) => Math.max(prev, 3));
    setMessages((prev) => [
      ...prev,
      {
        id: `user-story-${Date.now()}`,
        role: "user",
        type: "text",
        content: "Show customer story",
        timestamp: new Date(),
      },
    ]);

    addAssistantMessage(
      {
        content: `A ${STORY.region.split("·")[0]?.trim()} in the UAE cut estimating time:`,
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
    }, 1000);
  }, [addAssistantMessage]);

  const handleShowROI = useCallback(() => {
    setStage((prev) => Math.max(prev, 3));
    setMessages((prev) => [
      ...prev,
      {
        id: `user-roi-${Date.now()}`,
        role: "user",
        type: "text",
        content: "Calculate ROI",
        timestamp: new Date(),
      },
    ]);

    addAssistantMessage(
      {
        content: "Adjust the sliders to estimate your team's savings:",
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
    }, 1000);
  }, [addAssistantMessage]);

  const handleBuildProposal = useCallback(() => {
    if (proposal.size === 0) {
      addAssistantMessage({
        content:
          "Add at least one tool first and I'll build a proposal. Want a recommendation? Just tell me your role.",
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `chips-proposal-start-${Date.now()}`,
          role: "assistant",
          type: "chips",
          chips: Object.keys(ROLES).map((r) => ({
            label: r,
            action: () => handlePickRole(r),
          })),
          timestamp: new Date(),
        },
      ]);
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
  }, [proposal, addAssistantMessage, handlePickRole]);

  const handleStartBooking = useCallback(() => {
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
  }, [addAssistantMessage]);

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
        if (/roi|save|saving/.test(t)) {
          handleShowROI();
          return;
        }
        if (/book|demo|meeting/.test(t)) {
          handleStartBooking();
          return;
        }
        if (/proposal|quote/.test(t)) {
          handleBuildProposal();
          return;
        }

        for (const k in PRODUCTS) {
          const p = PRODUCTS[k]!;
          if (t.includes(p.name.toLowerCase())) {
            setMessages((prev) => [
              ...prev,
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

        addAssistantMessage({
          content: "To help find the exact tool for your team, please select your role:",
        });
        setMessages((prev) => [
          ...prev,
          {
            id: `chips-fallback-${Date.now()}`,
            role: "assistant",
            type: "chips",
            chips: Object.keys(ROLES).map((r) => ({
              label: r,
              action: () => handlePickRole(r),
            })),
            timestamp: new Date(),
          },
        ]);
      }, 600);
    },
    [addAssistantMessage, handleShowROI, handleStartBooking, handleBuildProposal]
  );

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    setIsMinimized(false);
  };

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
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
                ? { opacity: 1, scale: 1, y: 0, height: 58 }
                : { opacity: 1, scale: 1, y: 0, height: "auto" }
            }
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed bottom-20 right-4 z-50 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width: "min(380px, calc(100vw - 2rem))",
              background: "#FFFFFF",
              border: `1px solid ${LINE_COLOR}`,
              boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
              maxHeight: "min(680px, calc(100vh - 100px))",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center justify-between px-3 py-2.5 flex-shrink-0 select-none"
              style={{ background: NAVY }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shadow-md font-extrabold text-xs"
                  style={{ background: BRAND_YELLOW, color: "#000000" }}
                >
                  C
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">
                    Conco Assistant
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-white/70">
                      Online
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                <button
                  onClick={handleReset}
                  className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  title="Reset conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsMinimized((p) => !p)}
                  className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  title="Minimize"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={toggleOpen}
                  className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
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
                  className="flex flex-col flex-1 overflow-hidden"
                >
                  {/* Progress Rail */}
                  <div
                    className="flex gap-1 px-3 py-1.5 border-b flex-shrink-0 select-none"
                    style={{ background: "#f4f7fa", borderColor: LINE_COLOR }}
                  >
                    {STAGE_NAMES.map((name, idx) => {
                      const stageNum = idx + 1;
                      const isActive = stage === stageNum;
                      const isDone = stage > stageNum;
                      return (
                        <div key={name} className="flex-1 text-center relative pt-2">
                          <div
                            className="absolute top-0 left-0 right-0 h-[3px] rounded-[2px] transition-colors duration-200"
                            style={{
                              background: isDone
                                ? BLUE
                                : isActive
                                  ? BRAND_YELLOW
                                  : LINE_COLOR,
                            }}
                          />
                          <span
                            className="text-[9px] font-semibold tracking-tight block"
                            style={{
                              color: isActive || isDone ? "#000000" : "#5B6770",
                            }}
                          >
                            {name}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* ── Messages ── */}
                  <div
                    ref={scrollAreaRef}
                    className="flex-1 overflow-y-auto p-3 space-y-2"
                    style={{ background: "#fbfcfe" }}
                  >
                    {messages.map((msg) => {
                      const isUser = msg.role === "user";
                      return (
                        <div
                          key={msg.id}
                          className={`flex items-start ${isUser ? "justify-end" : "justify-start"}`}
                        >
                          {!isUser && (
                            <div
                              className="w-[22px] h-[22px] rounded-full flex items-center justify-center font-extrabold text-[10px] shrink-0 mr-1.5 mt-0.5"
                              style={{ background: "#000000ff", color: BRAND_YELLOW }}
                            >
                              C
                            </div>
                          )}

                          <div className="max-w-[85%]">
                            {/* Text Bubble */}
                            {msg.type === "text" && msg.content && (
                              <div
                                className="px-3 py-2 text-[13px] leading-relaxed"
                                style={{
                                  background: isUser ? "#EAF1F8" : "#FFFFFF",
                                  color: isUser ? "#000000" : "#1B2733",
                                  border: isUser ? "none" : `1px solid ${LINE_COLOR}`,
                                  borderRadius: "14px",
                                  borderBottomLeftRadius: isUser ? "14px" : "4px",
                                  borderBottomRightRadius: isUser ? "4px" : "14px",
                                }}
                              >
                                {renderMessageContent(msg.content)}
                              </div>
                            )}

                            {/* Chips */}
                            {msg.type === "chips" && msg.chips && (
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {msg.chips.map((chip, i) => (
                                  <button
                                    key={i}
                                    onClick={chip.action}
                                    className="px-2.5 py-1 text-[12px] font-medium rounded-full transition-all"
                                    style={{
                                      border: `1.5px solid ${BLUE}`,
                                      color: BLUE,
                                      background: "#FFFFFF",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background = BLUE;
                                      e.currentTarget.style.color = "#FFFFFF";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = "#FFFFFF";
                                      e.currentTarget.style.color = BLUE;
                                    }}
                                  >
                                    {chip.label}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Product Card */}
                            {msg.type === "product_card" && msg.productKey && (
                              <div
                                className="bg-white border rounded-[12px] p-3 my-1 text-xs space-y-1.5"
                                style={{ borderColor: LINE_COLOR }}
                              >
                                <div className="flex items-center gap-1.5 font-semibold text-[13px]" style={{ color: "#000000" }}>
                                  <span className="w-5 h-5 rounded bg-[#EAF1F8] flex items-center justify-center text-[10px] font-bold" style={{ color: "#000000" }}>
                                    {PRODUCTS[msg.productKey]?.glyph}
                                  </span>
                                  <span className="flex-1 truncate">{PRODUCTS[msg.productKey]?.name}</span>
                                </div>
                                <p className="text-[12px] text-[#5B6770]">
                                  {PRODUCTS[msg.productKey]?.vp}
                                </p>
                                <div className="flex gap-1.5 pt-1">
                                  <button
                                    onClick={() => handleExploreProduct(msg.productKey!)}
                                    className="flex-1 py-1.5 text-[11px] font-semibold rounded-lg border border-[#1E6FB8] text-[#1E6FB8] hover:bg-[#EAF1F8] transition-colors"
                                  >
                                    Explore
                                  </button>
                                  <button
                                    onClick={() => handleAddProposal(msg.productKey!)}
                                    disabled={proposal.has(msg.productKey!)}
                                    className="flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all"
                                    style={{
                                      background: proposal.has(msg.productKey!) ? "#e7f4ee" : BRAND_YELLOW,
                                      color: proposal.has(msg.productKey!) ? "#1F9D6B" : "#000000",
                                    }}
                                  >
                                    {proposal.has(msg.productKey!) ? "✓ Added" : "+ Add"}
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Story Card */}
                            {msg.type === "story_card" && (
                              <div className="bg-white border rounded-[12px] p-3 my-1 text-xs space-y-1" style={{ borderColor: LINE_COLOR }}>
                                <div className="text-[10px] text-[#5B6770]">Customer story · {STORY.region}</div>
                                <div className="text-2xl font-extrabold" style={{ color: "#000000" }}>{STORY.metric}</div>
                                <p className="text-[11px] text-[#5B6770] font-medium">{STORY.sub}</p>
                              </div>
                            )}

                            {/* ROI Card */}
                            {msg.type === "roi_card" && (
                              <div className="bg-white border rounded-[12px] p-3 my-1 text-xs space-y-1.5" style={{ borderColor: LINE_COLOR }}>
                                <div className="font-bold flex items-center gap-1" style={{ color: "#000000" }}>
                                  <Zap className="w-3 h-3 text-amber-500" />
                                  <span>ROI Estimator</span>
                                </div>
                                <div className="p-2 rounded-lg text-center font-bold text-[11px]" style={{ background: "#EAF1F8", color: "#000000" }}>
                                  ≈ 136 hrs & $6,120 saved / mo
                                </div>
                                <button
                                  onClick={() => {
                                    setRoiAttached(true);
                                    setStage((prev) => Math.max(prev, 3));
                                  }}
                                  disabled={roiAttached}
                                  className="w-full py-1.5 text-[11px] font-bold rounded-lg transition-all"
                                  style={{
                                    background: roiAttached ? "#e7f4ee" : BRAND_YELLOW,
                                    color: roiAttached ? "#1F9D6B" : "#000000",
                                  }}
                                >
                                  {roiAttached ? "✓ ROI Added" : "Add ROI to proposal"}
                                </button>
                              </div>
                            )}

                            {/* Proposal Form */}
                            {msg.type === "proposal_form" && (
                              <div className="bg-white border rounded-[12px] p-3 my-1 text-xs space-y-2" style={{ borderColor: LINE_COLOR }}>
                                <div className="font-bold text-[13px]" style={{ color: "#000000" }}>Your Proposal</div>
                                <input
                                  type="email"
                                  placeholder="Your work email..."
                                  className="w-full p-2 border rounded-lg text-[11px] outline-none focus:border-[#1E6FB8]"
                                  style={{ borderColor: LINE_COLOR }}
                                />
                                <button
                                  onClick={() => {
                                    addAssistantMessage({
                                      content: "Proposal PDF generated! Let's lock in a demo walkthrough next:",
                                    });
                                    setTimeout(handleStartBooking, 800);
                                  }}
                                  className="w-full py-1.5 text-[11px] font-bold rounded-lg transition-colors"
                                  style={{ background: BRAND_YELLOW, color: "#000000" }}
                                >
                                  Generate Proposal ✓
                                </button>
                              </div>
                            )}

                            {/* Booking Grid */}
                            {msg.type === "booking_grid" && (
                              <div className="bg-white border rounded-[12px] p-3 my-1 text-xs space-y-1.5" style={{ borderColor: LINE_COLOR }}>
                                <div className="font-bold text-[13px]" style={{ color: "#000000" }}>Pick a Time</div>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {["Mon 29 · 09:00", "Tue 30 · 10:30", "Wed 1 · 13:00", "Thu 2 · 15:30"].map((slot) => (
                                    <button
                                      key={slot}
                                      onClick={() => {
                                        addAssistantMessage({
                                          content: `✓ Booked — **${slot}**. Calendar invite queued!`,
                                        });
                                      }}
                                      className="p-1.5 border rounded-lg text-center font-semibold text-[11px] transition-colors hover:bg-[#1E6FB8] hover:text-white"
                                      style={{ borderColor: LINE_COLOR, color: "#000000" }}
                                    >
                                      {slot}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {isTyping && <TypingDots />}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Floating Proposal Bar */}
                  {(proposal.size > 0 || roiAttached) && (
                    <div
                      onClick={handleBuildProposal}
                      className="mx-2 mb-1 p-2 rounded-lg flex items-center justify-between cursor-pointer text-[11px] font-semibold text-white shadow-sm"
                      style={{ background: "#000000ff" }}
                    >
                      <span>📄 {proposal.size} tool(s) in proposal</span>
                      <span className="font-bold" style={{ color: BRAND_YELLOW }}>Build PDF →</span>
                    </div>
                  )}

                  {/* ── Composer ── */}
                  <div
                    className="p-2.5 bg-white flex-shrink-0 space-y-2 border-t"
                    style={{ borderColor: LINE_COLOR }}
                  >
                    {/* Row 1: Pill input + Send button */}
                    <div className="flex items-center gap-1.5">
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
                        className="flex-1 px-3 py-2 text-[13px] border rounded-full bg-white outline-none transition-colors placeholder:text-[#5B6770]"
                        style={{ borderColor: LINE_COLOR, color: "#1B2733" }}
                      />
                      <button
                        onClick={() => sendUserMessage(input)}
                        className="w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-105 active:scale-95"
                        style={{ background: "#000000ff" }}
                        title="Send"
                      >
                        <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-white">
                          <path d="M3 11l18-8-8 18-2-7-8-3z" />
                        </svg>
                      </button>
                    </div>

                    {/* Row 2: Two CTA buttons */}
                    <div className="flex gap-1.5">
                      <button
                        onClick={handleBuildProposal}
                        className="flex-1 py-2 text-[11px] font-bold rounded-[8px] transition-colors text-center"
                        style={{ background: "#000000ff", color: "#FFFFFF" }}
                      >
                        Build my proposal
                      </button>
                      <button
                        onClick={handleStartBooking}
                        className="flex-1 py-2 text-[11px] font-bold rounded-[8px] transition-colors text-center hover:brightness-95"
                        style={{ background: BRAND_YELLOW, color: "#000000" }}
                      >
                        Book a demo
                      </button>
                    </div>

                    <p className="text-[8px] text-gray-400 text-center">
                      Conco Assistant · Interactive AI
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
          aria-label={isOpen ? "Close chat" : "Open Conco Assistant"}
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

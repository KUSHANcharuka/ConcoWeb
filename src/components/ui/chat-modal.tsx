"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Zap, FileText } from "lucide-react";
import {
  PRODUCTS,
  ROLES,
  STORY,
  calculateROI,
  type Product,
} from "@/lib/chatbot-data";

const NAVY = "#000000ff";
const BLUE = "#000000ff";
const AMBER = "#f2ea00ff";
const LINE_COLOR = "#C9D4DF";

const STAGE_NAMES = ["Diagnose", "Recommend", "Prove", "Proposal"];

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

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const [stage, setStage] = useState(1);
  const [proposal, setProposal] = useState<Set<string>>(new Set());
  const [roiAttached, setRoiAttached] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen, scrollToBottom]);

  const addAssistantMessage = useCallback(
    (msg: Partial<MessageItem>, delay = 600) => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `modal-msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
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
  };

  const handleExploreProduct = (key: string) => {
    const p = PRODUCTS[key];
    if (!p) return;
    addAssistantMessage({
      content: `**${p.name}.** ${p.vp} ${p.bullets.join(". ")}.`,
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
        content: "Show customer story",
        timestamp: new Date(),
      },
    ]);

    addAssistantMessage(
      { content: `A ${STORY.region.split("·")[0]?.trim()} in the UAE cut estimating time:` },
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
  };

  const handleShowROI = () => {
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
      { content: "Adjust the sliders to estimate your team's savings:" },
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
  };

  const handleBuildProposal = () => {
    if (proposal.size === 0) {
      addAssistantMessage({
        content: "Add at least one tool first and I'll build a proposal. Want a recommendation? Just tell me your role.",
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
      { content: "Here's your proposal so far. Add your details and I'll generate it." },
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

  const handleStartBooking = () => {
    setStage(4);
    addAssistantMessage(
      { content: "Let's lock in a 30-minute walkthrough. Pick a time that suits you:" },
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

  const handleReset = () => {
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
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      handleReset();
    }
  }, [isOpen]);

  const sendUserMessage = (text: string) => {
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
  };

  const renderMessageContent = (text: string) => {
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
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed z-50 bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-32px)] sm:w-[480px] h-[700px] max-h-[90vh] flex flex-col bg-white border border-[#C9D4DF] rounded-[18px] shadow-[0_16px_48px_rgba(11,42,74,0.22)] overflow-hidden font-sans"
          >
            {/* Header */}
            <div
              className="flex items-center gap-2.5 px-4 py-3.5 flex-shrink-0 text-white select-none"
              style={{ background: NAVY }}
            >
              <div
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center font-extrabold text-[15px] shrink-0"
                style={{ background: AMBER, color: NAVY }}
              >
                C
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-white leading-none">
                  Conco Assistant
                </h3>
                <div className="flex items-center gap-1.5 text-[11.5px] text-white/80 mt-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#1F9D6B" }}
                  />
                  <span>Online</span>
                </div>
              </div>

              <div className="ml-auto flex items-center gap-1">
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  title="Restart"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors text-lg leading-none"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Rail */}
            <div
              className="flex gap-1.5 px-4 py-2.5 border-b flex-shrink-0 select-none"
              style={{ background: "#f4f7fa", borderColor: LINE_COLOR }}
            >
              {STAGE_NAMES.map((name, idx) => {
                const stageNum = idx + 1;
                const isActive = stage === stageNum;
                const isDone = stage > stageNum;
                return (
                  <div key={name} className="flex-1 text-center relative pt-3">
                    <div
                      className="absolute top-0 left-0 right-0 h-[4px] rounded-[3px] transition-colors duration-200"
                      style={{
                        background: isDone
                          ? BLUE
                          : isActive
                            ? AMBER
                            : LINE_COLOR,
                      }}
                    />
                    <span
                      className="text-[10.5px] font-semibold tracking-tight block"
                      style={{
                        color: isActive || isDone ? NAVY : "#5B6770",
                      }}
                    >
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Chat Stream Area */}
            <div
              ref={scrollAreaRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{ background: "#fbfcfe" }}
            >
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start ${isUser ? "justify-end" : "justify-start"
                      }`}
                  >
                    {!isUser && (
                      <div
                        className="w-[28px] h-[28px] rounded-full flex items-center justify-center font-extrabold text-[12px] shrink-0 mr-2 mt-0.5"
                        style={{ background: NAVY, color: AMBER }}
                      >
                        C
                      </div>
                    )}

                    <div className="max-w-[82%]">
                      {/* Text Bubble */}
                      {msg.type === "text" && msg.content && (
                        <div
                          className="px-3.5 py-2.5 text-[14.5px] leading-[1.5] shadow-2xs"
                          style={{
                            background: isUser ? "#EAF1F8" : "#FFFFFF",
                            color: isUser ? NAVY : "#1B2733",
                            border: isUser ? "none" : `1px solid ${LINE_COLOR}`,
                            borderRadius: "16px",
                            borderBottomLeftRadius: isUser ? "16px" : "5px",
                            borderBottomRightRadius: isUser ? "5px" : "16px",
                          }}
                        >
                          {renderMessageContent(msg.content)}
                        </div>
                      )}

                      {/* Chips */}
                      {msg.type === "chips" && msg.chips && (
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          {msg.chips.map((chip, i) => (
                            <button
                              key={i}
                              onClick={chip.action}
                              className="px-3.5 py-1.5 text-[13.5px] font-medium rounded-full transition-all"
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
                          className="bg-white border rounded-[14px] p-3.5 my-1 text-[13px] space-y-2"
                          style={{ borderColor: LINE_COLOR }}
                        >
                          <div className="flex items-center gap-2 font-semibold text-[14.5px]" style={{ color: NAVY }}>
                            <span className="w-6 h-6 rounded-md bg-[#EAF1F8] flex items-center justify-center text-xs font-bold" style={{ color: NAVY }}>
                              {PRODUCTS[msg.productKey]?.glyph}
                            </span>
                            <span className="flex-1">{PRODUCTS[msg.productKey]?.name}</span>
                            <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                              {PRODUCTS[msg.productKey]?.badge[0]}
                            </span>
                          </div>
                          <p className="text-[13px] text-[#5B6770]">
                            {PRODUCTS[msg.productKey]?.vp}
                          </p>
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => handleExploreProduct(msg.productKey!)}
                              className="flex-1 py-2 text-xs font-semibold rounded-lg border border-[#1E6FB8] text-[#1E6FB8] hover:bg-[#EAF1F8] transition-colors"
                            >
                              Explore
                            </button>
                            <button
                              onClick={() => handleAddProposal(msg.productKey!)}
                              disabled={proposal.has(msg.productKey!)}
                              className="flex-1 py-2 text-xs font-bold rounded-lg transition-all"
                              style={{
                                background: proposal.has(msg.productKey!) ? "#e7f4ee" : AMBER,
                                color: proposal.has(msg.productKey!) ? "#1F9D6B" : NAVY,
                              }}
                            >
                              {proposal.has(msg.productKey!) ? "✓ Added" : "+ Add to proposal"}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Story Card */}
                      {msg.type === "story_card" && (
                        <div className="bg-white border rounded-[14px] p-3.5 my-1 text-xs space-y-1" style={{ borderColor: LINE_COLOR }}>
                          <div className="text-[11.5px] text-[#5B6770]">Customer story · {STORY.region}</div>
                          <div className="text-3xl font-extrabold" style={{ color: NAVY }}>{STORY.metric}</div>
                          <p className="text-xs text-[#5B6770] font-medium">{STORY.sub}</p>
                        </div>
                      )}

                      {/* ROI Card */}
                      {msg.type === "roi_card" && (
                        <div className="bg-white border rounded-[14px] p-3.5 my-1 text-xs space-y-2" style={{ borderColor: LINE_COLOR }}>
                          <div className="font-bold flex items-center gap-1.5" style={{ color: NAVY }}>
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                            <span>ROI Estimator</span>
                          </div>
                          <div className="p-2.5 rounded-lg text-center font-bold" style={{ background: "#EAF1F8", color: NAVY }}>
                            ≈ 136 hrs & $6,120 saved / mo
                          </div>
                          <button
                            onClick={() => {
                              setRoiAttached(true);
                              setStage((prev) => Math.max(prev, 3));
                            }}
                            disabled={roiAttached}
                            className="w-full py-2.5 font-bold rounded-lg transition-all"
                            style={{
                              background: roiAttached ? "#e7f4ee" : AMBER,
                              color: roiAttached ? "#1F9D6B" : NAVY,
                            }}
                          >
                            {roiAttached ? "✓ ROI Added" : "Add ROI to proposal"}
                          </button>
                        </div>
                      )}

                      {/* Proposal Form */}
                      {msg.type === "proposal_form" && (
                        <div className="bg-white border rounded-[14px] p-3.5 my-1 text-xs space-y-2.5" style={{ borderColor: LINE_COLOR }}>
                          <div className="font-bold text-[14px]" style={{ color: NAVY }}>Your Proposal</div>
                          <input
                            type="email"
                            placeholder="Your work email..."
                            className="w-full p-2.5 border rounded-lg text-xs outline-none focus:border-[#1E6FB8]"
                            style={{ borderColor: LINE_COLOR }}
                          />
                          <button
                            onClick={() => {
                              addAssistantMessage({
                                content: "Proposal PDF generated! Let's lock in a demo walkthrough next:",
                              });
                              setTimeout(handleStartBooking, 800);
                            }}
                            className="w-full py-2.5 font-bold rounded-lg transition-colors"
                            style={{ background: AMBER, color: NAVY }}
                          >
                            Generate Proposal PDF
                          </button>
                        </div>
                      )}

                      {/* Booking Grid */}
                      {msg.type === "booking_grid" && (
                        <div className="bg-white border rounded-[14px] p-3.5 my-1 text-xs space-y-2" style={{ borderColor: LINE_COLOR }}>
                          <div className="font-bold text-[14px]" style={{ color: NAVY }}>Pick a Time</div>
                          <div className="grid grid-cols-2 gap-2">
                            {["Mon 29 · 09:00", "Tue 30 · 10:30", "Wed 1 · 13:00", "Thu 2 · 15:30"].map((slot) => (
                              <button
                                key={slot}
                                onClick={() => {
                                  addAssistantMessage({
                                    content: `✓ Booked — **${slot}**. Calendar invite queued!`,
                                  });
                                }}
                                className="p-2 border rounded-lg text-center font-semibold transition-colors hover:bg-[#1E6FB8] hover:text-white"
                                style={{ borderColor: LINE_COLOR, color: NAVY }}
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

              {isTyping && (
                <div className="flex items-center gap-1.5 pl-8 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E6FB8] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E6FB8] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E6FB8] animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Floating Proposal Bar */}
            {(proposal.size > 0 || roiAttached) && (
              <div
                onClick={handleBuildProposal}
                className="mx-3 mb-2 p-2.5 rounded-lg flex items-center justify-between cursor-pointer text-xs font-semibold text-white shadow-md"
                style={{ background: NAVY }}
              >
                <span>📄 {proposal.size} tool(s) in proposal</span>
                <span className="font-bold" style={{ color: AMBER }}>Build PDF →</span>
              </div>
            )}

            {/* Composer Box — Matches Screenshot 100% */}
            <div
              className="p-3 bg-white flex-shrink-0 space-y-2.5 border-t"
              style={{ borderColor: LINE_COLOR }}
            >
              {/* Row 1: Pill input with Circular Navy Send button */}
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendUserMessage(input);
                    }
                  }}
                  placeholder="Type your question..."
                  className="flex-1 px-4 py-2.5 text-[14px] border rounded-full bg-white outline-none transition-colors placeholder:text-[#5B6770]"
                  style={{ borderColor: LINE_COLOR, color: "#1B2733" }}
                />
                <button
                  onClick={() => sendUserMessage(input)}
                  className="w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-105 active:scale-95"
                  style={{ background: NAVY }}
                  title="Send"
                >
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-white">
                    <path d="M3 11l18-8-8 18-2-7-8-3z" />
                  </svg>
                </button>
              </div>

              {/* Row 2: Two CTA buttons side-by-side matching screenshot */}
              <div className="flex gap-2">                  <button
                    onClick={handleBuildProposal}
                    className="flex-1 py-2.5 px-3 text-[13px] font-bold rounded-[9px] transition-colors text-center"
                    style={{ background: NAVY, color: "#FFFFFF" }}
                  >
                    Build my proposal
                  </button>                  <button
                    onClick={handleStartBooking}
                    className="flex-1 py-2.5 px-3 text-[13px] font-bold rounded-[9px] transition-colors text-center hover:brightness-95"
                    style={{ background: "#FFEF1A", color: NAVY }}
                  >
                    Book a demo
                  </button>
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

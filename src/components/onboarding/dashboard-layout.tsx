"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Clock3,
  CreditCard,
  Dna,
  FileText,
  Files,
  FlaskConical,
  Filter,
  Gauge,
  HeartPulse,
  LayoutDashboard,
  Link2,
  MessageSquare,
  Minus,
  Moon,
  Pill,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Stethoscope,
  Sun,
  Thermometer,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type DashboardLayoutProps = {
  clientTitle: string;
};

type DashboardTheme = "light" | "dark";

type NavItem = {
  label: string;
  icon: LucideIcon;
};

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Timeline", icon: Link2 },
  { label: "Proposals", icon: FileText },
  { label: "Payments", icon: CreditCard },
  { label: "Change Requests", icon: Clock3 },
  { label: "Files", icon: Files },
  { label: "Messages", icon: MessageSquare },
  { label: "Support", icon: CircleHelp },
] satisfies NavItem[];

const timelineCards = [
  {
    id: "tokens",
    className: "left-[26%] top-[34%]",
    body: (
      <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white px-4 py-2 shadow-xl shadow-black/10">
        <span className="flex size-6 items-center justify-center rounded-full bg-lemon-yellow-bg text-lemon-yellow">
          <Sparkles className="size-3.5" />
        </span>
        <span className="text-sm font-semibold text-black">Tokens</span>
        <span className="text-xs text-gray-medium">v1</span>
      </div>
    ),
  },
  {
    id: "design",
    className: "left-[42%] top-[17%]",
    body: (
      <div className="w-56 rounded-2xl border border-white/70 bg-white p-4 text-black shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Design Lock</h3>
          <span className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            OK
          </span>
        </div>
        <p className="mt-2 text-xs text-gray-medium">Friday - 08 Jun</p>
        <svg viewBox="0 0 180 36" className="mt-4 h-9 w-full" aria-hidden="true">
          <path
            d="M0 25 C26 22 28 5 55 10 C79 14 72 25 104 16 C132 7 147 12 180 19"
            fill="none"
            stroke="#7c5cff"
            strokeWidth="2"
          />
        </svg>
        <div className="mt-3 flex items-center justify-between border-t border-gray-light pt-3 text-xs">
          <span className="text-gray-medium">Approval</span>
          <span className="font-bold text-emerald-600">+10</span>
        </div>
      </div>
    ),
  },
  {
    id: "sprint",
    className: "left-[63%] top-[58%]",
    body: (
      <div className="flex items-center gap-2 rounded-full border-2 border-lemon-yellow bg-white px-3 py-2 text-black shadow-xl shadow-black/15">
        <span className="size-4 rounded-full border-4 border-lemon-yellow" />
        <span className="text-sm font-bold">Sprint 02</span>
        <span className="text-xs font-semibold text-gray-medium">52%</span>
      </div>
    ),
  },
  {
    id: "build",
    className: "left-[74%] top-[70%]",
    body: (
      <div className="w-64 rounded-2xl border-2 border-lemon-yellow bg-white p-4 text-black shadow-2xl shadow-lemon-yellow/25">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-bold">Build sprint</h3>
          <span className="rounded-full bg-lemon-yellow px-2 py-1 text-[10px] font-bold text-black">DAY 11/21</span>
        </div>
        <p className="mt-4 text-3xl font-bold">
          4 <span className="text-sm font-medium text-gray-medium">tickets left</span>
        </p>
        <div className="mt-4 h-2 rounded-full bg-gray-light">
          <div className="h-full w-[52%] rounded-full bg-lemon-yellow" />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-medium">
          <span>23 Jun - 04 Jul</span>
          <span className="font-bold text-black">52%</span>
        </div>
      </div>
    ),
  },
] as const;

function clampZoom(value: number) {
  return Math.min(150, Math.max(75, value));
}

function initialsFromTitle(title: string) {
  const parts = title.split(" ").filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CW";
}

function DashboardSidebar({
  clientTitle,
  theme,
  activeSection,
  onAction,
}: DashboardLayoutProps & {
  theme: DashboardTheme;
  activeSection: string;
  onAction: (label: string) => void;
}) {
  const initials = initialsFromTitle(clientTitle);
  const isDark = theme === "dark";

  return (
    <aside
      className={cn(
        "flex w-full flex-col gap-6 border-b p-5 backdrop-blur-2xl transition-colors lg:h-full lg:w-72 lg:border-b-0 lg:border-r",
        isDark ? "border-white/10 bg-black/70" : "border-black/10 bg-white/80",
      )}
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-lemon-yellow text-black shadow-lg shadow-lemon-yellow/30">
          <BriefcaseBusiness className="size-5" />
        </span>
        <span className="min-w-0">
          <span className={cn("block text-xl font-semibold tracking-tight", isDark ? "text-white" : "text-black")}>
            Concolabs
          </span>
          <span className="block truncate text-xs font-medium text-gray-medium">Welcome to {clientTitle}</span>
        </span>
      </div>

      <button
        type="button"
        onClick={() => onAction("Workspace")}
        className={cn(
          "flex items-center justify-between rounded-2xl border px-3 py-3 text-left shadow-sm transition hover:border-lemon-yellow hover:bg-lemon-yellow-bg",
          isDark ? "border-white/10 bg-white/10" : "border-black/10 bg-white",
        )}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
              isDark ? "bg-lemon-yellow text-black" : "bg-black text-white",
            )}
          >
            {initials}
          </span>
          <span className="min-w-0">
            <span className={cn("block truncate text-sm font-bold", isDark ? "text-white" : "text-black")}>
              {clientTitle}
            </span>
          </span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-gray-medium" />
      </button>

      <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.label;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onAction(item.label)}
              className={cn(
                "group flex min-h-12 items-center justify-between rounded-2xl border border-transparent px-3 text-left transition",
                isActive
                  ? "bg-lemon-yellow-bg text-black ring-1 ring-lemon-yellow/50"
                  : isDark
                    ? "text-white/80 hover:border-lemon-yellow/50 hover:bg-white/10"
                    : "text-gray-dark hover:border-lemon-yellow/50 hover:bg-white",
              )}
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon className={cn("size-4 shrink-0", isActive ? "text-lemon-yellow" : "text-gray-medium")} />
                <span className="truncate text-sm font-semibold">{item.label}</span>
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function MiniCalendar({
  theme,
}: {
  theme: DashboardTheme;
}) {
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "fixed right-6 top-20 z-[9999] w-72 rounded-3xl border p-4 shadow-2xl backdrop-blur-2xl",
        isDark ? "border-white/10 bg-black/90 text-white" : "border-black/10 bg-white/95 text-black",
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <strong>June 2026</strong>
        <span className="rounded-full bg-lemon-yellow px-3 py-1 text-xs font-bold text-black">Jun 1 - Jun 23</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-medium">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <span key={`${day}-${index}`} className="py-1 font-bold">
            {day}
          </span>
        ))}
        {Array.from({ length: 30 }).map((_, index) => {
          const day = index + 1;
          const selected = day >= 1 && day <= 23;

          return (
            <button
              key={day}
              type="button"
              className={cn(
                "aspect-square rounded-xl text-xs font-semibold transition hover:bg-lemon-yellow hover:text-black",
                selected ? "bg-lemon-yellow-bg text-lemon-yellow" : isDark ? "text-white/70" : "text-gray-dark",
                day === 23 && "bg-lemon-yellow text-black",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NotificationsPanel({
  theme,
}: {
  theme: DashboardTheme;
}) {
  const isDark = theme === "dark";
  const notifications = [
    { title: "Review design lock", body: "Design Lock is ready for client review.", time: "Now" },
    { title: "Sprint update", body: "Build sprint moved to 52% completion.", time: "12m" },
    { title: "Payment draft", body: "June payment application needs approval.", time: "1h" },
  ];

  return (
    <div
      className={cn(
        "fixed right-20 top-20 z-[9999] w-80 rounded-3xl border p-4 shadow-2xl backdrop-blur-2xl",
        isDark ? "border-white/10 bg-black/90 text-white" : "border-black/10 bg-white/95 text-black",
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <strong>Notifications</strong>
        <span className="rounded-full bg-lemon-yellow px-2.5 py-1 text-xs font-bold text-black">3 review</span>
      </div>
      <div className="space-y-2">
        {notifications.map((item) => (
          <button
            key={item.title}
            type="button"
            className={cn(
              "w-full rounded-2xl border p-3 text-left transition hover:border-lemon-yellow hover:bg-lemon-yellow-bg",
              isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-white",
            )}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold">{item.title}</span>
              <span className="text-xs text-gray-medium">{item.time}</span>
            </span>
            <span className="mt-1 block text-xs leading-5 text-gray-medium">{item.body}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DashboardHeader({
  clientTitle,
  theme,
  activeSection,
  onThemeToggle,
  calendarOpen,
  onCalendarToggle,
  notificationsOpen,
  onNotificationsToggle,
  onAction,
}: DashboardLayoutProps & {
  theme: DashboardTheme;
  activeSection: string;
  onThemeToggle: () => void;
  calendarOpen: boolean;
  onCalendarToggle: () => void;
  notificationsOpen: boolean;
  onNotificationsToggle: () => void;
  onAction: (label: string) => void;
}) {
  const isDark = theme === "dark";
  const ThemeIcon = isDark ? Sun : Moon;

  return (
    <header
      className={cn(
        "relative z-[120] flex flex-col gap-4 border-b px-4 py-4 backdrop-blur-2xl transition-colors xl:flex-row xl:items-center xl:justify-between xl:px-8",
        isDark ? "border-white/10 bg-black/55" : "border-black/10 bg-white/65",
      )}
    >
      <div className="min-w-0 text-sm text-gray-medium">
        <span>{clientTitle}</span>
        <span className="mx-2">/</span>
        <strong className={cn(isDark ? "text-white" : "text-black")}>{activeSection}</strong>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label
          className={cn(
            "flex h-11 min-w-0 flex-1 items-center gap-3 rounded-2xl border px-4 shadow-sm transition-colors xl:w-96 xl:flex-none",
            isDark ? "border-white/10 bg-white/10" : "border-black/10 bg-white",
          )}
        >
          <Search className="size-4 text-gray-medium" />
          <input
            className={cn(
              "min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-medium",
              isDark ? "text-white" : "text-black",
            )}
            placeholder="Search anything"
          />
        </label>

        <div className="relative flex items-center gap-2">
          {[
            { icon: Bell, label: "Notifications", onClick: onNotificationsToggle },
            { icon: CalendarDays, label: "Open calendar", onClick: onCalendarToggle },
            { icon: ThemeIcon, label: isDark ? "Switch to light theme" : "Switch to dark theme", onClick: onThemeToggle },
          ].map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className={cn(
                "flex size-11 items-center justify-center rounded-2xl border shadow-sm transition hover:border-lemon-yellow hover:bg-lemon-yellow hover:text-black",
                isDark ? "border-white/10 bg-white/10 text-white" : "border-black/10 bg-white text-black",
                calendarOpen && label === "Open calendar" && "border-lemon-yellow bg-lemon-yellow text-black",
                notificationsOpen && label === "Notifications" && "border-lemon-yellow bg-lemon-yellow text-black",
              )}
              aria-label={label}
            >
              <Icon className="size-4" />
            </button>
          ))}

          {notificationsOpen && <NotificationsPanel theme={theme} />}
          {calendarOpen && <MiniCalendar theme={theme} />}
        </div>
      </div>
    </header>
  );
}

function TimelineDashboard({
  theme,
  calendarOpen,
  onCalendarToggle,
  onAction,
}: {
  theme: DashboardTheme;
  calendarOpen: boolean;
  onCalendarToggle: () => void;
  onAction: (label: string) => void;
}) {
  const [zoom, setZoom] = useState(100);
  const [todayFocus, setTodayFocus] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<null | { x: number; y: number; panX: number; panY: number }>(null);
  const reduceMotion = useReducedMotion();
  const isDark = theme === "dark";

  const nodeVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduceMotion ? 0 : 18, scale: reduceMotion ? 1 : 0.96 },
      show: { opacity: 1, y: 0, scale: 1 },
    }),
    [reduceMotion],
  );

  function jumpToToday() {
    setZoom(100);
    setPan({ x: 0, y: 0 });
    setTodayFocus(true);
    window.setTimeout(() => setTodayFocus(false), 1200);
  }

  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragStart({ x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y });
  }

  function moveDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragStart) return;
    setPan({
      x: dragStart.panX + event.clientX - dragStart.x,
      y: dragStart.panY + event.clientY - dragStart.y,
    });
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragStart(null);
  }

  return (
    <section className={cn("flex min-h-0 flex-1 flex-col p-4 transition-colors sm:p-6 xl:p-8", isDark ? "bg-black/80" : "bg-gray-light/70")}>
      <div className="relative min-h-[760px] flex-1 overflow-hidden rounded-[2rem] bg-[#e7e7df] shadow-2xl shadow-black/20">
        <div className="absolute inset-x-0 top-0 z-[100] h-[322px] select-none bg-[#e7e7df]">
          <div className="absolute left-0 top-0 h-[88px] w-full rounded-b-[42px] bg-[#262624]" />
          <div className="absolute left-0 top-0 h-[88px] w-[600px] rounded-br-[76px] bg-[#e7e7df]" />
          <h1 className="absolute left-16 top-6 text-4xl font-semibold tracking-tight text-[#181818]">Project Timeline</h1>

          <div className="absolute left-[620px] top-[104px] z-[80] flex flex-wrap justify-end gap-2">
            <div className="flex h-11 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg shadow-black/10">
              <button
                type="button"
                onClick={() => setZoom((value) => clampZoom(value - 25))}
                className="flex w-11 items-center justify-center text-black transition hover:bg-lemon-yellow"
                aria-label="Zoom out"
              >
                <Minus className="size-4" />
              </button>
              <span className="flex w-16 items-center justify-center border-x border-black/10 text-sm font-bold text-black">{zoom}%</span>
              <button
                type="button"
                onClick={() => setZoom((value) => clampZoom(value + 25))}
                className="flex w-11 items-center justify-center text-black transition hover:bg-lemon-yellow"
                aria-label="Zoom in"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={jumpToToday}
              className={cn(
                "flex h-11 items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-black shadow-lg shadow-black/10 transition hover:bg-lemon-yellow",
                todayFocus && "bg-lemon-yellow",
              )}
            >
              <Gauge className="size-4" /> Jump to today
            </button>
          </div>

          <div className="absolute left-[625px] top-4 flex gap-3">
            {[
              { label: "Treatment Dynamics", icon: Search, active: true },
              { label: "Visits", icon: CalendarDays },
              { label: "Medications", icon: Pill },
              { label: "Labs", icon: FlaskConical },
              { label: "Allergies", icon: Settings },
              { label: "Genetics", icon: Dna },
            ].map(({ label, icon: Icon, active }) => (
              <button
                key={label}
                type="button"
                onClick={() => onAction(label)}
                className={cn(
                  "flex h-14 items-center gap-3 rounded-full border border-black/15 px-6 text-sm font-semibold text-[#232323] shadow-sm transition hover:bg-lemon-yellow",
                  active ? "bg-white" : "bg-[#f5f5ef]",
                )}
              >
                <Icon className="size-5" />
                {label}
              </button>
            ))}
          </div>

          <div className="absolute left-[98px] top-[135px] flex h-[150px] w-[330px] items-center gap-6 rounded-[38px] bg-[#f5f5ef] p-6">
            <div className="h-[118px] w-[128px] overflow-hidden rounded-[32px] bg-[linear-gradient(140deg,#f8e7dc,#ffffff)]">
              <div className="mx-auto mt-4 h-20 w-20 rounded-full bg-[#d8a88d]" />
              <div className="mx-auto mt-2 h-8 w-28 rounded-t-full bg-[#f3c3ac]" />
            </div>
            <div>
              <p className="mb-2 text-xs text-[#6f6f69]">Female, 24</p>
              <p className="text-lg font-bold leading-6 text-[#191919]">Tiffany<br />Woodward</p>
            </div>
          </div>

          <div className="absolute left-[540px] top-[140px] grid grid-cols-[260px_repeat(4,140px)] gap-9 text-[#191919]">
            <div>
              <p className="text-xs text-[#6f6f69]">Diagnosis</p>
              <p className="text-3xl font-medium">Hypertension</p>
            </div>
            {[
              ["Heart Rate", "89", "bpm"],
              ["Pressure", "100", "/67"],
              ["Oxygen", "98", "%"],
              ["Temperature", "36.8", "C"],
            ].map(([label, value, unit]) => (
              <div key={label}>
                <p className="text-xs text-[#6f6f69]">{label}</p>
                <p className="text-3xl font-medium">
                  {value}<span className="ml-1 text-base">{unit}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="absolute left-[540px] top-[218px] flex gap-3">
            <button className="flex size-16 items-center justify-center rounded-full bg-white text-[#202020] shadow-sm" type="button">
              <SlidersHorizontal className="size-6" />
            </button>
            {["Office Visits", "Medications", "Labs", "Procedures", "Hospitalizations", "Imaging"].map((label, index) => (
              <button
                key={label}
                type="button"
                className={cn(
                  "h-14 rounded-full px-8 text-sm font-semibold shadow-sm transition hover:bg-lemon-yellow",
                  index < 3 ? "bg-white text-[#222]" : "bg-[#f1f1eb] text-[#777]",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          className={cn(
            "relative z-10 h-full min-h-[760px] w-[1540px] origin-center select-none",
            dragStart ? "cursor-grabbing" : "cursor-grab",
          )}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
            transformOrigin: "center",
          }}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: reduceMotion ? 0 : 0.12, delayChildren: reduceMotion ? 0 : 0.1 } },
          }}
        >
          <svg className="absolute left-0 top-[332px] h-[520px] w-full" viewBox="0 0 1540 520" fill="none" aria-hidden="true">
            <path d="M0 0H1450" stroke="#dfb7aa" strokeWidth="3" />
            <path d="M520 0H1450" stroke="#bdd7be" strokeWidth="3" />
            <path d="M134 0V520" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
            <path d="M830 0V520" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
            <path d="M134 0H270C305 0 306 38 306 72V370C306 410 330 432 372 432H454" stroke="#6c6d68" strokeWidth="2" />
            <path d="M306 150H380C410 150 418 174 418 210V220C418 247 440 262 468 262H520" stroke="#9b9c96" strokeWidth="2" />
            <path d="M830 0H960C997 0 1000 42 1000 80V370C1000 412 1024 430 1068 430H1155" stroke="#6c6d68" strokeWidth="2" />
            <path d="M1000 150H1088C1119 150 1127 176 1127 212V222C1127 248 1148 260 1180 260H1225" stroke="#9b9c96" strokeWidth="2" />
          </svg>

          {[134, 830].map((left, index) => (
            <button
              key={left}
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => onAction(index === 0 ? "August visit" : "September visit")}
              className="absolute top-[304px] flex size-16 items-center justify-center rounded-full bg-lemon-yellow text-[#222] shadow-[0_0_24px_rgba(248,231,28,0.7)]"
              style={{ left: left - 32 }}
              aria-label={index === 0 ? "August visit" : "September visit"}
            >
              <CalendarDays className="size-6" />
            </button>
          ))}

          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onAction("Add timeline item")}
            className="absolute left-[1412px] top-[304px] flex size-16 items-center justify-center rounded-full bg-[#1f2526] text-white shadow-lg"
            aria-label="Add timeline item"
          >
            <Plus className="size-7" />
          </button>

          <div className="absolute left-[194px] top-[398px] text-[#222]">
            <p className="text-3xl font-medium">Aug</p>
            <p className="text-sm text-[#74746f]">I Week</p>
          </div>
          <div className="absolute left-[890px] top-[398px] text-[#222]">
            <p className="text-3xl font-medium">Sep</p>
            <p className="text-sm text-[#74746f]">I Week</p>
          </div>
          <div className="absolute left-[194px] top-[705px] text-lg font-semibold text-[#6f6f69]">II Week</div>

          <div className="absolute left-[192px] top-[474px] flex h-[70px] w-[190px] items-center rounded-full bg-[#9a9d99] py-2 pl-14 pr-7 text-white shadow-md">
            <button className="absolute -left-8 flex size-16 items-center justify-center rounded-full bg-white text-[#333] shadow-md" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => onAction("Aspirin")}>
              <Pill className="size-7" />
            </button>
            <span className="text-sm font-semibold">Aspirin</span>
            <span className="ml-auto text-sm">x2</span>
          </div>

          <div className="absolute left-[900px] top-[474px] space-y-4">
            {[
              ["Bisoprolol", "x3"],
              ["Aspirin", "x2"],
            ].map(([name, dose]) => (
              <div key={name} className="relative flex h-[70px] w-[210px] items-center rounded-full bg-[#9a9d99] py-2 pl-14 pr-7 text-white shadow-md">
                <button className="absolute -left-8 flex size-16 items-center justify-center rounded-full bg-white text-[#333] shadow-md" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => onAction(name)}>
                  <Pill className="size-7" />
                </button>
                <span className="text-sm font-semibold">{name}</span>
                <span className="ml-auto text-sm">{dose}</span>
              </div>
            ))}
          </div>

          {[{ left: 132, top: 610 }, { left: 828, top: 610 }].map((item, index) => (
            <button
              key={`${item.left}-${item.top}`}
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => setPan((value) => ({ ...value, y: value.y + (index === 0 ? -80 : 80) }))}
              className="absolute flex h-20 w-12 flex-col items-center justify-center gap-2 rounded-2xl bg-white text-[#202020] shadow-md"
              style={{ left: item.left - 24, top: item.top }}
              aria-label="Move timeline lane"
            >
              <ChevronDown className="size-4 rotate-180" />
              <ChevronDown className="size-4" />
            </button>
          ))}

          <motion.div variants={nodeVariants} className="absolute left-[442px] top-[475px] w-[330px] rounded-[32px] bg-white p-6 text-[#191919] shadow-xl">
            <div className="mb-5 flex items-start justify-between">
              <h2 className="text-2xl font-medium">Blood Pressure</h2>
              <span className="flex size-14 items-center justify-center rounded-full bg-[#f4f4ef]">
                <Gauge className="size-6" />
              </span>
            </div>
            <div className="relative h-[68px] overflow-hidden">
              <div className="absolute left-0 top-3 h-8 w-full bg-lemon-yellow" />
              <svg viewBox="0 0 280 78" className="absolute inset-0 h-full w-full">
                <path d="M0 50 C35 66 63 38 98 48 C136 60 172 30 212 41 C244 48 260 38 280 34" fill="none" stroke="#a4a6a1" strokeWidth="16" opacity="0.5" />
                <path d="M0 44 C48 58 68 30 110 42 C151 55 179 35 224 40 C251 43 266 36 280 30" fill="none" stroke="#303734" strokeWidth="2" />
              </svg>
              <div className="absolute right-14 top-0 text-xs">Friday</div>
              <div className="absolute right-14 top-9 rounded-full bg-[#202829] px-4 py-2 text-sm font-bold text-white">180 / 120</div>
              <div className="absolute right-[91px] top-12 h-12 w-px bg-[#202829]" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm">Average: <strong className="text-2xl font-medium">160</strong> / 110</span>
              <span className="text-2xl font-medium">+10</span>
            </div>
          </motion.div>

          <motion.div variants={nodeVariants} className="absolute left-[1165px] top-[475px] w-[330px] rounded-[32px] bg-white p-6 text-[#191919] shadow-xl">
            <div className="mb-5 flex items-start justify-between">
              <h2 className="text-2xl font-medium">Blood Pressure</h2>
              <span className="flex size-14 items-center justify-center rounded-full bg-[#f4f4ef]">
                <Gauge className="size-6" />
              </span>
            </div>
            <div className="relative h-[68px] overflow-hidden">
              <div className="absolute left-0 top-3 h-8 w-[150px] bg-lemon-yellow" />
              <svg viewBox="0 0 280 78" className="absolute inset-0 h-full w-full">
                <path d="M0 50 C35 66 63 38 98 48 C136 60 172 30 212 41 C244 48 260 38 280 34" fill="none" stroke="#a4a6a1" strokeWidth="16" opacity="0.5" />
                <path d="M0 44 C48 58 68 30 110 42 C151 55 179 35 224 40 C251 43 266 36 280 30" fill="none" stroke="#303734" strokeWidth="2" />
              </svg>
              <div className="absolute right-14 top-0 text-xs">Thursday</div>
              <div className="absolute right-14 top-9 rounded-full bg-[#202829] px-4 py-2 text-sm font-bold text-white">135 / 92</div>
              <div className="absolute right-[91px] top-12 h-12 w-px bg-[#202829]" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm">Average: <strong className="text-2xl font-medium">130</strong> / 90</span>
              <span className="text-2xl font-medium">-20</span>
            </div>
          </motion.div>

          <motion.div variants={nodeVariants} className="absolute left-[442px] top-[710px] h-[220px] w-[330px] rounded-[32px] bg-white p-6 text-[#191919] shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-2xl font-medium">Symptoms</h2>
              <span className="flex size-14 items-center justify-center rounded-full bg-[#f4f4ef]">
                <Gauge className="size-6" />
              </span>
            </div>
            <span className="rounded-full bg-[#f2f2ed] px-4 py-2 text-sm">Headache</span>
            <div className="mt-4 h-28 rounded-3xl bg-[radial-gradient(circle_at_48%_20%,#f3c781_0_6%,transparent_7%),radial-gradient(circle_at_54%_42%,#ee928d_0_8%,transparent_9%),radial-gradient(circle_at_42%_68%,#92c77a_0_6%,transparent_7%)]" />
          </motion.div>

          <motion.div variants={nodeVariants} className="absolute left-[1165px] top-[710px] h-[220px] w-[330px] rounded-[32px] bg-white p-6 text-[#191919] shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-2xl font-medium">ECG</h2>
              <span className="flex size-14 items-center justify-center rounded-full bg-[#f4f4ef]">
                <HeartPulse className="size-6" />
              </span>
            </div>
            <svg viewBox="0 0 280 80" className="mt-6 h-24 w-full">
              <path d="M0 50 H32 L45 25 L58 68 L70 48 H112 L124 12 L137 70 L150 48 H205 L218 20 L232 66 L248 48 H280" fill="none" stroke="#202020" strokeWidth="3" />
              <path d="M0 58 H32 L45 36 L58 72 L70 55 H112 L124 25 L137 74 L150 55 H205 L218 32 L232 72 L248 55 H280" fill="none" stroke="#efb8ac" strokeWidth="3" opacity="0.7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function EmptySection({
  section,
  theme,
}: {
  section: string;
  theme: DashboardTheme;
}) {
  const isDark = theme === "dark";

  return (
    <section
      className={cn(
        "flex min-h-0 flex-1 flex-col p-4 transition-colors sm:p-6 xl:p-8",
        isDark ? "bg-black/80" : "bg-gray-light/70",
      )}
    >
      <div
        className={cn(
          "flex min-h-[640px] flex-1 items-center justify-center rounded-[2rem] border border-dashed border-lemon-yellow p-8 text-center shadow-2xl backdrop-blur-2xl",
          isDark ? "bg-white/10 shadow-black/30" : "bg-white/65 shadow-black/5",
        )}
      >
        <div className="max-w-md">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-medium">Selected page</p>
          <h1 className={cn("mt-3 text-4xl font-semibold tracking-tight", isDark ? "text-white" : "text-black")}>
            {section}
          </h1>
          <p className="mt-4 text-sm leading-6 text-gray-medium">
            This area is ready for {section.toLowerCase()} content. It is intentionally empty for now.
          </p>
        </div>
      </div>
    </section>
  );
}

export function DashboardLayout({ clientTitle }: DashboardLayoutProps) {
  const [theme, setTheme] = useState<DashboardTheme>("light");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Timeline");
  const [lastAction, setLastAction] = useState("Timeline");
  const isDark = theme === "dark";

  function handleAction(label: string) {
    setLastAction(label);
    if (navItems.some((item) => item.label === label)) {
      setActiveSection(label);
      setCalendarOpen(false);
      setNotificationsOpen(false);
    }
  }

  return (
    <main className={cn("relative z-[60] min-h-svh p-0 transition-colors lg:p-5", isDark ? "bg-black" : "bg-black")}>
      <div
        className={cn(
          "mx-auto flex min-h-svh w-full max-w-[1680px] flex-col overflow-hidden shadow-2xl shadow-black/40 backdrop-blur-2xl transition-colors lg:min-h-[calc(100svh-2.5rem)] lg:rounded-[2rem] lg:flex-row",
          isDark ? "bg-[#111111]/95" : "bg-white/90",
        )}
      >
        <DashboardSidebar clientTitle={clientTitle} theme={theme} activeSection={activeSection} onAction={handleAction} />
        <div className="flex min-h-0 flex-1 flex-col">
          <DashboardHeader
            clientTitle={clientTitle}
            theme={theme}
            activeSection={activeSection}
            onThemeToggle={() => setTheme((value) => (value === "light" ? "dark" : "light"))}
            calendarOpen={calendarOpen}
            onCalendarToggle={() => {
              setNotificationsOpen(false);
              setCalendarOpen((value) => !value);
            }}
            notificationsOpen={notificationsOpen}
            onNotificationsToggle={() => {
              setCalendarOpen(false);
              setNotificationsOpen((value) => !value);
              setLastAction("Notifications");
            }}
            onAction={handleAction}
          />
          {activeSection === "Timeline" ? (
            <TimelineDashboard
              theme={theme}
              calendarOpen={calendarOpen}
              onCalendarToggle={() => {
                setNotificationsOpen(false);
                setCalendarOpen((value) => !value);
              }}
              onAction={handleAction}
            />
          ) : (
            <EmptySection section={activeSection} theme={theme} />
          )}
          <span className="sr-only" aria-live="polite">
            {lastAction}
          </span>
        </div>
      </div>
    </main>
  );
}

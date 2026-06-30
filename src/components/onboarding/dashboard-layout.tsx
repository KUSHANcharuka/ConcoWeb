"use client";

import { useState } from "react";
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Clock3,
  CreditCard,
  FileText,
  Files,
  LayoutDashboard,
  Link2,
  Mail,
  MessageSquare,
  Moon,
  Search,
  Sun,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import ConstructionTimeline from "./construction-timeline";


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
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
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
        </span>
      </div>

      <div className={cn("text-3xl font-extrabold tracking-tight", isDark ? "text-white" : "text-black")}>
        Wel Come!
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setWorkspaceDropdownOpen((prev) => !prev)}
          className={cn(
            "flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left shadow-sm transition hover:border-lemon-yellow hover:bg-lemon-yellow-bg",
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
          <ChevronDown className={cn("size-4 shrink-0 text-gray-medium transition-transform", workspaceDropdownOpen && "rotate-180")} />
        </button>

        {workspaceDropdownOpen && (
          <div
            className={cn(
              "absolute left-0 top-full z-[130] mt-2 w-full rounded-2xl border p-2 shadow-xl backdrop-blur-xl transition-all",
              isDark ? "border-white/10 bg-black/95 text-white" : "border-black/10 bg-white/95 text-black",
            )}
          >
            <button
              type="button"
              onClick={() => {
                onAction("Settings");
                setWorkspaceDropdownOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold transition",
                isDark ? "hover:bg-white/10" : "hover:bg-black/5",
              )}
            >
              Settings
            </button>
            <button
              type="button"
              onClick={() => {
                onAction("Sign out");
                setWorkspaceDropdownOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-500 transition",
                isDark ? "hover:bg-white/10" : "hover:bg-black/5",
              )}
            >
              Sign out
            </button>
          </div>
        )}
      </div>

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
                  ? isDark
                    ? "bg-lemon-yellow text-black font-bold ring-1 ring-lemon-yellow"
                    : "bg-lemon-yellow-bg text-black ring-1 ring-lemon-yellow/50"
                  : isDark
                    ? "text-white/80 hover:border-lemon-yellow/50 hover:bg-white/10"
                    : "text-gray-dark hover:border-lemon-yellow/50 hover:bg-white",
              )}
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon className={cn("size-4 shrink-0", isActive ? "text-black" : "text-gray-medium")} />
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
                selected
                  ? isDark
                    ? "bg-white/15 text-white font-bold"
                    : "bg-black/5 text-black font-bold"
                  : isDark
                    ? "text-white/70"
                    : "text-gray-dark",
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

const ToggleSwitch = ({
  checked,
  onChange,
  label,
  sublabel,
  theme,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  sublabel?: string;
  theme: DashboardTheme;
}) => {
  const isDark = theme === "dark";
  return (
    <div className="flex items-start gap-4 py-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
          checked ? "bg-lemon-yellow" : isDark ? "bg-white/10" : "bg-black/10",
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5 bg-black" : "translate-x-0",
          )}
        />
      </button>
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{label}</span>
        {sublabel && <span className="text-xs text-gray-medium mt-0.5 max-w-xl leading-relaxed">{sublabel}</span>}
      </div>
    </div>
  );
};

const CheckboxField = ({
  checked,
  onChange,
  label,
  sublabel,
  theme,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  sublabel?: string;
  theme: DashboardTheme;
}) => {
  const isDark = theme === "dark";
  return (
    <div className="flex items-start gap-3 py-2.5">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded border transition-colors duration-200 focus:outline-none mt-0.5",
          checked
            ? "border-lemon-yellow bg-lemon-yellow text-black"
            : isDark
              ? "border-white/20 bg-white/5 hover:border-lemon-yellow/50"
              : "border-black/20 bg-black/5 hover:border-lemon-yellow/50",
        )}
      >
        {checked && (
          <svg className="size-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{label}</span>
        {sublabel && <span className="text-xs text-gray-medium mt-0.5 leading-relaxed">{sublabel}</span>}
      </div>
    </div>
  );
};

function SettingsSection({
  clientTitle,
  onClientTitleChange,
  theme,
}: {
  clientTitle: string;
  onClientTitleChange: (value: string) => void;
  theme: DashboardTheme;
}) {
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState("Edit Profile");
  const [companyLocation, setCompanyLocation] = useState("Colombo");
  const [companyProfile, setCompanyProfile] = useState("");
  const [companyEmail, setCompanyEmail] = useState("hello@concolabs.com");
  const [companyType, setCompanyType] = useState("Agency");

  const [companyPassword, setCompanyPassword] = useState("");
  const [passwordReset, setPasswordReset] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notifications State
  const [enableDesktop, setEnableDesktop] = useState(false);
  const [communicationAlert, setCommunicationAlert] = useState(false);
  const [activityAlert, setActivityAlert] = useState(true);
  const [drafteesAlert, setDrafteesAlert] = useState(false);
  const [meetupsAlert, setMeetupsAlert] = useState(true);
  const [marketingAlert, setMarketingAlert] = useState(true);

  // Privacy State
  const [activityStatus, setActivityStatus] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);

  return (
    <section
      className={cn(
        "flex min-h-0 flex-1 flex-col p-4 transition-colors sm:p-6 xl:p-8",
        isDark ? "bg-black/80" : "bg-gray-light/70",
      )}
    >
      <div
        className={cn(
          "flex min-h-[640px] flex-1 flex-col rounded-[2rem] border p-6 shadow-2xl backdrop-blur-2xl transition-colors lg:flex-row lg:p-8",
          isDark ? "border-white/10 bg-[#121212] shadow-black/40 text-white" : "border-black/10 bg-white shadow-black/5 text-black",
        )}
      >
        {/* Left Settings Sidebar */}
        <div className="w-full shrink-0 border-b pb-6 lg:w-56 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6 border-white/10 flex flex-col gap-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-medium mb-3 px-3">General</div>
            <nav className="flex flex-wrap gap-1 lg:flex-col">
              {[
                { id: "Edit Profile", label: "Edit Profile" },
                { id: "Password", label: "Password" }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "rounded-xl px-3 py-2 text-left text-sm font-semibold transition-all",
                      isActive
                        ? isDark
                          ? "bg-lemon-yellow text-black font-bold animate-pulse-subtle"
                          : "bg-lemon-yellow-bg text-black font-bold border-l-4 border-lemon-yellow"
                        : isDark
                          ? "text-white/60 hover:bg-white/5 hover:text-white"
                          : "text-gray-dark hover:bg-black/5 hover:text-black",
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-medium mb-3 px-3">Preferences</div>
            <nav className="flex flex-wrap gap-1 lg:flex-col">
              {[
                { id: "Notifications", label: "Notifications" },
                { id: "Privacy & Security", label: "Privacy & Security" }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "rounded-xl px-3 py-2 text-left text-sm font-semibold transition-all",
                      isActive
                        ? isDark
                          ? "bg-lemon-yellow text-black font-bold animate-pulse-subtle"
                          : "bg-lemon-yellow-bg text-black font-bold border-l-4 border-lemon-yellow"
                        : isDark
                          ? "text-white/60 hover:bg-white/5 hover:text-white"
                          : "text-gray-dark hover:bg-black/5 hover:text-black",
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Right Settings Form */}
        <div className="flex-1 pt-6 lg:pl-8 lg:pt-0">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-6">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-lemon-yellow text-black text-xl font-bold shadow-lg shadow-lemon-yellow/30">
              {clientTitle.slice(0, 2).toUpperCase() || "CD"}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold tracking-tight">{clientTitle}</h2>
                <span className="text-xl text-gray-medium">/</span>
                <span className="text-xl font-medium text-gray-medium">{activeTab}</span>
              </div>
              <p className="text-sm text-gray-medium">
                {activeTab === "Notifications"
                  ? "Get notified of activity at Concolabs"
                  : activeTab === "Privacy & Security"
                    ? "Manage your privacy and security settings, and request a copy of your Concolabs data"
                    : "Set up your workspace presence and credentials"}
              </p>
            </div>
          </div>

          {activeTab === "Edit Profile" ? (
            <form onSubmit={(e) => e.preventDefault()} className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-medium mb-4">Profile Basics</h3>
                <div className="flex items-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-full bg-lemon-yellow text-black text-2xl font-bold shadow-lg shadow-lemon-yellow/30">
                    {clientTitle.slice(0, 2).toUpperCase() || "CD"}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={cn(
                        "rounded-xl border px-4 py-2 text-xs font-bold transition shadow-sm",
                        isDark ? "border-white/10 bg-white/10 hover:bg-white/20 text-white" : "border-black/10 bg-white hover:bg-black/5 text-black",
                      )}
                    >
                      Upload new picture
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "rounded-xl px-4 py-2 text-xs font-bold transition hover:bg-red-500/10 text-red-500",
                      )}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={clientTitle}
                  onChange={(e) => onClientTitleChange(e.target.value)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-sm font-semibold outline-none transition focus:border-lemon-yellow focus:ring-1 focus:ring-lemon-yellow",
                    isDark ? "border-white/10 bg-[#1c1c1e] text-white" : "border-black/10 bg-white text-black",
                  )}
                  placeholder="Company Name"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold">Company Profile</label>
                  <span className="text-xs text-gray-medium">{companyProfile.length}/1024</span>
                </div>
                <textarea
                  value={companyProfile}
                  onChange={(e) => setCompanyProfile(e.target.value.slice(0, 1024))}
                  rows={4}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-sm font-semibold outline-none transition focus:border-lemon-yellow focus:ring-1 focus:ring-lemon-yellow resize-none",
                    isDark ? "border-white/10 bg-[#1c1c1e] text-white" : "border-black/10 bg-white text-black",
                  )}
                  placeholder="Describe your company details..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold">Company Email</label>
                <input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-sm font-semibold outline-none transition focus:border-lemon-yellow focus:ring-1 focus:ring-lemon-yellow",
                    isDark ? "border-white/10 bg-[#1c1c1e] text-white" : "border-black/10 bg-white text-black",
                  )}
                  placeholder="hello@company.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold">Company Location</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-medium">
                    <Search className="size-4" />
                  </span>
                  <input
                    type="text"
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    className={cn(
                      "w-full rounded-xl border py-3 pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-lemon-yellow focus:ring-1 focus:ring-lemon-yellow",
                      isDark ? "border-white/10 bg-[#1c1c1e] text-white" : "border-black/10 bg-white text-black",
                    )}
                    placeholder="Colombo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold">Company Type</label>
                <select
                  value={companyType}
                  onChange={(e) => setCompanyType(e.target.value)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-sm font-semibold outline-none transition focus:border-lemon-yellow focus:ring-1 focus:ring-lemon-yellow",
                    isDark ? "border-white/10 bg-[#1c1c1e] text-white" : "border-black/10 bg-white text-black",
                  )}
                >
                  <option value="Agency">Agency</option>
                  <option value="Startup">Startup</option>
                  <option value="Enterprise">Enterprise</option>
                  <option value="Software House">Software House</option>
                  <option value="Consultancy">Consultancy</option>
                </select>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  type="submit"
                  className="rounded-xl bg-lemon-yellow px-6 py-3 text-sm font-bold text-black shadow-lg shadow-lemon-yellow/20 transition hover:bg-lemon-yellow/95 hover:shadow-lemon-yellow/30"
                >
                  Save changes
                </button>
              </div>
            </form>
          ) : activeTab === "Password" ? (
            <form onSubmit={(e) => e.preventDefault()} className="max-w-2xl space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold">Company Password</label>
                <input
                  type="password"
                  value={companyPassword}
                  onChange={(e) => setCompanyPassword(e.target.value)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-sm font-semibold outline-none transition focus:border-lemon-yellow focus:ring-1 focus:ring-lemon-yellow",
                    isDark ? "border-white/10 bg-[#1c1c1e] text-white" : "border-black/10 bg-white text-black",
                  )}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold">Password Reset</label>
                <input
                  type="password"
                  value={passwordReset}
                  onChange={(e) => setPasswordReset(e.target.value)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-sm font-semibold outline-none transition focus:border-lemon-yellow focus:ring-1 focus:ring-lemon-yellow",
                    isDark ? "border-white/10 bg-[#1c1c1e] text-white" : "border-black/10 bg-white text-black",
                  )}
                  placeholder="New Password"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-sm font-semibold outline-none transition focus:border-lemon-yellow focus:ring-1 focus:ring-lemon-yellow",
                    isDark ? "border-white/10 bg-[#1c1c1e] text-white" : "border-black/10 bg-white text-black",
                  )}
                  placeholder="Confirm New Password"
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  type="submit"
                  className="rounded-xl bg-lemon-yellow px-6 py-3 text-sm font-bold text-black shadow-lg shadow-lemon-yellow/20 transition hover:bg-lemon-yellow/95 hover:shadow-lemon-yellow/30"
                >
                  Reset Password
                </button>
              </div>
            </form>
          ) : activeTab === "Notifications" ? (
            <div className="max-w-3xl space-y-8">
              <div>
                <h3 className="text-lg font-bold border-b border-white/10 pb-3 mb-4">Browser Notifications</h3>
                <ToggleSwitch
                  checked={enableDesktop}
                  onChange={setEnableDesktop}
                  label="Enable Desktop Browser Notifications"
                  sublabel="Get real-time desktop alerts for new messages and other project activity while Concolabs is open in your browser – even in a background tab. Learn more"
                  theme={theme}
                />
              </div>

              <div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                  <h3 className="text-lg font-bold">Other Email Notifications</h3>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-medium flex justify-between items-center">
                    <span>Alerts</span>
                    <button
                      type="button"
                      onClick={() => {
                        const allChecked = communicationAlert && activityAlert && drafteesAlert && meetupsAlert && marketingAlert;
                        setCommunicationAlert(!allChecked);
                        setActivityAlert(!allChecked);
                        setDrafteesAlert(!allChecked);
                        setMeetupsAlert(!allChecked);
                        setMarketingAlert(!allChecked);
                      }}
                      className="text-sm font-bold uppercase tracking-wider text-gray-medium flex justify-between items-center"
                    >
                      Toggle all
                    </button>
                  </h4>

                  <div className="divide-y divide-white/5">
                    <CheckboxField
                      checked={communicationAlert}
                      onChange={setCommunicationAlert}
                      label="Concolabs Communication"
                      sublabel="Get Concolabs news, announcements, and product updates"
                      theme={theme}
                    />
                    <CheckboxField
                      checked={activityAlert}
                      onChange={setActivityAlert}
                      label="Account Activity"
                      sublabel="Get important notifications about you or activity you've missed"
                      theme={theme}
                    />
                    <CheckboxField
                      checked={drafteesAlert}
                      onChange={setDrafteesAlert}
                      label="Draftees"
                      sublabel="Once you receive invitations, you can get emails of Prospects looking to be drafted"
                      theme={theme}
                    />
                    <CheckboxField
                      checked={meetupsAlert}
                      onChange={setMeetupsAlert}
                      label="Meetups Near You"
                      sublabel="Get an email when a Concolabs Meetup is posted close to my location"
                      theme={theme}
                    />
                    <CheckboxField
                      checked={marketingAlert}
                      onChange={setMarketingAlert}
                      label="Marketing Updates"
                      sublabel="Stay informed about latest products, promotions, and special offers"
                      theme={theme}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "Privacy & Security" ? (
            <div className="max-w-3xl space-y-8">
              <div>
                <h3 className="text-lg font-bold border-b border-white/10 pb-3 mb-4">Activity Privacy</h3>
                <div className="space-y-3">
                  <ToggleSwitch
                    checked={activityStatus}
                    onChange={setActivityStatus}
                    label="Activity Status"
                    sublabel="Let others see when you're active or when you were last active."
                    theme={theme}
                  />
                  <ToggleSwitch
                    checked={readReceipts}
                    onChange={setReadReceipts}
                    label="Read Receipts"
                    sublabel="Show when messages have been read. If you turn this off, you won't see read receipts from others."
                    theme={theme}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold border-b border-white/10 pb-3 mb-3">Download your Concolabs data</h3>
                <p className="text-xs leading-relaxed text-gray-medium mb-4 max-w-2xl">
                  You can download a copy of your personal data stored on Concolabs. Once you request an export, we will prepare your data and notify you when it is ready for download.
                </p>
                <button
                  type="button"
                  className={cn(
                    "rounded-full px-5 py-2.5 text-xs font-bold transition shadow-sm",
                    isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/5 hover:bg-black/10 text-black",
                  )}
                >
                  Export your data
                </button>
              </div>

              <div className="pt-6 border-t border-white/10">
                <h3 className="text-lg font-bold text-red-500 mb-3">Delete Concolabs Account</h3>
                <p className="text-xs leading-relaxed text-gray-medium mb-4 max-w-2xl">
                  Deleting your account will permanently remove your Concolabs profile and all associated content. This action cannot be reversed.
                </p>
                <button
                  type="button"
                  className="rounded-full bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-600/10 transition hover:bg-red-500"
                >
                  Delete Account
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-medium">
              <h3 className="text-lg font-bold mb-2">{activeTab} settings</h3>
              <p className="text-sm">This page is intentionally empty for demonstration purposes.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function OverviewSection({
  clientTitle,
  theme,
  onAction,
}: {
  clientTitle: string;
  theme: DashboardTheme;
  onAction: (label: string) => void;
}) {
  const isDark = theme === "dark";

  return (
    <section
      className={cn(
        "flex min-h-0 flex-1 flex-col p-4 gap-6 overflow-y-auto transition-colors sm:p-6 xl:p-8",
        isDark ? "bg-black/80" : "bg-gray-light/70",
      )}
    >
      {/* Top Welcome banner */}
      <div
        className={cn(
          "rounded-[2rem] border p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors",
          isDark ? "border-white/10 bg-[#121212] text-white animate-pulse-subtle" : "border-black/10 bg-white text-black",
        )}
      >
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Overview</h1>
          <p className="text-sm text-gray-medium mt-1">
            Real-time stage updates, progress analytics, and upcoming schedules for {clientTitle}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onAction("Timeline")}
            className="rounded-xl bg-lemon-yellow px-4 py-2.5 text-xs font-bold text-black transition hover:bg-lemon-yellow/90 shadow-lg shadow-lemon-yellow/20"
          >
            View Interactive Timeline
          </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {/* Project Stage & Overall Progress */}
        <div
          className={cn(
            "rounded-[2rem] border p-6 flex flex-col justify-between min-h-[260px] shadow-sm transition-colors",
            isDark ? "border-white/10 bg-[#121212] text-white" : "border-black/10 bg-white text-black",
          )}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-medium">Current Project Stage</span>
            <h2 className={cn("text-3xl font-extrabold tracking-tight mt-2", isDark ? "text-white" : "text-black")}>Superstructure</h2>
            <p className="text-xs text-gray-medium mt-1">
              Active stage: Level 04 slab reinforcement and formwork
            </p>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">Overall Progress</span>
              <span className="text-sm font-bold">68%</span>
            </div>
            <div className={cn("h-3 w-full rounded-full overflow-hidden", isDark ? "bg-white/10" : "bg-black/10")}>
              <div
                className="h-full bg-lemon-yellow rounded-full transition-all duration-1000"
                style={{ width: "68%" }}
              />
            </div>
          </div>
        </div>

        {/* Next Payment & Amount */}
        <div
          className={cn(
            "rounded-[2rem] border p-6 flex flex-col justify-between min-h-[260px] shadow-sm transition-colors",
            isDark ? "border-white/10 bg-[#121212] text-white" : "border-black/10 bg-white text-black",
          )}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-medium">Upcoming Milestone Payment</span>
            <h2 className="text-3xl font-bold tracking-tight mt-2">$12,450.00</h2>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-medium">
              <CalendarDays className="size-4 text-gray-medium" />
              <span>Due July 15, 2026</span>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center pt-4 border-t border-white/5">
            <span className="text-xs text-gray-medium">Milestone: Level 04 slab pour approval</span>
            <button
              type="button"
              onClick={() => onAction("Payments")}
              className={cn("text-xs font-bold hover:underline", isDark ? "text-white" : "text-black")}
            >
              Pay Invoice
            </button>
          </div>
        </div>

        {/* Available Emails & Messages */}
        <div
          className={cn(
            "rounded-[2rem] border p-6 flex flex-col justify-between min-h-[260px] shadow-sm transition-colors",
            isDark ? "border-white/10 bg-[#121212] text-white" : "border-black/10 bg-white text-black",
          )}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-medium">Communications & Messages</span>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={cn("flex size-9 items-center justify-center rounded-xl", isDark ? "bg-white/10 text-white" : "bg-black/5 text-black")}>
                    <MessageSquare className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Unread Messages</p>
                    <p className="text-xs text-gray-medium">Recent thread with project architect</p>
                  </div>
                </div>
                <span className="rounded-full bg-lemon-yellow px-2 py-0.5 text-xs font-bold text-black animate-pulse">3 New</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={cn("flex size-9 items-center justify-center rounded-xl", isDark ? "bg-white/10 text-white" : "bg-black/5 text-black")}>
                    <Mail className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Project Emails</p>
                    <p className="text-xs text-gray-medium">Submittal and proposal drafts</p>
                  </div>
                </div>
                <span className="rounded-full bg-lemon-yellow px-2 py-0.5 text-xs font-bold text-black animate-pulse">2 New</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
            <button
              type="button"
              onClick={() => onAction("Messages")}
              className={cn("text-xs font-bold hover:underline", isDark ? "text-white" : "text-black")}
            >
              Open Inbox
            </button>
          </div>
        </div>
      </div>

      {/* Bottom section: Progress Graph & Stages Complete */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        {/* Graphical Progress Analytics */}
        <div
          className={cn(
            "rounded-[2rem] border p-6 xl:col-span-2 shadow-sm transition-colors",
            isDark ? "border-white/10 bg-[#121212] text-white" : "border-black/10 bg-white text-black",
          )}
        >
          <div className="mb-6 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-medium">Work Completion Curve</span>
              <h3 className="text-lg font-bold mt-1">Progress Analytics</h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-medium">
              <span className="flex size-2 rounded-full bg-lemon-yellow" />
              <span>Percentage Completed</span>
            </div>
          </div>

          {/* SVG Progress Curve Chart */}
          <div className="relative h-48 w-full mt-4">
            <svg viewBox="0 0 500 150" className="h-full w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f8e71c" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f8e71c" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="37" x2="500" y2="37" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeDasharray="5,5" />
              <line x1="0" y1="75" x2="500" y2="75" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeDasharray="5,5" />
              <line x1="0" y1="112" x2="500" y2="112" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeDasharray="5,5" />
              
              {/* Fill Area */}
              <path d="M 0 150 L 50 120 L 150 100 L 250 80 L 350 48 L 450 48 L 500 48 L 500 150 Z" fill="url(#chartGradient)" />
              
              {/* Line Path */}
              <path
                d="M 0 150 L 50 120 L 150 100 L 250 80 L 350 48 L 450 48 L 500 48"
                fill="none"
                stroke="#f8e71c"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {[
                { x: 50, y: 120, val: "20%" },
                { x: 150, y: 100, val: "35%" },
                { x: 250, y: 80, val: "52%" },
                { x: 350, y: 48, val: "68%" },
              ].map((pt, i) => (
                <g key={i} className="group cursor-pointer">
                  <circle cx={pt.x} cy={pt.y} r="6" fill="#f8e71c" stroke={isDark ? "#121212" : "#ffffff"} strokeWidth="2" />
                  <circle cx={pt.x} cy={pt.y} r="10" fill="#f8e71c" opacity="0" className="hover:opacity-20 transition-opacity" />
                </g>
              ))}
            </svg>

            {/* X-Axis labels */}
            <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 text-[10px] text-gray-medium font-bold pt-2 border-t border-white/5">
              <span>Apr (20%)</span>
              <span>May (35%)</span>
              <span>Jun (52%)</span>
              <span>Today (68%)</span>
            </div>
          </div>
        </div>

        {/* Milestone Completion Stepper */}
        <div
          className={cn(
            "rounded-[2rem] border p-6 shadow-sm transition-colors",
            isDark ? "border-white/10 bg-[#121212] text-white" : "border-black/10 bg-white text-black",
          )}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-gray-medium">Work Completed Checklist</span>
          <h3 className="text-lg font-bold mt-1">Milestones</h3>
          
          <div className="mt-6 space-y-4">
            {[
              { title: "Mobilization & Site Setup", desc: "Site offices and equipment deployed", status: "completed" },
              { title: "Foundation & Substructure", desc: "Piling and concrete pours approved", status: "completed" },
              { title: "Superstructure Frame", desc: "Level 04 slab frame structure in progress", status: "current" },
              { title: "Finishing & MEP", desc: "Drywalls, plumbing, and wiring layouts", status: "upcoming" }
            ].map((milestone, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                      milestone.status === "completed"
                        ? "bg-lemon-yellow text-black"
                        : milestone.status === "current"
                          ? isDark
                            ? "border-2 border-lemon-yellow bg-transparent text-white"
                            : "border-2 border-lemon-yellow bg-transparent text-black"
                          : "border border-gray-medium bg-transparent text-gray-medium"
                    )}
                  >
                    {milestone.status === "completed" ? "✓" : idx + 1}
                  </div>
                  {idx < 3 && <div className={cn("w-0.5 h-10 my-1", milestone.status === "completed" ? "bg-lemon-yellow" : "bg-white/10")} />}
                </div>
                <div>
                  <h4 className={cn("text-sm font-bold", milestone.status === "upcoming" ? "text-gray-medium" : "text-inherit")}>
                    {milestone.title}
                  </h4>
                  <p className="text-xs text-gray-medium mt-0.5 leading-relaxed">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
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
  const [currentClientTitle, setCurrentClientTitle] = useState(clientTitle);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Overview");
  const [lastAction, setLastAction] = useState("Overview");
  const isDark = theme === "dark";

  function handleAction(label: string) {
    setLastAction(label);
    if (navItems.some((item) => item.label === label) || label === "Settings") {
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
        <DashboardSidebar clientTitle={currentClientTitle} theme={theme} activeSection={activeSection} onAction={handleAction} />
        <div className="flex min-h-0 flex-1 flex-col">
          <DashboardHeader
            clientTitle={currentClientTitle}
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
          {activeSection === "Settings" ? (
            <SettingsSection
              clientTitle={currentClientTitle}
              onClientTitleChange={setCurrentClientTitle}
              theme={theme}
            />
          ) : activeSection === "Overview" ? (
            <OverviewSection
              clientTitle={currentClientTitle}
              theme={theme}
              onAction={handleAction}
            />
          ) : activeSection === "Timeline" ? (
            <ConstructionTimeline
              theme={theme}
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

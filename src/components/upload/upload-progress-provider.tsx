"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CheckIcon, LoaderCircleIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type UploadStatus = "uploading" | "succeeded" | "failed";

type UploadEntry = {
  id: string;
  label: string;
  percent: number;
  status: UploadStatus;
  message?: string;
};

export type UploadTracker = {
  id: string;
  update: (percent: number) => void;
  succeed: (message?: string) => void;
  fail: (message?: string) => void;
};

type UploadProgressContextValue = {
  startUpload: (input: { label: string }) => UploadTracker;
};

const UploadProgressContext = createContext<UploadProgressContextValue | null>(null);

const AUTO_DISMISS_MS = 1800;

function genId() {
  return `upl_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

export function UploadProgressProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<UploadEntry[]>([]);
  const dismissTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
    const timer = dismissTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      dismissTimers.current.delete(id);
    }
  }, []);

  const scheduleDismiss = useCallback((id: string) => {
    const existing = dismissTimers.current.get(id);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    dismissTimers.current.set(id, timer);
  }, [dismiss]);

  useEffect(() => {
    return () => {
      for (const timer of dismissTimers.current.values()) clearTimeout(timer);
      dismissTimers.current.clear();
    };
  }, []);

  const startUpload = useCallback<UploadProgressContextValue["startUpload"]>(
    ({ label }) => {
      const id = genId();
      setEntries((current) => [
        ...current,
        { id, label, percent: 0, status: "uploading" },
      ]);

      return {
        id,
        update(percent) {
          setEntries((current) =>
            current.map((entry) =>
              entry.id === id
                ? { ...entry, percent: Math.max(entry.percent, percent) }
                : entry,
            ),
          );
        },
        succeed(message) {
          setEntries((current) =>
            current.map((entry) =>
              entry.id === id
                ? { ...entry, percent: 100, status: "succeeded", message }
                : entry,
            ),
          );
          scheduleDismiss(id);
        },
        fail(message) {
          setEntries((current) =>
            current.map((entry) =>
              entry.id === id ? { ...entry, status: "failed", message } : entry,
            ),
          );
        },
      };
    },
    [scheduleDismiss],
  );

  const value = useMemo(() => ({ startUpload }), [startUpload]);

  return (
    <UploadProgressContext.Provider value={value}>
      {children}
      <UploadProgressViewport entries={entries} onDismiss={dismiss} />
    </UploadProgressContext.Provider>
  );
}

export function useUploadProgress(): UploadProgressContextValue {
  const ctx = useContext(UploadProgressContext);
  if (!ctx) {
    return {
      startUpload: () => ({
        id: genId(),
        update: () => undefined,
        succeed: () => undefined,
        fail: () => undefined,
      }),
    };
  }
  return ctx;
}

function UploadProgressViewport({
  entries,
  onDismiss,
}: {
  entries: UploadEntry[];
  onDismiss: (id: string) => void;
}) {
  if (entries.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[320px] flex-col gap-2">
      {entries.map((entry) => (
        <UploadProgressCard key={entry.id} entry={entry} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function UploadProgressCard({
  entry,
  onDismiss,
}: {
  entry: UploadEntry;
  onDismiss: (id: string) => void;
}) {
  const Icon =
    entry.status === "succeeded"
      ? CheckIcon
      : entry.status === "failed"
        ? XIcon
        : LoaderCircleIcon;

  const iconColor =
    entry.status === "succeeded"
      ? "text-emerald-600"
      : entry.status === "failed"
        ? "text-red-600"
        : "text-zinc-500";

  const barColor =
    entry.status === "failed"
      ? "bg-red-500"
      : entry.status === "succeeded"
        ? "bg-emerald-500"
        : "bg-zinc-900";

  return (
    <div className="pointer-events-auto overflow-hidden rounded-xl border border-zinc-200 bg-white p-3 shadow-lg">
      <div className="flex items-start gap-3">
        <Icon
          className={cn(
            "mt-0.5 size-4 shrink-0",
            iconColor,
            entry.status === "uploading" ? "animate-spin" : undefined,
          )}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="truncate text-sm font-medium text-zinc-900">{entry.label}</div>
            <button
              aria-label="Dismiss"
              className="text-zinc-400 transition hover:text-zinc-700"
              onClick={() => onDismiss(entry.id)}
              type="button"
            >
              <XIcon className="size-3.5" />
            </button>
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            {entry.status === "succeeded"
              ? entry.message ?? "Upload complete"
              : entry.status === "failed"
                ? entry.message ?? "Upload failed"
                : `${entry.percent}%`}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className={cn("h-full transition-all duration-200", barColor)}
              style={{ width: `${entry.status === "failed" ? 100 : entry.percent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

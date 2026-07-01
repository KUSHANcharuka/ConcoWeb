"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

export type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

type AdminSidebarProps = {
  title: string;
  items: SidebarItem[];
};

export function AdminSidebar({ title, items }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="flex h-[calc(100vh-64px)] shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-sidebar)] py-6"
      style={{ width: "260px" }}
    >
      {/* Section title */}
      <p className="mb-3 px-5 font-mono text-[10px] font-medium uppercase tracking-widest text-[var(--color-ink-subtle)]">
        {title}
      </p>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 px-3">
        {items.map(({ label, href, icon: Icon, badge }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-[var(--text-sm)] font-medium transition-colors",
                active
                  ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-card)] hover:text-[var(--color-ink)]",
              ].join(" ")}
            >
              <Icon size={15} strokeWidth={1.75} className="shrink-0" />
              <span className="flex-1">{label}</span>
              {badge !== undefined && (
                <span className="rounded-[var(--radius-pill)] bg-[var(--color-primary)] px-1.5 py-0.5 font-mono text-[10px] font-medium text-white">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

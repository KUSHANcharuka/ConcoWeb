"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Inbox,
  CreditCard,
  Mail,
  Users,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Requests", href: "/admin/requests", icon: Inbox },
  { label: "Billing", href: "/admin/billing", icon: CreditCard },
  { label: "Emails", href: "/admin/emails", icon: Mail },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
] as const;

export function TopNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <nav className="flex items-center gap-0.5">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={[
              "flex items-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-1.5 text-[var(--text-sm)] font-medium transition-colors",
              active
                ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                : "text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-sidebar)] hover:text-[var(--color-ink)]",
            ].join(" ")}
          >
            <Icon size={14} strokeWidth={1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

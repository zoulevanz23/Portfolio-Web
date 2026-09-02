"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { identity } from "@/content/site-content";

const utilityLinks = [
  { href: "/credentials", label: "Credentials" },
  { href: "/contact", label: "Contact" },
];

const navGroups = [
  {
    label: "Work",
    items: [
      { href: "/systems", label: "Systems" },
      { href: "/engineering-log", label: "Engineering Log" },
      { href: "/decision-log", label: "Decision Log" },
    ],
  },
  {
    label: "Labs",
    items: [
      { href: "/api-playground", label: "API Playground" },
      { href: "/schema-architect", label: "Schema Architect" },
      { href: "/neural-map", label: "Neural Map" },
      { href: "/interview", label: "AI Interview Simulator" },
      { href: "/roast-resume", label: "Roast ur Resume" },
    ],
  },
  {
    label: "Profile",
    items: [
      { href: "/experience", label: "Experience" },
      { href: "/stack", label: "Stack" },
      { href: "/cv", label: "CV" },
      { href: "/now", label: "Now" },
    ],
  },
  {
    label: "Community",
    items: [
      { href: "/thoughts", label: "Thoughts" },
      { href: "/blog", label: "Blog" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isActive(pathname, href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
    >
      {active ? (
        <span className="flex items-center gap-1">
          <span className="text-accent">&lt;</span>
          <span>{label}</span>
          <span className="text-accent">&gt;</span>
        </span>
      ) : (
        label
      )}
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-5">
        <Link
          href="/"
          onClick={onNavigate}
          className="block font-mono text-sm font-medium text-foreground transition-colors hover:text-muted"
        >
          {identity.name}
        </Link>
        <p className="mt-1 font-mono text-[10px] text-subtle">{identity.role}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4" aria-label="Primary">
        <div>
          <p className="sidebar-section-label">Connect</p>
          <ul className="sidebar-section-links">
            {utilityLinks.map((item) => (
              <li key={item.href}>
                <SidebarLink {...item} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>

        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="sidebar-section-label">{group.label}</p>
            <ul className="sidebar-section-links">
              {group.items.map((item) => (
                <li key={item.href}>
                  <SidebarLink {...item} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-border p-4">
        <p className="sidebar-section-label mb-2 px-0">Theme</p>
        <ThemeToggle fullWidth />
      </div>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Mobile top bar */}
      <header className="mobile-header sticky top-0 z-40 flex w-full items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <Link href="/" className="font-mono text-sm font-medium text-foreground">
          {identity.name}
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="border border-border px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-border-muted hover:text-foreground"
        >
          Menu
        </button>
      </header>

      {/* Desktop sidebar */}
      <aside className="sidebar-desktop hidden lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile drawer overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          className="sidebar-backdrop fixed inset-0 z-50 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`sidebar-drawer fixed inset-y-0 left-0 z-50 w-60 border-r border-border bg-surface transition-transform duration-200 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-end border-b border-border px-3 py-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="px-2 py-1 font-mono text-xs text-muted transition-colors hover:text-foreground"
          >
            Close
          </button>
        </div>
        <SidebarContent onNavigate={() => setOpen(false)} />
      </aside>
    </>
  );
}

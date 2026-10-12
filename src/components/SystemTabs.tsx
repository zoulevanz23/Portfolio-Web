import Link from "next/link";

interface SystemTabsProps {
  systemId: string;
  active: "view" | "inspect" | "build";
  hasBuild: boolean;
}

export function SystemTabs({ systemId, active, hasBuild }: SystemTabsProps) {
  const tabs = [
    { key: "view" as const, label: "View Project", href: `/systems/${systemId}` },
    { key: "inspect" as const, label: "Inspect System", href: `/systems/${systemId}/inspect` },
    ...(hasBuild
      ? [{ key: "build" as const, label: "Inside the Build", href: `/systems/${systemId}/build` }]
      : []),
  ];

  return (
    <nav aria-label="System views" className="mb-8 flex flex-wrap gap-1 border-b border-border">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={active === tab.key ? "page" : undefined}
          className={`px-4 py-2 font-mono text-xs transition-colors ${
            active === tab.key
              ? "border-b-2 border-foreground text-foreground"
              : "text-subtle hover:text-foreground"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

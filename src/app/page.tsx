import Link from "next/link";
import {
  identity,
  proofStrip,
  systems,
  featuredSystemIds,
} from "@/content/site-content";
import { SystemCard } from "@/components/SystemCard";
import { PlaceholderBadge, isPlaceholder } from "@/components/PlaceholderBadge";

export default function HomePage() {
  const featured = systems.filter((s) => featuredSystemIds.includes(s.id));

  return (
    <>
      <section className="section-container border-b border-border">
        <div className="max-w-3xl">
          {isPlaceholder(identity.name) && (
            <div className="mb-4">
              <PlaceholderBadge />
            </div>
          )}
          <p className="mono-label mb-4">Identity</p>
          <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
            {identity.name}
          </h1>
          <p className="mt-2 font-mono text-sm text-muted">{identity.role}</p>
          <p className="mt-6 leading-relaxed text-foreground">{identity.thesis}</p>
          <div className="mt-8 flex gap-4">
            <Link href="/systems" className="btn-primary">
              View Work
            </Link>
            <Link href="/cv" className="btn-secondary">
              View CV
            </Link>
          </div>
        </div>
      </section>

      <section className="section-container border-b border-border">
        <p className="mono-label mb-6">Proof</p>
        <div className="grid-divider grid-cols-2 md:grid-cols-4">
          {proofStrip.map((item) => (
            <div key={item.label} className="p-6">
              <p className="font-mono text-lg text-foreground">{item.value}</p>
              <p className="mt-1 font-mono text-xs text-subtle">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container border-b border-border">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mono-label mb-2">Selected Systems</p>
            <h2 className="prose-heading">Featured work</h2>
          </div>
          <Link href="/systems" className="font-mono text-xs link-underline">
            View all →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((system) => (
            <SystemCard key={system.id} system={system} showDiagram />
          ))}
        </div>
      </section>

      <section className="section-container">
        <p className="mono-label mb-6">Entry Points</p>
        <div className="grid-divider md:grid-cols-3">
          {[
            { href: "/systems/sys-001/inspect", label: "System Inspector", desc: "Architecture breakdown with clickable nodes" },
            { href: "/engineering-log", label: "Engineering Log", desc: "Real debugging narratives with root cause analysis" },
            { href: "/api-playground", label: "API Playground", desc: "Live API endpoints backing this site" },
            { href: "/schema-architect", label: "Schema Architect", desc: "AI-designed normalized database schema and index optimizer" },
            { href: "/decision-log", label: "Decision Log", desc: "Architecture decision records" },
            { href: "/now", label: "Now", desc: "Currently building, learning, exploring" },
          ].map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="p-6 transition-colors hover:bg-surface-muted"
            >
              <p className="font-mono text-sm text-foreground">{entry.label}</p>
              <p className="mt-2 text-xs text-muted">{entry.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { StackOrganism } from "@/components/StackOrganism";
import { stack as rawStack, systems as rawSystems } from "@/content/site-content";

interface StackPersonalityItem {
  name: string;
  category: string;
  tier: number;
  usageCount: number;
  projects: string[];
  personality: string;
}

const FALLBACK_PERSONALITIES: Record<string, string> = {
  "Next.js": "The full-stack framework that ties everything together.",
  React: "The UI library that makes components feel like second nature.",
  TypeScript: "Static types that catch bugs before they reach production.",
  "Tailwind CSS": "Utility-first styling that keeps the design system tight.",
  "TanStack Query": "Server state management that makes data fetching feel automatic.",
  Leaflet: "Interactive maps without the bloated SDK.",
  "C#": "Strongly typed, enterprise-ready, and surprisingly elegant.",
  ".NET 8": "The runtime that makes C# production-ready for anything.",
  "ASP.NET Core": "High-performance web APIs built on .NET.",
  "Minimal APIs": "Thin endpoint routing when controllers feel heavy.",
  "EF Core": "ORM that translates LINQ to SQL without the ceremony.",
  JWT: "Stateless tokens that keep APIs authenticated.",
  Firebase: "Backend-as-a-service when you don't want to build auth from scratch.",
  "SQL Server": "Relational database that handles complex queries and transactions.",
  Redis: "In-memory speed for caching, sessions, and rate limiting.",
  IIS: "Windows hosting that still runs the enterprise.",
  Vercel: "Deploy with zero config — push and it's live.",
  Docker: "Containerization that makes deployments reproducible.",
  Kubernetes: "Orchestration for when containers need managing at scale.",
  AWS: "Cloud infrastructure with more services than you'll ever use.",
  Azure: "Microsoft's cloud — natural fit when your stack is .NET.",
  Vitest: "Testing that's fast because it shares your build config.",
  RTL: "Testing components the way users interact with them.",
  xUnit: ".NET testing that runs clean and runs fast.",
  Moq: "Mocking framework that makes isolation testing bearable.",
  Python: "The language that makes everything from scripts to ML accessible.",
  FastAPI: "Python APIs with automatic docs and real performance.",
  PyTorch: "Deep learning that doesn't fight your Python instincts.",
  RAG: "Retrieval-augmented generation — giving LLMs a knowledge base.",
  "Vector DB": "Semantic search storage for AI embeddings.",
  "GitHub Actions": "CI/CD that runs in the same repo as your code.",
};

function buildFallbackItems(): StackPersonalityItem[] {
  return rawStack.map((item) => {
    const projects = item.projectIds.map((pid) => rawSystems.find((s) => s.id === pid)?.name).filter(Boolean) as string[];
    return {
      name: item.name,
      category: item.category,
      tier: item.tier,
      usageCount: item.projectIds.length,
      projects,
      personality: FALLBACK_PERSONALITIES[item.name] || `${item.name} — used in ${item.projectIds.length} project(s).`,
    };
  });
}

const AI_TOOLS = [
  { name: "Claude Code", description: "AI that writes code while you describe problems" },
  { name: "ChatGPT", description: "Conversational AI for rapid prototyping and debugging" },
  { name: "Codex", description: "Code generation that turns intent into implementation" },
];

const DEV_TOOLS = [
  { name: "Figma", description: "Prototyping tool where designs become real before code" },
  { name: "Mermaid", description: "Diagrams from text — because drawing boxes is overrated" },
];

export default function NeuralMapPage() {
  const fallbackItems = useMemo(() => buildFallbackItems(), []);
  const [items, setItems] = useState<StackPersonalityItem[]>(() => fallbackItems);
  const [isEnriching, setIsEnriching] = useState(false);

  // enrich in background — instant fallback render, then swap to AI copy when ready (no blank loading)
  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    const t = setTimeout(() => setIsEnriching(true), 300);
    fetch("/api/ai/stack-personality", { signal: ctrl.signal, cache: "force-cache" } as RequestInit)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!cancelled && json?.data?.length) setItems(json.data);
      })
      .catch(() => {})
      .finally(() => {
        clearTimeout(t);
        if (!cancelled) setIsEnriching(false);
      });
    return () => {
      cancelled = true;
      ctrl.abort();
      clearTimeout(t);
    };
  }, []);

  return (
    <div className="section-container">
      <SectionHeader
        label="Technical Map"
        title="A visual map of my technical experience"
        description="Node size = depth of experience. Color = domain. Connections = relationships between technologies."
      />

      <div className="mb-6 border border-border bg-surface px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-subtle mb-2">Last Updated: September 2026</p>
        <p className="text-foreground">
          <span className="font-semibold text-foreground">
            This map represents my actual engineering stack — not a shopping list of technologies I&apos;ve encountered.
          </span>
        </p>
        <p className="mt-3 text-muted">
          Core tools sit at the top. Supporting technologies radiate outward. Connections show real relationships — how these tools work together in production.
        </p>
      </div>

      <div className="mb-8 relative">
        <StackOrganism items={items} />
        {isEnriching && (
          <div className="pointer-events-none absolute bottom-2 right-2 rounded-full border bg-surface px-2.5 py-1 font-mono text-[10px] text-subtle opacity-80 shadow">
            enriching with AI…
          </div>
        )}
      </div>

      {/* AI-Assisted Development */}
      <div className="mb-8 border border-border bg-surface p-5">
        <p className="mono-label mb-3">AI-Assisted Development</p>
        <p className="mb-4 text-xs text-muted">
          Tools that enhance productivity — not engineering skills. These don&apos;t belong in the main technical map.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {AI_TOOLS.map((tool) => (
            <div key={tool.name} className="border border-border bg-bg-muted p-3">
              <p className="font-mono text-sm text-foreground">{tool.name}</p>
              <p className="mt-1 text-xs text-muted">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dev Tools */}
      <div className="mb-8 border border-border bg-surface p-5">
        <p className="mono-label mb-3">Tools</p>
        <p className="mb-4 text-xs text-muted">
          Design and documentation tools that support the development workflow.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {DEV_TOOLS.map((tool) => (
            <div key={tool.name} className="border border-border bg-bg-muted p-3">
              <p className="font-mono text-sm text-foreground">{tool.name}</p>
              <p className="mt-1 text-xs text-muted">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology cards */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.name} className="surface-card-hover">
            <div className="flex items-start justify-between">
              <p className="font-mono text-sm text-foreground">{item.name}</p>
              <span className="mono-label">{item.category}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{item.personality}</p>
            {item.projects.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {item.projects.map((p) => (
                  <span key={p} className="tag">
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

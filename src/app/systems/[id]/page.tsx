import Link from "next/link";
import { notFound } from "next/navigation";
import { systems } from "@/content/site-content";
import { PlaceholderBadge, isPlaceholder } from "@/components/PlaceholderBadge";

export function generateStaticParams() {
  return systems.map((s) => ({ id: s.id }));
}

export default async function SystemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const system = systems.find((s) => s.id === id);
  if (!system) notFound();

  return (
    <div className="section-container">
      <div className="mb-8">
        <Link href="/systems" className="back-link">
          ← Systems
        </Link>
      </div>

      <div className="max-w-3xl">
        <div className="mb-4 flex items-center gap-3">
          {isPlaceholder(system.name) && <PlaceholderBadge />}
          <span className="tag">{system.status}</span>
        </div>
        <h1 className="prose-heading">{system.name}</h1>
        <p className="mt-2 font-mono text-sm text-muted">{system.function}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {system.stack.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        {/* Interview Narrative */}
        <div className="mt-8 border-t border-border pt-8">
          <p className="mono-label mb-4">Interview Narrative</p>
          <p className="leading-relaxed text-foreground">{system.narrative}</p>
        </div>

        {/* Selling Points */}
        <div className="mt-8 border-t border-border pt-8">
          <p className="mono-label mb-4">Key Selling Points</p>
          <ul className="space-y-2">
            {system.sellingPoints.map((point, i) => (
              <li key={i} className="text-sm leading-relaxed text-muted">
                — {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Summary */}
        <div className="mt-8 border-t border-border pt-8">
          <p className="mono-label mb-4">Summary</p>
          <p className="leading-relaxed text-foreground">{system.summary}</p>
        </div>

        <div className="mt-8 flex gap-4">
          <Link href={`/systems/${system.id}/inspect`} className="btn-primary">
            Inspect System
          </Link>
          <Link href="/systems" className="btn-secondary">
            Back to index
          </Link>
        </div>
      </div>
    </div>
  );
}

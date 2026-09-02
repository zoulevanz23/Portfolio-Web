import Link from "next/link";
import { decisionLog, systems } from "@/content/site-content";
import { SectionHeader } from "@/components/SectionHeader";
import { PlaceholderBadge, isPlaceholder } from "@/components/PlaceholderBadge";

export default function DecisionLogPage() {
  return (
    <div className="section-container">
      <SectionHeader
        label="Decision Log"
        title="Architecture decisions"
        description="Short ADR-style records. Skimmable in under 20 seconds each."
      />

      <div className="space-y-4">
        {decisionLog.map((entry) => {
          const relatedSystem = systems.find((s) => s.id === entry.relatedSystemId);
          return (
            <article
              key={entry.id}
              className={`surface-card-hover ${isPlaceholder(entry.title) ? "placeholder-border" : ""}`}
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <h2 className="font-medium text-foreground">{entry.title}</h2>
                {isPlaceholder(entry.title) && <PlaceholderBadge />}
              </div>

              {relatedSystem && (
                <Link
                  href={`/systems/${relatedSystem.id}/inspect`}
                  className="mb-3 inline-block font-mono text-xs link-underline"
                >
                  {relatedSystem.name}
                </Link>
              )}

              <dl className="grid gap-3 font-mono text-xs md:grid-cols-2">
                <div>
                  <dt className="text-subtle">Decision</dt>
                  <dd className="mt-1 text-foreground">{entry.decision}</dd>
                </div>
                <div>
                  <dt className="text-subtle">Why</dt>
                  <dd className="mt-1 text-muted">{entry.why}</dd>
                </div>
                <div>
                  <dt className="text-subtle">Alternative Considered</dt>
                  <dd className="mt-1 text-muted">{entry.alternative}</dd>
                </div>
                <div>
                  <dt className="text-subtle">Tradeoff</dt>
                  <dd className="mt-1 text-muted">{entry.tradeoff}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </div>
  );
}

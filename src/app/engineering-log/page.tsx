import Link from "next/link";
import { engineeringLog, systems } from "@/content/site-content";
import { SectionHeader } from "@/components/SectionHeader";
import { PlaceholderBadge, isPlaceholder } from "@/components/PlaceholderBadge";

export default function EngineeringLogPage() {
  return (
    <div className="section-container">
      <SectionHeader
        label="Engineering Log"
        title="Debugging narratives"
        description="Real incidents with problem, investigation, root cause, solution, result, and lesson."
      />

      <div className="space-y-8">
        {engineeringLog.map((entry) => {
          const relatedSystem = systems.find((s) => s.id === entry.relatedSystemId);
          return (
            <article
              key={entry.id}
              className={`surface-card-hover ${isPlaceholder(entry.title) ? "placeholder-border" : ""}`}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-medium text-foreground">{entry.title}</h2>
                  <p className="mt-1 font-mono text-xs text-subtle">{entry.date}</p>
                </div>
                {isPlaceholder(entry.title) && <PlaceholderBadge />}
              </div>

              {relatedSystem && (
                <Link
                  href={`/systems/${relatedSystem.id}/inspect`}
                  className="mb-4 inline-block font-mono text-xs link-underline"
                >
                  Related: {relatedSystem.name}
                </Link>
              )}

              <dl className="space-y-4">
                {[
                  { label: "Problem", content: entry.problem },
                  { label: "Investigation", content: entry.investigation },
                  { label: "Root Cause", content: entry.rootCause },
                  { label: "Solution", content: entry.solution },
                  { label: "Result", content: entry.result },
                  { label: "Lesson", content: entry.lesson },
                ].map((section) => (
                  <div key={section.label}>
                    <dt className="mono-label mb-1">{section.label}</dt>
                    <dd className="text-sm text-muted leading-relaxed">{section.content}</dd>
                  </div>
                ))}
              </dl>
            </article>
          );
        })}
      </div>
    </div>
  );
}

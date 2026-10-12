import Link from "next/link";
import { notFound } from "next/navigation";
import { systems, decisionLog, engineeringLog } from "@/content/site-content";
import { InsideBuildFlow } from "@/components/InsideBuildFlow";
import { SystemTabs } from "@/components/SystemTabs";
import { PlaceholderBadge, isPlaceholder } from "@/components/PlaceholderBadge";

export function generateStaticParams() {
  return systems.filter((s) => s.insideBuild).map((s) => ({ id: s.id }));
}

export default async function SystemBuildPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const system = systems.find((s) => s.id === id);
  if (!system || !system.insideBuild) notFound();

  const build = system.insideBuild;
  const relatedDecisions = decisionLog.filter((d) => d.relatedSystemId === id);
  const relatedIncidents = engineeringLog.filter((e) => e.relatedSystemId === id);

  return (
    <div className="section-container">
      <div className="mb-8">
        <Link href="/systems" className="back-link">
          ← Systems
        </Link>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <p className="mono-label">Inside the Build</p>
        {isPlaceholder(system.name) && <PlaceholderBadge />}
      </div>
      <h1 className="prose-heading mb-2">{system.name}</h1>
      <p className="mb-8 font-mono text-sm text-muted">{system.function}</p>

      <SystemTabs systemId={system.id} active="build" hasBuild />

      <div className="max-w-3xl">
        {/* The Problem */}
        <section>
          <p className="mono-label mb-4">The problem</p>
          <p className="leading-relaxed text-foreground">{build.problem}</p>
          {build.context && (
            <p className="mt-3 border-l-2 border-border pl-4 text-sm leading-relaxed text-muted">
              {build.context}
            </p>
          )}
        </section>

        {/* My Approach */}
        <section className="mt-10 border-t border-border pt-8">
          <p className="mono-label mb-2">My approach</p>
          <p className="mb-6 text-sm text-muted">
            How a unit of work moves through the system, end to end.
          </p>
          <InsideBuildFlow flow={build.flow} />
        </section>

        {/* Engineering Decisions */}
        <section className="mt-10 border-t border-border pt-8">
          <p className="mono-label mb-6">Engineering decisions</p>
          <div className="grid gap-4">
            {build.decisions.map((decision) => (
              <div key={decision.choice} className="surface-card">
                <h2 className="font-medium text-foreground">Why {decision.choice}?</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{decision.why}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related evidence */}
        <section className="mt-10 border-t border-border pt-8">
          <p className="mono-label mb-2">Related evidence</p>
          <p className="mb-6 text-sm text-muted">
            Full records live in the logs — this view stays curated.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 font-mono text-xs text-foreground">Related ADRs</h3>
              {relatedDecisions.length > 0 ? (
                <ul className="space-y-3">
                  {relatedDecisions.map((entry) => (
                    <li key={entry.id} className="surface-card">
                      <p className="text-sm font-medium text-foreground">{entry.title}</p>
                      <p className="mt-1 font-mono text-xs text-muted line-clamp-2">
                        {entry.decision}
                      </p>
                      <Link
                        href="/decision-log"
                        className="mt-2 inline-block font-mono text-xs link-underline"
                      >
                        View ADR →
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-mono text-xs text-subtle">
                  No linked ADRs yet — see the{" "}
                  <Link href="/decision-log" className="link-underline">
                    Decision Log
                  </Link>
                  .
                </p>
              )}
            </div>

            <div>
              <h3 className="mb-3 font-mono text-xs text-foreground">Related incidents</h3>
              {relatedIncidents.length > 0 ? (
                <ul className="space-y-3">
                  {relatedIncidents.map((entry) => (
                    <li key={entry.id} className="surface-card">
                      <p className="text-sm font-medium text-foreground">{entry.title}</p>
                      <p className="mt-1 font-mono text-xs text-subtle">{entry.date}</p>
                      <Link
                        href="/engineering-log"
                        className="mt-2 inline-block font-mono text-xs link-underline"
                      >
                        View incident →
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-mono text-xs text-subtle">
                  No linked incidents yet — see the{" "}
                  <Link href="/engineering-log" className="link-underline">
                    Engineering Log
                  </Link>
                  .
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

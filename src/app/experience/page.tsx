import Link from "next/link";
import { experience, systems } from "@/content/site-content";
import { SectionHeader } from "@/components/SectionHeader";
import { ExperienceStats } from "@/components/ExperienceStats";
import { PlaceholderBadge, isPlaceholder } from "@/components/PlaceholderBadge";

export default function ExperiencePage() {
  return (
    <div className="section-container">
      <SectionHeader
        label="Experience"
        title="Role history"
        description="Outcome-oriented. Each role links to the systems built during that period."
      />

      {/* KPIs — year values computed at runtime from identity start dates */}
      <ExperienceStats rolesHeld={experience.length} systemsBuilt={systems.length} />

      <div className="space-y-8">
        {experience.map((entry) => (
          <article
            key={entry.id}
            className={`surface-card-hover ${isPlaceholder(entry.company) ? "placeholder-border" : ""}`}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-medium text-foreground">{entry.role}</h2>
                <p className="font-mono text-sm text-muted">{entry.company}</p>
                <p className="font-mono text-xs text-subtle">{entry.period}</p>
              </div>
              {isPlaceholder(entry.company) && <PlaceholderBadge />}
            </div>

            <ul className="mb-4 space-y-2">
              {entry.outcomes.map((outcome, i) => (
                <li key={i} className="text-sm leading-relaxed text-muted">
                  — {outcome}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2">
              {entry.systemIds.map((sysId) => {
                const sys = systems.find((s) => s.id === sysId);
                if (!sys) return null;
                return (
                  <Link
                    key={sysId}
                    href={`/systems/${sysId}/inspect`}
                    className="tag-link"
                  >
                    {sys.name}
                  </Link>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { experience, systems, identity } from "@/content/site-content";
import { SectionHeader } from "@/components/SectionHeader";
import { PlaceholderBadge, isPlaceholder } from "@/components/PlaceholderBadge";

export default function ExperiencePage() {
  return (
    <div className="section-container">
      <SectionHeader
        label="Experience"
        title="Role history"
        description="Outcome-oriented. Each role links to the systems built during that period."
      />

      {/* KPIs */}
      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="border border-border bg-surface p-4 text-center">
          <p className="font-mono text-2xl font-bold text-foreground">{identity.yearsExperience}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-subtle">Years Experience</p>
        </div>
        <div className="border border-border bg-surface p-4 text-center">
          <p className="font-mono text-2xl font-bold text-foreground">{identity.yearsDevelopment}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-subtle">Years Development</p>
        </div>
        <div className="border border-border bg-surface p-4 text-center">
          <p className="font-mono text-2xl font-bold text-foreground">{experience.length}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-subtle">Roles Held</p>
        </div>
        <div className="border border-border bg-surface p-4 text-center">
          <p className="font-mono text-2xl font-bold text-foreground">{systems.length}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-subtle">Systems Built</p>
        </div>
      </div>

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

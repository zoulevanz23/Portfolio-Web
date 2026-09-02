import Link from "next/link";
import { stack, systems } from "@/content/site-content";
import { SectionHeader } from "@/components/SectionHeader";

const categories = ["core", "supporting", "data", "infra", "testing", "integrations", "ai-exploration"] as const;

export default function StackPage() {
  return (
    <div className="section-container">
      <SectionHeader
        label="Stack"
        title="Technologies by category"
        description="Each technology links to the projects that used it. No skill bars. No percentages."
      />

      <div className="space-y-8">
        {categories.map((category) => {
          const items = stack.filter((s) => s.category === category);
          if (items.length === 0) return null;

          return (
            <section key={category}>
              <p className="mono-label mb-4">{category}</p>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <div key={item.name} className="surface-card-hover">
                    <p className="font-mono text-sm text-foreground">{item.name}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.projectIds.map((pid) => {
                        const sys = systems.find((s) => s.id === pid);
                        if (!sys) return null;
                        return (
                          <Link
                            key={pid}
                            href={`/systems/${pid}`}
                            className="font-mono text-[10px] text-muted link-underline"
                          >
                            {sys.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

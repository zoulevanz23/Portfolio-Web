import { lifeOutside } from "@/content/site-content";
import { SectionHeader } from "@/components/SectionHeader";
import { PlaceholderBadge, isPlaceholder } from "@/components/PlaceholderBadge";

const categories = [
  { key: "hobby" as const, label: "Hobbies", description: "Things I do when I'm not debugging." },
  { key: "music" as const, label: "Music", description: "What's on rotation." },
  { key: "manhwa" as const, label: "Manhwa", description: "What I'm reading." },
  { key: "blog" as const, label: "Personal Blog", description: "Posts and thoughts outside of work." },
];

export default function LifeOutsidePage() {
  return (
    <div className="section-container">
      <SectionHeader
        label="Life outside </>"
        title="Life outside </>"
        description="Hobbies, music, manhwa, and blog — the non-engineering side."
      />

      <div className="space-y-12">
        {categories.map((cat) => {
          const items = lifeOutside.filter((e) => e.category === cat.key);
          if (items.length === 0) return null;

          return (
            <section key={cat.key}>
              <div className="mb-6">
                <h2 className="text-lg font-medium text-foreground">{cat.label}</h2>
                <p className="mt-1 text-sm text-muted">{cat.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`surface-card-hover ${isPlaceholder(item.title) ? "placeholder-border" : ""}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      {item.url && !isPlaceholder(item.url) ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sm font-medium text-foreground underline-offset-2 hover:underline"
                        >
                          {item.title}
                        </a>
                      ) : (
                        <p className="font-mono text-sm font-medium text-foreground">
                          {item.title}
                        </p>
                      )}
                      {isPlaceholder(item.title) && <PlaceholderBadge />}
                    </div>
                    <p className="text-sm leading-relaxed text-muted">{item.detail}</p>
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

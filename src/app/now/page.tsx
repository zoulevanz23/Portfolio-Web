import { now } from "@/content/site-content";
import { SectionHeader } from "@/components/SectionHeader";
import { PlaceholderBadge, isPlaceholder } from "@/components/PlaceholderBadge";

export default function NowPage() {
  const items = [
    { label: "Building", content: now.building },
    { label: "Learning", content: now.learning },
    { label: "Exploring", content: now.exploring },
  ];

  return (
    <div className="section-container">
      <SectionHeader
        label="Now"
        title="Current focus"
        description="What I'm working on, learning, and exploring. Updated periodically."
      />

      <div className="max-w-2xl space-y-6">
        {items.map((item) => (
          <div
            key={item.label}
            className={`surface-card-hover ${isPlaceholder(item.content) ? "placeholder-border" : ""}`}
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="mono-label">{item.label}</p>
              {isPlaceholder(item.content) && <PlaceholderBadge />}
            </div>
            <p className="leading-relaxed text-foreground">{item.content}</p>
          </div>
        ))}

        <p className="font-mono text-xs text-subtle">
          Last updated: September 2026
        </p>
      </div>
    </div>
  );
}

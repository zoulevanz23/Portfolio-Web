import { systems } from "@/content/site-content";
import { SectionHeader } from "@/components/SectionHeader";
import { SystemCard } from "@/components/SystemCard";

export default function SystemsPage() {
  return (
    <div className="section-container">
      <SectionHeader
        label="Systems"
        title="Project index"
        description="Each system has two views: a recruiter-readable summary and a technical architecture breakdown."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {systems.map((system) => (
          <SystemCard key={system.id} system={system} showDiagram />
        ))}
      </div>
    </div>
  );
}

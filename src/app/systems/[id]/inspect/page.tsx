import Link from "next/link";
import { notFound } from "next/navigation";
import { systems } from "@/content/site-content";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { PlaceholderBadge, isPlaceholder } from "@/components/PlaceholderBadge";

export function generateStaticParams() {
  return systems.map((s) => ({ id: s.id }));
}

export default async function SystemInspectPage({
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
        <Link href={`/systems/${system.id}`} className="back-link">
          ← {system.name}
        </Link>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <p className="mono-label">System Inspector</p>
        {isPlaceholder(system.name) && <PlaceholderBadge />}
      </div>
      <h1 className="prose-heading mb-2">{system.name}</h1>
      <p className="mb-8 font-mono text-sm text-muted">{system.function}</p>

      <ArchitectureDiagram
        nodes={system.architecture.nodes}
        connections={system.architecture.connections}
        systemName={system.name}
      />

      <div className="mt-12 border-t border-border pt-8">
        <p className="mono-label mb-4">Node inventory</p>
        <div className="grid gap-4 md:grid-cols-2">
          {system.architecture.nodes.map((node) => (
            <div key={node.id} className="surface-card-hover">
              <p className="font-mono text-sm text-foreground">{node.label}</p>
              <p className="font-mono text-xs text-subtle">{node.type}</p>
              <dl className="mt-3 grid gap-1 font-mono text-xs">
                {Object.entries(node.details).map(([key, value]) =>
                  value ? (
                    <div key={key}>
                      <span className="text-subtle">{key}: </span>
                      <span className="text-muted">{value}</span>
                    </div>
                  ) : null
                )}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

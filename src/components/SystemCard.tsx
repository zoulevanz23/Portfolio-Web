import Link from "next/link";
import type { System } from "@/content/site-content";
import { PlaceholderBadge, isPlaceholder } from "./PlaceholderBadge";

interface SystemCardProps {
  system: System;
  showDiagram?: boolean;
}

export function SystemCard({ system, showDiagram = false }: SystemCardProps) {
  return (
    <article className={`surface-card-hover ${isPlaceholder(system.name) ? "placeholder-border" : ""}`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium text-foreground">{system.name}</h3>
          <p className="mt-1 text-sm text-muted">{system.function}</p>
        </div>
        {isPlaceholder(system.name) && <PlaceholderBadge />}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {system.stack.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
        <span className="tag">{system.status}</span>
      </div>

      {showDiagram && (
        <div className="mb-4 flex h-16 items-center justify-center border border-border bg-[var(--diagram-bg)] transition-colors duration-200">
          <svg viewBox="0 0 120 40" className="h-10 w-32" aria-hidden="true">
            {system.architecture.nodes.slice(0, 3).map((node, i) => (
              <g key={node.id}>
                <rect
                  x={i * 40 + 4}
                  y="8"
                  width="32"
                  height="24"
                  fill="var(--diagram-node)"
                  stroke="var(--diagram-border)"
                  strokeWidth="1"
                  rx="1"
                />
                {i < 2 && (
                  <line
                    x1={i * 40 + 36}
                    y1="20"
                    x2={i * 40 + 44}
                    y2="20"
                    stroke="var(--diagram-line)"
                    strokeWidth="1"
                  />
                )}
              </g>
            ))}
          </svg>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href={`/systems/${system.id}`} className="font-mono text-xs link-underline">
          View Project
        </Link>
        <Link href={`/systems/${system.id}/inspect`} className="font-mono text-xs link-underline">
          Inspect System
        </Link>
        {system.insideBuild && (
          <Link href={`/systems/${system.id}/build`} className="font-mono text-xs link-underline">
            Inside the Build
          </Link>
        )}
      </div>
    </article>
  );
}

"use client";

import { useState } from "react";
import type { SystemNode } from "@/content/site-content";

interface ArchitectureDiagramProps {
  nodes: SystemNode[];
  connections: { from: string; to: string }[];
  systemName: string;
}

export function ArchitectureDiagram({ nodes, connections, systemName }: ArchitectureDiagramProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const selected = nodes.find((n) => n.id === selectedNode);

  const positions: Record<string, { x: number; y: number }> = {};
  const cols = Math.min(nodes.length, 4);
  nodes.forEach((node, i) => {
    positions[node.id] = {
      x: 60 + (i % cols) * 180,
      y: 40 + Math.floor(i / cols) * 100,
    };
  });

  const svgWidth = Math.max(cols * 180 + 40, 400);
  const svgHeight = Math.ceil(nodes.length / cols) * 100 + 60;

  return (
    <div>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full border border-border bg-[var(--diagram-bg)] transition-colors duration-200"
        role="img"
        aria-label={`Architecture diagram for ${systemName}`}
      >
        {connections.map((conn, i) => {
          const from = positions[conn.from];
          const to = positions[conn.to];
          if (!from || !to) return null;
          return (
            <line
              key={i}
              x1={from.x + 70}
              y1={from.y + 24}
              x2={to.x + 70}
              y2={to.y + 24}
              stroke="var(--diagram-line)"
              strokeWidth="1"
              markerEnd="url(#arrowhead)"
            />
          );
        })}
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="var(--diagram-line)" />
          </marker>
        </defs>
        {nodes.map((node, i) => {
          const pos = positions[node.id];
          const isSelected = selectedNode === node.id;
          return (
            <g
              key={node.id}
              onClick={() => setSelectedNode(isSelected ? null : node.id)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedNode(isSelected ? null : node.id);
                }
              }}
            >
              <rect
                x={pos.x}
                y={pos.y}
                width="140"
                height="48"
                fill={i % 2 === 0 ? "var(--diagram-node)" : "var(--diagram-node-alt)"}
                stroke={isSelected ? "var(--diagram-selected)" : "var(--diagram-border)"}
                strokeWidth={isSelected ? 2 : 1}
                rx="2"
              />
              <text
                x={pos.x + 70}
                y={pos.y + 20}
                textAnchor="middle"
                fill="var(--diagram-text)"
                fontSize="11"
                fontFamily="var(--font-jetbrains)"
              >
                {node.label}
              </text>
              <text
                x={pos.x + 70}
                y={pos.y + 36}
                textAnchor="middle"
                fill="var(--diagram-text-sub)"
                fontSize="9"
                fontFamily="var(--font-jetbrains)"
              >
                {node.type}
              </text>
            </g>
          );
        })}
      </svg>

      {selected && (
        <div className="mt-4 border border-border bg-surface-muted p-4">
          <p className="mono-label mb-3">{selected.label} — implementation detail</p>
          <dl className="grid gap-2 font-mono text-xs">
            {selected.details.framework && (
              <>
                <dt className="text-subtle">Framework</dt>
                <dd className="text-foreground">{selected.details.framework}</dd>
              </>
            )}
            {selected.details.auth && (
              <>
                <dt className="text-subtle">Auth</dt>
                <dd className="text-foreground">{selected.details.auth}</dd>
              </>
            )}
            {selected.details.dataAccess && (
              <>
                <dt className="text-subtle">Data Access</dt>
                <dd className="text-foreground">{selected.details.dataAccess}</dd>
              </>
            )}
            {selected.details.validation && (
              <>
                <dt className="text-subtle">Validation</dt>
                <dd className="text-foreground">{selected.details.validation}</dd>
              </>
            )}
            {selected.details.testing && (
              <>
                <dt className="text-subtle">Testing</dt>
                <dd className="text-foreground">{selected.details.testing}</dd>
              </>
            )}
            {selected.details.notes && (
              <>
                <dt className="text-subtle">Notes</dt>
                <dd className="text-foreground">{selected.details.notes}</dd>
              </>
            )}
          </dl>
        </div>
      )}

      {!selectedNode && (
        <p className="mt-2 font-mono text-xs text-subtle">
          Click a node to inspect implementation details
        </p>
      )}
    </div>
  );
}

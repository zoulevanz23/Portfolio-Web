"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";

interface StackNode {
  name: string;
  category: string;
  tier: number;
  usageCount: number;
  projects: string[];
  personality: string;
}

interface StackOrganismProps {
  items: StackNode[];
}

const CATEGORY_ORDER = ["core", "supporting", "data", "infra", "testing", "integrations", "ai-exploration"];

const CATEGORY_NEON: Record<string, string> = {
  core: "var(--map-core)",
  supporting: "var(--map-supporting)",
  data: "var(--map-data)",
  infra: "var(--map-infra)",
  testing: "var(--map-testing)",
  integrations: "var(--map-integrations)",
  "ai-exploration": "var(--map-ai-exploration)",
};

const TIER_RADIUS: Record<number, number> = {
  1: 14,
  2: 10,
  3: 7,
  4: 5,
};

interface AnimNode {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  r: number;
  item: StackNode;
}

// Meaningful connections between related technologies
const CONNECTIONS: [string, string][] = [
  // Frontend cluster
  ["Next.js", "React"],
  ["React", "TypeScript"],
  ["Next.js", "TypeScript"],
  ["Next.js", "TanStack Query"],
  ["Next.js", "Tailwind CSS"],
  ["React", "Tailwind CSS"],

  // Backend cluster
  ["ASP.NET Core", "EF Core"],
  ["EF Core", "SQL Server"],
  ["ASP.NET Core", "SQL Server"],
  ["C#", ".NET 8"],
  [".NET 8", "ASP.NET Core"],
  ["C#", "ASP.NET Core"],
  ["ASP.NET Core", "Minimal APIs"],
  ["ASP.NET Core", "JWT"],

  // Data cluster
  ["SQL Server", "Redis"],
  ["Redis", "MongoDB"],

  // Infra cluster
  ["Docker", "Kubernetes"],
  ["AWS", "Azure"],
  ["Vercel", "Next.js"],
  ["AWS", "Docker"],
  ["Azure", "Docker"],
  ["Docker", "CI/CD"],
  ["GitHub Actions", "CI/CD"],

  // Testing cluster
  ["Vitest", "RTL"],
  ["xUnit", "Moq"],
  ["xUnit", "WebApplicationFactory"],

  // Integration cluster
  ["Dynamics 365", "BIR EIS"],

  // AI cluster
  ["Python", "FastAPI"],
  ["Python", "PyTorch"],
  ["LangChain", "RAG"],
  ["RAG", "Vector DB"],
  ["Ollama", "PyTorch"],
];

// Cluster centers for layout
const CLUSTER_CENTERS: Record<string, { cx: number; cy: number }> = {
  core: { cx: 400, cy: 160 },
  supporting: { cx: 400, cy: 300 },
  data: { cx: 650, cy: 220 },
  infra: { cx: 150, cy: 380 },
  testing: { cx: 650, cy: 420 },
  integrations: { cx: 150, cy: 180 },
  "ai-exploration": { cx: 400, cy: 480 },
};

const CX = 400;
const CY = 300;
const CELL = 62;
const TRAVEL_SPEED = 0.35;

function bezierPoint(
  p0: { x: number; y: number },
  c: { x: number; y: number },
  p1: { x: number; y: number },
  t: number
): { x: number; y: number } {
  const u = 1 - t;
  const a = u * u;
  const b = 2 * u * t;
  const c2 = t * t;
  return {
    x: a * p0.x + b * c.x + c2 * p1.x,
    y: a * p0.y + b * c.y + c2 * p1.y,
  };
}

function computeBasePositions(items: StackNode[]) {
  const byCategory: Record<string, StackNode[]> = {};
  for (const item of items) {
    if (!byCategory[item.category]) byCategory[item.category] = [];
    byCategory[item.category].push(item);
  }
  const positions: { x: number; y: number }[] = [];

  for (const item of items) {
    const cluster = CLUSTER_CENTERS[item.category] || { cx: 400, cy: 300 };
    const catItems = byCategory[item.category] || [];
    const idx = catItems.indexOf(item);
    const count = catItems.length;

    // Arrange in a circular pattern around cluster center
    const angle = (idx / count) * Math.PI * 2 - Math.PI / 2;
    const radius = 40 + count * 8;

    positions.push({
      x: cluster.cx + Math.cos(angle) * radius,
      y: cluster.cy + Math.sin(angle) * radius,
    });
  }

  // Push apart if overlapping — capped to 28 iterations (was 80) for instant first paint
  for (let iter = 0; iter < 28; iter++) {
    let moved = false;
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[j].x - positions[i].x;
        const dy = positions[j].y - positions[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = CELL;
        if (dist < minDist && dist > 0.1) {
          const push = (minDist - dist) / 2 + 0.5;
          const nx = dx / dist;
          const ny = dy / dist;
          positions[i].x -= nx * push;
          positions[i].y -= ny * push;
          positions[j].x += nx * push;
          positions[j].y += ny * push;
          moved = true;
        }
      }
    }
    if (!moved) break;
  }

  // Clamp to viewport
  for (const pos of positions) {
    pos.x = Math.max(40, Math.min(760, pos.x));
    pos.y = Math.max(30, Math.min(570, pos.y));
  }
  return positions;
}

function makeNodes(items: StackNode[], positions: { x: number; y: number }[], randomize: boolean) {
  return items.map((item, i) => {
    const pos = positions[i];
    return {
      x: pos.x, y: pos.y,
      baseX: pos.x, baseY: pos.y,
      vx: randomize ? (Math.random() - 0.5) * 0.2 : 0,
      vy: randomize ? (Math.random() - 0.5) * 0.2 : 0,
      r: TIER_RADIUS[item.tier] || 7,
      item,
    };
  });
}

export function StackOrganism({ items }: StackOrganismProps) {
  const basePositions = useMemo(() => computeBasePositions(items), [items]);
  const initialNodes = useMemo(() => makeNodes(items, basePositions, false), [items, basePositions]);

  const [hoveredNode, setHoveredNode] = useState<StackNode | null>(null);
  const [hoverCenter, setHoverCenter] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [animNodes, setAnimNodes] = useState<AnimNode[]>(initialNodes);
  const [phase, setPhase] = useState(0);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<AnimNode[]>(initialNodes);

  const hoveredIdx = hoveredNode ? items.findIndex((it) => it.name === hoveredNode.name) : -1;
  const anyHover = hoverCenter || hoveredIdx >= 0;

  // Find connected nodes for hover
  const connectedNames = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    const names = new Set<string>();
    names.add(hoveredNode.name);
    for (const [a, b] of CONNECTIONS) {
      if (a === hoveredNode.name) names.add(b);
      if (b === hoveredNode.name) names.add(a);
    }
    return names;
  }, [hoveredNode]);

  useEffect(() => {
    const nodes = makeNodes(items, basePositions, true);
    nodesRef.current = nodes;
    setAnimNodes(nodes);

    const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    // throttle to ~30fps to avoid React 60fps reconcile
    let frame = 0;
    let last = performance.now();
    const animate = () => {
      const now = performance.now();
      if (now - last < 32) { animRef.current = requestAnimationFrame(animate); return; }
      last = now;
      frame++;
      for (const node of nodesRef.current) {
        const driftX = Math.sin(frame * 0.006 + node.baseX * 0.008) * 0.08;
        const driftY = Math.cos(frame * 0.005 + node.baseY * 0.008) * 0.06;
        node.vx += driftX * 0.005;
        node.vy += driftY * 0.005;
        node.vx *= 0.96;
        node.vy *= 0.96;
        const dx = node.x - node.baseX;
        const dy = node.y - node.baseY;
        node.vx -= dx * 0.005;
        node.vy -= dy * 0.005;
        node.x += node.vx;
        node.y += node.vy;
      }
      // batch state every 2 frames to halve renders
      if (frame % 2 === 0) setAnimNodes([...nodesRef.current]);
      setPhase(frame);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [items, basePositions]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, []);

  // Get node position by name
  const getNodePos = useCallback((name: string) => {
    const node = animNodes.find((n) => n.item.name === name);
    return node ? { x: node.x, y: node.y } : null;
  }, [animNodes]);

  return (
    <div className="relative">
      <svg viewBox="0 0 800 600" className="w-full border border-border" onMouseMove={handleMouseMove}>
        <defs>
          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-strong" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="axonglow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="800" height="600" fill="var(--map-bg)" />

        {/* Subtle rotating rings */}
        {[1, 2, 3].map((r) => (
          <circle key={r} cx={CX} cy={CY} r={60 + r * 55}
            fill="none" stroke="var(--map-ring)" strokeWidth="0.25"
            strokeDasharray="3 12" opacity="0.08"
          >
            <animateTransform attributeName="transform" type="rotate"
              from={`0 ${CX} ${CY}`} to={`${r % 2 === 0 ? 360 : -360} ${CX} ${CY}`}
              dur={`${60 + r * 20}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Meaningful connections only */}
        {CONNECTIONS.map(([nameA, nameB], i) => {
          const posA = getNodePos(nameA);
          const posB = getNodePos(nameB);
          if (!posA || !posB) return null;

          const isNodeA = hoveredIdx >= 0 && items[hoveredIdx]?.name === nameA;
          const isNodeB = hoveredIdx >= 0 && items[hoveredIdx]?.name === nameB;
          const isLineActive = hoverCenter || isNodeA || isNodeB;
          const isDimmed = anyHover && !isLineActive;

          const nodeA = animNodes.find((n) => n.item.name === nameA);
          const color = nodeA ? CATEGORY_NEON[nodeA.item.category] : "var(--map-core)";

          const dx = posB.x - posA.x;
          const dy = posB.y - posA.y;
          const mx = (posA.x + posB.x) / 2 + dy * 0.15;
          const my = (posA.y + posB.y) / 2 - dx * 0.15;
          const path = `M${posA.x},${posA.y} Q${mx},${my} ${posB.x},${posB.y}`;
          const control = { x: mx, y: my };

          // Traveling "signal" dots — only on active lines while hovering
          const showDots = isLineActive && (hoverCenter || isNodeA || isNodeB);
          const dotCount = isNodeA || isNodeB ? 3 : 2;
          const dots = showDots
            ? Array.from({ length: dotCount }, (_, d) => {
                const t = ((phase * 0.004 * TRAVEL_SPEED + d / dotCount) % 1 + 1) % 1;
                const p = bezierPoint(posA, control, posB, t);
                const fade = Math.sin(t * Math.PI);
                return { ...p, r: isNodeA || isNodeB ? 1.6 : 1.2, opacity: 0.25 + fade * 0.75 };
              })
            : [];

          return (
            <g key={`conn-${i}`}>
              <path d={path} fill="none"
                stroke={color}
                strokeWidth={isLineActive ? 1.2 : 0.3}
                opacity={isDimmed ? 0.02 : isLineActive ? 0.5 : 0.08}
                strokeLinecap="round"
                filter={isLineActive ? "url(#axonglow)" : undefined}
              />
              {dots.map((dot, d) => (
                <circle key={`dot-${d}`} cx={dot.x} cy={dot.y} r={dot.r}
                  fill={color}
                  opacity={dot.opacity}
                  filter={isNodeA || isNodeB ? "url(#glow)" : undefined}
                />
              ))}
            </g>
          );
        })}

        {/* Nodes */}
        {animNodes.map((node, i) => {
          const isHovered = hoveredIdx === i;
          const isConnected = connectedNames.has(node.item.name);
          const isCoreHover = hoverCenter && !isHovered;
          const isActive = hoverCenter || isHovered || isConnected;
          const isDimmed = anyHover && !isActive;
          const color = CATEGORY_NEON[node.item.category] || "var(--map-core)";
          const r = node.r;

          return (
            <g key={node.item.name}>
              {/* Pulsing rings — only on individual node hover */}
              {isHovered && (
                <>
                  <circle cx={node.x} cy={node.y} r={r + 16}
                    fill="none" stroke={color} strokeWidth="0.4"
                    opacity="0.2" strokeDasharray="2 6"
                  >
                    <animate attributeName="r" values={`${r + 12};${r + 22};${r + 12}`}
                      dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={node.x} cy={node.y} r={r + 9}
                    fill="none" stroke={color} strokeWidth="0.7" opacity="0.4"
                  >
                    <animate attributeName="r" values={`${r + 7};${r + 13};${r + 7}`}
                      dur="1.5s" repeatCount="indefinite" />
                  </circle>
                </>
              )}

              {/* Subtle glow ring — core hover (all nodes) */}
              {isCoreHover && (
                <circle cx={node.x} cy={node.y} r={r + 6}
                  fill="none" stroke="var(--map-core)" strokeWidth="0.4" opacity="0.15"
                />
              )}

              {/* Outer ring */}
              <circle cx={node.x} cy={node.y} r={r + 2}
                fill="none" stroke={isCoreHover ? "var(--map-core)" : color}
                strokeWidth={isHovered ? 1.5 : 0.5}
                opacity={isDimmed ? 0.05 : isHovered ? 0.6 : isCoreHover ? 0.3 : 0.2}
              />

              {/* Body */}
              <circle cx={node.x} cy={node.y} r={r}
                fill={isCoreHover ? "var(--map-core)" : color}
                fillOpacity={isDimmed ? 0.03 : isCoreHover ? 0.1 : 0.15}
                stroke={isCoreHover ? "var(--map-core)" : color}
                strokeWidth={isHovered ? 2.5 : isCoreHover ? 1.2 : 1}
                opacity={isDimmed ? 0.1 : isCoreHover ? 0.6 : 1}
                filter={isHovered ? "url(#glow-strong)" : isCoreHover ? "url(#glow)" : "url(#glow)"}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode(node.item)}
                onMouseLeave={() => setHoveredNode(null)}
              />

              {/* Nucleus */}
              <circle cx={node.x} cy={node.y} r={r * 0.35}
                fill={isCoreHover ? "var(--map-core)" : color}
                fillOpacity={isDimmed ? 0.05 : isHovered ? 1 : isCoreHover ? 0.5 : 0.55}
              />

              {/* Label */}
              <text x={node.x} y={node.y + r + 14}
                textAnchor="middle"
                fill={isHovered ? color : isCoreHover ? "var(--map-core)" : "var(--map-text)"}
                fontSize={isHovered ? "10.5" : "8.5"}
                fontFamily="'JetBrains Mono', monospace"
                opacity={isDimmed ? 0.06 : isHovered ? 1 : isCoreHover ? 0.5 : 1}
                filter={isHovered ? "url(#axonglow)" : undefined}
                className="pointer-events-none"
                style={{ transition: "all 0.2s ease" }}
              >
                {node.item.name}
              </text>
            </g>
          );
        })}

        {/* Center label */}
        <g
          onMouseEnter={() => setHoverCenter(true)}
          onMouseLeave={() => setHoverCenter(false)}
          className="cursor-pointer"
        >
          <circle cx={CX} cy={CY} r={hoverCenter ? 28 : 20}
            fill="var(--map-core)" fillOpacity={hoverCenter ? 0.06 : 0.02}
          >
            <animate attributeName="r" values="18;24;18" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx={CX} cy={CY} r="12"
            fill="none" stroke="var(--map-core)"
            strokeWidth={hoverCenter ? 1.5 : 0.8}
            opacity={hoverCenter ? 0.5 : 0.2}
          />
          <circle cx={CX} cy={CY} r="6"
            fill="var(--map-core)" fillOpacity={hoverCenter ? 0.8 : 0.3}
            stroke="var(--map-core)" strokeWidth={hoverCenter ? 1.5 : 0.8}
            opacity={hoverCenter ? 0.9 : 0.5}
            filter="url(#glow-strong)"
          >
            <animate attributeName="r" values="5;7;5" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx={CX} cy={CY} r="2.5"
            fill="var(--map-core)" fillOpacity={hoverCenter ? 1 : 0.6}
          >
            <animate attributeName="fill-opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <text x={CX} y={CY - 20} textAnchor="middle" fill="var(--map-text)"
            fontSize="5" fontFamily="'JetBrains Mono', monospace" opacity={hoverCenter ? 0.7 : 0.25}>
            STACK
          </text>
        </g>
      </svg>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border border-border bg-surface px-5 py-3">
        {CATEGORY_ORDER.map((category) => (
          <div key={category} className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: CATEGORY_NEON[category], boxShadow: `0 0 6px ${CATEGORY_NEON[category]}` }} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{category}</span>
          </div>
        ))}
      </div>

      {/* Tier legend */}
      <div className="mt-2 flex items-center justify-center gap-6">
        <span className="font-mono text-[9px] uppercase tracking-wider text-subtle">Node size = depth of experience</span>
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4].map((tier) => (
            <div key={tier} className="flex items-center gap-1">
              <div className="rounded-full bg-current opacity-30"
                style={{ width: TIER_RADIUS[tier] * 1.5, height: TIER_RADIUS[tier] * 1.5 }} />
              <span className="font-mono text-[8px] text-subtle">T{tier}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip outside SVG */}
      {hoveredNode && (() => {
        const svgEl = typeof document !== "undefined" ? document.querySelector("svg") : null;
        const svgRect = svgEl?.getBoundingClientRect();
        const tooltipW = 288;
        const pad = 14;
        let left: number, top: number;
        if (svgRect) {
          const mx = tooltipPos.x - svgRect.left;
          left = mx < svgRect.width / 2 ? svgRect.right + pad : svgRect.left - tooltipW - pad;
          top = Math.max(svgRect.top, Math.min(tooltipPos.y - 40, svgRect.bottom - 200));
          if (left + tooltipW > window.innerWidth - 10) left = svgRect.left - tooltipW - pad;
          if (left < 10) left = svgRect.right + pad;
          if (left + tooltipW > window.innerWidth - 10) { left = svgRect.right - tooltipW - pad; top = svgRect.top + pad; }
        } else { left = tooltipPos.x + 16; top = tooltipPos.y - 8; }
        return (
          <div className="pointer-events-none fixed z-50 w-72 border border-border bg-surface p-4 shadow-lg backdrop-blur-sm"
            style={{ left, top, boxShadow: `0 0 24px ${CATEGORY_NEON[hoveredNode.category]}` }}>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full"
                style={{ backgroundColor: CATEGORY_NEON[hoveredNode.category], boxShadow: `0 0 8px ${CATEGORY_NEON[hoveredNode.category]}` }} />
              <p className="font-mono text-sm font-bold" style={{ color: CATEGORY_NEON[hoveredNode.category] }}>
                {hoveredNode.name}
              </p>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-subtle">
              {hoveredNode.category} · tier {hoveredNode.tier}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{hoveredNode.personality}</p>
            {hoveredNode.projects.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {hoveredNode.projects.map((p) => (
                  <span key={p} className="border px-1.5 py-0.5 font-mono text-[9px]"
                    style={{ borderColor: CATEGORY_NEON[hoveredNode.category], color: CATEGORY_NEON[hoveredNode.category] }}>
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

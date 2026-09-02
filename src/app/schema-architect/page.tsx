"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { SectionHeader } from "@/components/SectionHeader";

type Section = { type: string; lines: string[] };

const HEADINGS = [
  "Overview",
  "Tables",
  "Relationships",
  "Normalization",
  "Indexes & Optimizations",
  "Caveats",
];

type ColumnFlag = "pk" | "fk" | "unique" | null;

interface Column {
  name: string;
  flag: ColumnFlag;
}

interface Table {
  name: string;
  columns: Column[];
}

interface Rel {
  from: string;
  fromCard: string;
  to: string;
  toCard: string;
}

function parseSections(raw: string): Section[] {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const sections: Section[] = [];
  let current: string | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (current) {
      const body = buffer.join("\n").trim();
      if (body) sections.push({ type: current, lines: body.split("\n") });
    }
  };

  for (const line of lines) {
    const match = /^##\s*(.+)$/.exec(line.trim());
    if (match) {
      flush();
      const heading = match[1].trim();
      current = HEADINGS.find((h) => h.toLowerCase() === heading.toLowerCase()) || null;
      buffer = [];
    } else if (current) {
      buffer.push(line.trim());
    }
  }
  flush();
  return sections;
}

function parseColumns(raw: string): Column[] {
  return raw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => {
      const lower = c.toLowerCase();
      const pk = /\bpk\b/.test(lower) || /^pk[ .:-]/i.test(c) || /\bpk$/.test(c);
      const fk = /fk\b/i.test(lower) || /->/.test(c) || /references/i.test(c);
      const unique = /unique/i.test(lower) || /(unique)/i.test(c);
      let flag: ColumnFlag = null;
      if (pk) flag = "pk";
      else if (fk) flag = "fk";
      else if (unique) flag = "unique";
      const clean = c
        .replace(/\bpk\b/gi, "")
        .replace(/\bfk\b/gi, "")
        .replace(/\bunique\b/gi, "")
        .replace(/->.*$/, "")
        .replace(/\(\)/g, "")
        .replace(/\s+/g, " ")
        .replace(/,\s*$/, "")
        .replace(/\/\s*$/, "")
        .trim();
      return { name: clean || c.trim(), flag };
    });
}

function parseTables(lines: string[]): Table[] {
  return lines
    .map((l) => {
      const m = /^-?\s*\*\*([^*]+)\*\*:\s*(.+)$/.exec(l);
      return m ? { name: m[1].trim(), columns: parseColumns(m[2].trim()) } : null;
    })
    .filter((t): t is Table => !!t);
}

function cleanTableRef(raw: string): string {
  let s = raw.trim();
  // strip markdown ** __ ` and surrounding quotes
  s = s.replace(/^[*`_\"']+|[*`_\"']+$/g, "").trim();
  s = s.replace(/\*\*/g, "").replace(/`/g, "").trim();
  // if the ref contains a dot like users.id or schema.users, take the table part before/after dot
  // prefer the part that matches a known table shape – take first token then split on dot
  // take first whitespace-separated token
  const firstToken = s.split(/\s+/)[0] || s;
  // split on dot and take the segment that looks like a table (contains underscore or letters)
  // e.g. "users.id" -> "users", "public.users" -> "users"
  const dotParts = firstToken.split(".");
  // pick the part that is not a column-like suffix with trailing parens
  let candidate = dotParts[0] || firstToken;
  // if there is a dot and the last part looks like a column, the first is table
  if (dotParts.length > 1) {
    // if first part is short and second part longer, still table is first
    candidate = dotParts[0];
    // but handle schema.table -> table is second
    if (candidate.toLowerCase() === "public" || candidate.toLowerCase() === "dbo") {
      candidate = dotParts[dotParts.length - 1] || candidate;
    }
  }
  candidate = candidate.replace(/[^a-zA-Z0-9_]/g, "");
  return candidate;
}

function parseRels(lines: string[]): Rel[] {
  const rels: Rel[] = [];
  for (const raw of lines) {
    let line = raw.trim();
    // remove leading bullet / bold markers for matching
    // tolerate en-dash / em-dash as separator
    line = line.replace(/[—–]/g, "-");
    // quick check must contain cardinality pattern like "1 - *" or "* - 1"
    const m = /^\s*-?\s*(.+?)\s+(\d|\*)\s*-\s*(\d|\*)\s+(.+?)(?:\s*\(via.+\))?$/i.exec(line);
    if (m) {
      const fromRaw = m[1].trim();
      const toRaw = m[4].trim();
      rels.push({
        from: cleanTableRef(fromRaw) || fromRaw.replace(/[*`_]/g, "").trim(),
        fromCard: m[2],
        toCard: m[3],
        to: cleanTableRef(toRaw) || toRaw.replace(/[*`_]/g, "").trim(),
      });
    }
  }
  return rels;
}

const ACCENT = "var(--schema-accent)";
const ACCENT_SOFT = "var(--schema-accent-soft)";
const BORDER = "var(--schema-border)";
const FILL = "var(--schema-fill)";
const FILL_SOFT = "var(--schema-fill-soft)";

function ConnectorIcon() {
  return (
    <span aria-hidden className="font-mono text-[10px] font-semibold" style={{ color: ACCENT }}>
      +-
    </span>
  );
}

const FLAG_LABEL: Record<Exclude<ColumnFlag, null>, string> = {
  pk: "PK",
  fk: "FK",
  unique: "UQ",
};

function ColumnRow({ col }: { col: Column }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b py-1 last:border-0 last:pb-0"
      style={{ borderColor: BORDER }}>
      <span className="truncate font-mono text-xs text-foreground">{col.name}</span>
      {col.flag ? (
        <span
          className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold"
          style={
            col.flag === "pk"
              ? { background: ACCENT_SOFT, color: ACCENT }
              : { background: "var(--schema-accent-soft)", color: "var(--schema-good)" }
          }
        >
          {FLAG_LABEL[col.flag]}
        </span>
      ) : (
        <ConnectorIcon />
      )}
    </div>
  );
}

function TableCard({ table }: { table: Table }) {
  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ borderColor: BORDER, backgroundColor: FILL }}
    >
      <div
        className="flex items-center gap-2 border-b px-3 py-2"
        style={{ borderColor: BORDER, background: FILL_SOFT }}
      >
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
        />
        <p className="truncate font-mono text-sm font-semibold text-foreground">
          {table.name}
        </p>
      </div>
      <div className="px-3 py-2">
        {table.columns.length > 0 ? (
          table.columns.map((c, i) => <ColumnRow key={`${c.name}-${i}`} col={c} />)
        ) : (
          <p className="font-mono text-xs text-muted">—</p>
        )}
      </div>
    </div>
  );
}

function MonoList({ lines, spaced }: { lines: string[]; spaced?: boolean }) {
  return (
    <div className={spaced ? "space-y-2" : "space-y-1"}>
      {lines.map((line, i) => {
        const clean = line.replace(/^-?\s*/, "");
        return (
          <p key={i} className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted">
            {clean}
          </p>
        );
      })}
    </div>
  );
}

/* ── ERD Diagram — compact + expanded dynamic layouts ── */

function normalizeKey(k: string): string {
  return cleanTableRef(k).toLowerCase();
}

type ErdCfg = { W: number; COLS: number; WIDE: number; TALL: number; GAP_X: number; GAP_Y: number; PAD: number };
const ERD_CFG_COMPACT: ErdCfg = { W: 980, COLS: 3, WIDE: 260, TALL: 52, GAP_X: 56, GAP_Y: 30, PAD: 20 };
const ERD_CFG_EXPANDED: ErdCfg = { W: 1400, COLS: 4, WIDE: 300, TALL: 56, GAP_X: 72, GAP_Y: 32, PAD: 28 };

function buildErdPositionsClustered(
  tableNames: string[],
  rels: Rel[],
  cfg: ErdCfg
): Map<string, { x: number; y: number }> {
  // Build undirected adjacency + degree
  const degree = new Map<string, number>();
  const adj = new Map<string, Set<string>>();
  tableNames.forEach((n) => { degree.set(n, 0); adj.set(n, new Set()); });
  const lowerLookup = new Map<string, string>();
  tableNames.forEach((n) => lowerLookup.set(normalizeKey(n), n));
  const normRels: { a: string; b: string }[] = [];
  for (const r of rels) {
    const a = lowerLookup.get(normalizeKey(r.from)) || tableNames.find((n) => normalizeKey(n) === normalizeKey(r.from));
    const b = lowerLookup.get(normalizeKey(r.to)) || tableNames.find((n) => normalizeKey(n) === normalizeKey(r.to));
    if (a && b) {
      normRels.push({ a, b });
      adj.get(a)!.add(b); adj.get(b)!.add(a);
      degree.set(a, (degree.get(a) || 0) + 1);
      degree.set(b, (degree.get(b) || 0) + 1);
    }
  }

  // Grid cells
  const total = tableNames.length;
  const rows = Math.ceil(total / cfg.COLS);
  const cells: { col: number; row: number; x: number; y: number }[] = [];
  const innerW = cfg.W - cfg.PAD * 2;
  const colW = innerW / cfg.COLS;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cfg.COLS; c++) cells.push({
    col: c, row: r,
    x: cfg.PAD + colW * c + (colW - cfg.WIDE) / 2,
    y: cfg.PAD + r * (cfg.TALL + cfg.GAP_Y),
  });
  cells.sort((a, b) => {
    const ac = cfg.COLS / 2 - 0.5, ar = rows / 2 - 0.5;
    return (Math.hypot(a.col - ac, a.row - ar) - Math.hypot(b.col - ac, b.row - ar));
  });

  const sortedByDegree = [...tableNames].sort((a, b) => (degree.get(b) || 0) - (degree.get(a) || 0) || a.localeCompare(b));
  const hub = sortedByDegree[0] || tableNames[0];

  const placed = new Map<string, { col: number; row: number; x: number; y: number }>();
  const free = [...cells];
  const takeCellFor = (node: string) => {
    if (placed.size === 0) {
      const idx = 0;
      const cell = free.splice(idx, 1)[0];
      placed.set(node, cell); return cell;
    }
    const neighbors = [...(adj.get(node) || [])].filter((n) => placed.has(n));
    if (neighbors.length === 0) {
      const cell = free.shift()!;
      placed.set(node, cell); return cell;
    }
    // pick free cell minimizing sum Manhattan distance to placed neighbors
    let bestIdx = 0, bestScore = Infinity;
    for (let i = 0; i < free.length; i++) {
      const c = free[i];
      let s = 0;
      for (const nb of neighbors) { const p = placed.get(nb)!; s += Math.abs(c.col - p.col) + Math.abs(c.row - p.row); }
      s += Math.hypot(c.col - cfg.COLS / 2, c.row - rows / 2) * 0.15;
      if (s < bestScore) { bestScore = s; bestIdx = i; }
    }
    const cell = free.splice(bestIdx, 1)[0];
    placed.set(node, cell); return cell;
  };

  // BFS clustered order starting from hub
  const queue: string[] = [hub];
  const visited = new Set<string>([hub]);
  takeCellFor(hub);
  let qIdx = 0;
  // pre-enqueue high-degree neighbors
  const enqueueNeighbors = (n: string) => {
    const nbs = [...(adj.get(n) || [])].sort((a, b) => (degree.get(b) || 0) - (degree.get(a) || 0));
    for (const nb of nbs) if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }
  };
  enqueueNeighbors(hub);
  while (qIdx < queue.length) {
    const cur = queue[qIdx++]; if (!placed.has(cur)) takeCellFor(cur);
    enqueueNeighbors(cur);
  }
  // isolated nodes left
  for (const n of sortedByDegree) if (!placed.has(n)) takeCellFor(n);

  const map = new Map<string, { x: number; y: number }>();
  for (const [name, cell] of placed) map.set(name, { x: cell.x, y: cell.y });
  return map;
}

function getBorderAnchorCfg(
  ax: number, ay: number, bx: number, by: number, cfg: ErdCfg
): { ax: number; ay: number; bx: number; by: number } {
  const dx = bx - ax, dy = by - ay;
  if (Math.abs(dx) > Math.abs(dy)) {
    return { ax: ax + Math.sign(dx) * (cfg.WIDE / 2 - 2), ay, bx: bx - Math.sign(dx) * (cfg.WIDE / 2 - 2), by };
  }
  return { ax, ay: ay + Math.sign(dy) * (cfg.TALL / 2 - 2), bx, by: by - Math.sign(dy) * (cfg.TALL / 2 - 2) };
}

function findTableKey(input: string, nameMap: Map<string, string>): string | undefined {
  const norm = normalizeKey(input);
  if (nameMap.has(norm)) return nameMap.get(norm);
  for (const [k, v] of nameMap) { if (k.includes(norm) || norm.includes(k)) return v; }
  if (norm.endsWith("s")) { const s = norm.slice(0, -1); if (nameMap.has(s)) return nameMap.get(s); }
  else { if (nameMap.has(norm + "s")) return nameMap.get(norm + "s"); }
  return undefined;
}

function ErdDiagram({ tables, rels, expanded = false }: { tables: Table[]; rels: Rel[]; expanded?: boolean }) {
  const cfg = expanded ? ERD_CFG_EXPANDED : ERD_CFG_COMPACT;
  const names = tables.map((t) => t.name);
  const rows = Math.ceil(names.length / cfg.COLS) || 1;
  const height = cfg.PAD * 2 + rows * cfg.TALL + (rows - 1) * cfg.GAP_Y;

  // draggable positions — init clustered, then free-form
  const [positions, setPositions] = useState<Map<string, { x: number; y: number }>>(() => buildErdPositionsClustered(names, rels, cfg));
  // re-cluster when tables/rels/cfg change (new schema or expand toggle)
  useEffect(() => { setPositions(buildErdPositionsClustered(names, rels, cfg)); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tables.map((t) => t.name).join("|"), rels.length, expanded]);

  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ id: string | null; offX: number; offY: number }>({ id: null, offX: 0, offY: 0 });
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const toSvgCoords = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const sx = cfg.W / rect.width;
    const sy = height / rect.height;
    return { x: (clientX - rect.left) * sx, y: (clientY - rect.top) * sy };
  }, [cfg.W, height]);

  const onPointerDown = useCallback((e: React.PointerEvent, name: string) => {
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    const p = positions.get(name);
    if (!p) return;
    const { x, y } = toSvgCoords(e.clientX, e.clientY);
    dragRef.current = { id: name, offX: x - p.x, offY: y - p.y };
    setDraggingId(name);
    e.preventDefault();
  }, [positions, toSvgCoords]);

  const onPointerMove = useCallback((e: React.PointerEvent | PointerEvent) => {
    const drag = dragRef.current;
    if (!drag.id) return;
    const { x, y } = toSvgCoords((e as PointerEvent).clientX, (e as PointerEvent).clientY);
    const nx = Math.max(0, Math.min(cfg.W - cfg.WIDE, x - drag.offX));
    const ny = Math.max(0, Math.min(height - cfg.TALL, y - drag.offY));
    setPositions((prev) => {
      const cur = prev.get(drag.id!);
      if (!cur || (Math.abs(cur.x - nx) < 0.5 && Math.abs(cur.y - ny) < 0.5)) return prev;
      const next = new Map(prev);
      next.set(drag.id!, { x: nx, y: ny });
      return next;
    });
  }, [toSvgCoords, cfg.W, cfg.WIDE, cfg.TALL, height]);

  const onPointerUp = useCallback(() => {
    dragRef.current.id = null;
    setDraggingId(null);
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => onPointerMove(e);
    const up = () => onPointerUp();
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [onPointerMove, onPointerUp]);

  const nameMap = new Map<string, string>();
  names.forEach((n) => nameMap.set(normalizeKey(n), n));
  const resolved: { r: Rel; aKey: string; bKey: string }[] = [];
  const unresolved: Rel[] = [];
  for (const r of rels) {
    const aKey = findTableKey(r.from, nameMap);
    const bKey = findTableKey(r.to, nameMap);
    if (aKey && bKey) resolved.push({ r, aKey, bKey });
    else unresolved.push(r);
  }
  const edges = resolved;
  const [hovered, setHovered] = useState<string | null>(null);
  const isDense = edges.length > 14;

  const CARD_LABEL = (r: Rel) => `${r.fromCard} : ${r.toCard}`;

  const doReset = useCallback(() => setPositions(buildErdPositionsClustered(names, rels, cfg)), [names, rels, cfg]);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] text-subtle">
          <span className="hidden sm:inline">Drag tables to rearrange — lines follow dynamically</span>
          <span className="sm:hidden">Drag tables</span>
        </span>
        <button
          onClick={doReset}
          className="rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold hover:opacity-80"
          style={{ borderColor: BORDER, backgroundColor: FILL_SOFT, color: "var(--text-muted)" }}
          title="Reset to clustered layout"
        >
          ↺ Reset layout
        </button>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${cfg.W} ${height}`}
        className="w-full select-none touch-none"
        role="img"
        aria-label="Table relationship diagram"
        style={{ minHeight: 220 }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <defs>
          <pattern id={expanded ? "erd-grid-exp" : "erd-grid"} width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1.1" fill="var(--schema-border)" opacity="0.25" />
          </pattern>
          <filter id="erd-glow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={ACCENT} floodOpacity="0.28" /></filter>
          <filter id="erd-node-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.14" /></filter>
          <linearGradient id={expanded ? "erd-line-grad-exp" : "erd-line-grad"} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.95" /><stop offset="100%" stopColor="var(--schema-primary)" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width={cfg.W} height={height} rx="16" fill={FILL} />
        <rect x="0" y="0" width={cfg.W} height={height} rx="16" fill={`url(#${expanded ? "erd-grid-exp" : "erd-grid"})`} opacity={expanded ? 0.35 : 0.5} />

        {/* edges */}
        {(() => {
          const pairCount = new Map<string, number>();
          const pairTotal = new Map<string, number>();
          for (const e of edges) {
            const k = [e.aKey.toLowerCase(), e.bKey.toLowerCase()].sort().join("::");
            pairTotal.set(k, (pairTotal.get(k) || 0) + 1);
          }
          return edges.map(({ r, aKey, bKey }, i) => {
            const a = positions.get(aKey)!, b = positions.get(bKey)!;
            const cxA = a.x + cfg.WIDE / 2, cyA = a.y + cfg.TALL / 2;
            const cxB = b.x + cfg.WIDE / 2, cyB = b.y + cfg.TALL / 2;
            const { ax: ax0, ay: ay0, bx: bx0, by: by0 } = getBorderAnchorCfg(cxA, cyA, cxB, cyB, cfg);
            const pairKey = [aKey.toLowerCase(), bKey.toLowerCase()].sort().join("::");
            const seen = pairCount.get(pairKey) || 0; pairCount.set(pairKey, seen + 1);
            const total = pairTotal.get(pairKey) || 1;
            const fanStep = isDense ? 14 : 18;
            const offsetIdx = seen - (total - 1) / 2;
            const len0 = Math.hypot(bx0 - ax0, by0 - ay0) || 1;
            const perpX = -(by0 - ay0) / len0, perpY = (bx0 - ax0) / len0;
            const ax = ax0 + perpX * offsetIdx * fanStep * 0.45;
            const ay = ay0 + perpY * offsetIdx * fanStep * 0.45;
            const bx = bx0 + perpX * offsetIdx * fanStep * 0.45;
            const by = by0 + perpY * offsetIdx * fanStep * 0.45;
            const dx = bx - ax, dy = by - ay;
            const isH = Math.abs(dx) >= Math.abs(dy);

            // orthogonal-ish cubic with longer spread in expanded mode
            const baseH = expanded ? 92 : 72;
            const baseV = expanded ? 44 : 30;
            const hOff = Math.max(baseH, Math.min(expanded ? 260 : 200, Math.abs(dx) * 0.52 + 38));
            const vOff = Math.max(baseV, Math.min(expanded ? 120 : 90, Math.abs(dy) * 0.38 + 18));
            const c1x = isH ? ax + Math.sign(dx) * hOff + perpX * offsetIdx * 8 : ax + perpX * 10;
            const c1y = isH ? ay + perpY * offsetIdx * 6 : ay + Math.sign(dy) * vOff;
            const c2x = isH ? bx - Math.sign(dx) * hOff + perpX * offsetIdx * 8 : bx + perpX * 10;
            const c2y = isH ? by + perpY * offsetIdx * 6 : by - Math.sign(dy) * vOff;
            const pathD = `M ${ax} ${ay} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${bx} ${by}`;

            // pill with staggered offset so they never stack - use golden angle jitter
            const jitterX = ((i * 137.5) % 30) - 15;
            const jitterY = ((i * 67.7) % 22) - 11;
            const mx = (ax + bx) / 2 + (isH ? jitterX * 0.5 : Math.sign(dx) * 8) + perpX * offsetIdx * 7;
            const my = (ay + by) / 2 + jitterY + perpY * offsetIdx * 4;

            const isMM = r.fromCard === "*" && r.toCard === "*";
            const is1M = (r.fromCard === "1" && r.toCard === "*") || (r.fromCard === "*" && r.toCard === "1");
            const dash = isMM ? "7 7" : is1M ? "0" : "8 6";
            const isDashed = isMM;
            const edgeId = `${aKey}::${bKey}::${i}`;
            const isHover = hovered !== null;
            const isActive = hovered === edgeId || hovered === aKey || hovered === bKey;
            const opacity = !isHover ? 0.95 : isActive ? 0.98 : 0.14;
            const sw = isDense ? (isDashed ? 1.5 : 1.65) : (isDashed ? 1.7 : 1.9);

            const foot = (x: number, y: number, side: "from" | "to") => {
              const card = side === "from" ? r.fromCard : r.toCard;
              if (card !== "*") {
                const ang = Math.atan2(by - ay, bx - ax), perp = ang + Math.PI / 2, len = isDense ? 6 : 7;
                const x1 = x + Math.cos(perp) * (len / 2), y1 = y + Math.sin(perp) * (len / 2);
                const x2 = x - Math.cos(perp) * (len / 2), y2 = y - Math.sin(perp) * (len / 2);
                return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={ACCENT} strokeWidth={isDense ? 1.7 : 1.9} strokeLinecap="round" opacity={opacity} />;
              }
              const ang = Math.atan2(by - ay, bx - ax), dir = side === "from" ? ang + Math.PI : ang;
              const prongLen = isDense ? 7 : 8, spread = 0.5;
              const tips = [-spread, 0, spread].map((a) => ({ x: x + Math.cos(dir + a) * prongLen, y: y + Math.sin(dir + a) * prongLen }));
              return <g stroke={ACCENT} strokeWidth={isDense ? 1.5 : 1.7} strokeLinecap="round" opacity={opacity}>{tips.map((t, idx) => <line key={idx} x1={x} y1={y} x2={t.x} y2={t.y} />)}</g>;
            };

            return (
              <g key={edgeId} onMouseEnter={() => setHovered(edgeId)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
                <path d={pathD} fill="none" stroke={ACCENT} strokeWidth={isDense ? 7 : 9} opacity={isActive ? 0.09 : 0.04} strokeLinecap="round" />
                <path d={pathD} fill="none" stroke={`url(#${expanded ? "erd-line-grad-exp" : "erd-line-grad"})`} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash === "0" ? undefined : dash} opacity={opacity} />
                <circle cx={ax} cy={ay} r={isDense ? 4 : 4.5} fill={ACCENT} stroke={FILL} strokeWidth={isDense ? 1.4 : 1.6} opacity={opacity} />
                <circle cx={bx} cy={by} r={isDense ? 4 : 4.5} fill="var(--schema-primary)" stroke={FILL} strokeWidth={isDense ? 1.4 : 1.6} opacity={opacity} />
                {foot(ax, ay, "from")}{foot(bx, by, "to")}
                <g opacity={opacity} filter={!isDense ? "url(#erd-glow)" : undefined}>
                  <rect x={mx - (isDense ? 28 : 32)} y={my - 10} width={isDense ? 56 : 64} height={isDense ? 18 : 20} rx="10" fill={FILL} stroke={ACCENT} strokeWidth="1" />
                  <rect x={mx - (isDense ? 28 : 32)} y={my - 10} width={isDense ? 56 : 64} height={isDense ? 18 : 20} rx="10" fill={ACCENT} opacity="0.08" />
                  <text x={mx} y={my + 3.5} textAnchor="middle" fill={ACCENT} fontSize={isDense ? "9.5" : "10"} fontWeight="700" fontFamily="'JetBrains Mono', monospace">{CARD_LABEL(r)}</text>
                </g>
              </g>
            );
          });
        })()}

        {/* nodes — draggable, lines recomputed live */}
        {names.map((name) => {
          const p = positions.get(name)!;
          const related = edges.filter((e) => e.aKey === name || e.bKey === name).length;
          const isDragging = draggingId === name;
          const isHL = hovered !== null && (hovered === name || edges.some((e) => hovered?.startsWith(`${e.aKey}::${e.bKey}`) && (e.aKey === name || e.bKey === name)));
          const dim = (hovered !== null && !isHL && !edges.some((e) => hovered === e.aKey || hovered === e.bKey)) || (draggingId !== null && draggingId !== name);
          return (
            <g
              key={name}
              filter="url(#erd-node-shadow)"
              opacity={dim ? 0.35 : 1}
              onMouseEnter={() => { if (!draggingId) setHovered(name); }}
              onMouseLeave={() => { if (!draggingId) setHovered(null); }}
              onPointerDown={(e) => onPointerDown(e, name)}
              style={{ cursor: isDragging ? "grabbing" : "grab", touchAction: "none" }}
            >
              <rect x={p.x} y={p.y} width={cfg.WIDE} height={cfg.TALL} rx="12" fill={FILL} stroke={isDragging || isHL ? "white" : ACCENT} strokeWidth={isDragging ? 2 : isHL ? 1.8 : 1.35} style={isDragging ? { filter: "drop-shadow(0 8px 20px rgba(34,211,238,0.35))" } : undefined} />
              <rect x={p.x} y={p.y} width={cfg.WIDE} height={cfg.TALL} rx="12" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
              <rect x={p.x + 9} y={p.y + 9} width="3" height={cfg.TALL - 18} rx="2" fill={ACCENT} opacity="0.9" />
              <circle cx={p.x + 24} cy={p.y + cfg.TALL / 2} r="4.2" fill={ACCENT} opacity="0.95" />
              <circle cx={p.x + 24} cy={p.y + cfg.TALL / 2} r="1.5" fill={FILL} />
              <text x={p.x + 34} y={p.y + cfg.TALL / 2 + 1} dominantBaseline="middle" fill="var(--text)" fontSize={expanded ? "12" : "11.5"} fontWeight="600" fontFamily="'JetBrains Mono', monospace">{name.length > (expanded ? 26 : 22) ? name.slice(0, expanded ? 24 : 20) + "…" : name}</text>
              {related > 0 && (
                <g>
                  <rect x={p.x + cfg.WIDE - 34} y={p.y + cfg.TALL / 2 - 9} width="22" height="18" rx="7" fill={ACCENT} opacity={isHL ? 0.22 : 0.13} />
                  <text x={p.x + cfg.WIDE - 23} y={p.y + cfg.TALL / 2 + 4} textAnchor="middle" fill={ACCENT} fontSize="9.5" fontWeight="700" fontFamily="'JetBrains Mono', monospace">{related}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      <div className="mt-3 flex flex-wrap items-center gap-3 border-t pt-3" style={{ borderColor: BORDER }}>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-subtle">Lines &amp; cardinality</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted"><span className="h-0.5 w-8 rounded" style={{ background: ACCENT }} /> 1 — 1 <span className="text-subtle">(solid)</span></span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted"><span className="h-0.5 w-8 rounded opacity-80" style={{ background: `repeating-linear-gradient(90deg, ${ACCENT} 0 6px, transparent 6px 10px)` }} /> 1 — * <span className="text-subtle">(one-to-many)</span></span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted"><span className="h-0.5 w-8 rounded opacity-60" style={{ background: `repeating-linear-gradient(90deg, ${ACCENT} 0 4px, transparent 4px 8px)` }} /> * — * <span className="text-subtle">(via junction, dashed)</span></span>
        <span className="ml-auto font-mono text-[10px] text-subtle">{names.length} tables · {edges.length}/{rels.length} connections{unresolved.length > 0 ? ` · ${unresolved.length} unmatched` : ""}{isDense ? " · hover to highlight" : ""}</span>
      </div>
      {unresolved.length > 0 && (
        <div className="mt-3 rounded-xl border px-3 py-2.5" style={{ borderColor: "rgba(251,146,60,0.35)", background: "rgba(251,146,60,0.08)" }}>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#fb923c" }}>{unresolved.length} unmatched</p>
          <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted">{unresolved.map((r) => `${r.from} ${r.fromCard}-${r.toCard} ${r.to}`).join(" · ")}</p>
        </div>
      )}
    </div>
  );
}

function RelationshipsBlock({ section, tables }: { section: Section; tables?: Table[] }) {
  const [expanded, setExpanded] = useState(false);
  const rels = parseRels(section.lines);
  const diagramTables = tables && tables.length > 0 ? tables : parseTables(section.lines);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-subtle">Relationships</p>
        <div className="flex items-center gap-2">
          <span className="rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold" style={{ borderColor: ACCENT, color: ACCENT, background: ACCENT_SOFT }}>{rels.length} connections</span>
          <button onClick={() => setExpanded(true)} disabled={diagramTables.length === 0} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] font-semibold transition-colors hover:opacity-90 disabled:opacity-40" style={{ borderColor: ACCENT, background: ACCENT, color: "white" }} title="Expand — dynamic re-layout, not just zoom"><span aria-hidden>⛶</span> Expand</button>
        </div>
      </div>
      <div className="group relative overflow-x-auto rounded-2xl border p-4 md:p-5" style={{ borderColor: ACCENT, backgroundColor: FILL, boxShadow: `0 0 0 1px ${ACCENT_SOFT}, 0 12px 40px rgba(0,0,0,0.35)` }}>
        <button onClick={() => setExpanded(true)} className="absolute right-3 top-3 z-10 hidden rounded-full border bg-background px-2.5 py-1 font-mono text-[10px] font-semibold shadow group-hover:inline-flex" style={{ borderColor: BORDER, color: "var(--text-muted)" }}>⛶ Expand</button>
        {diagramTables.length > 0 ? <ErdDiagram tables={diagramTables} rels={rels} /> : <p className="font-mono text-xs text-muted">No tables to diagram.</p>}
      </div>
      {expanded && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80 p-4 backdrop-blur-sm md:p-6" onClick={() => setExpanded(false)}>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl" style={{ borderColor: ACCENT }} onClick={(e) => e.stopPropagation()}>
            <div className="flex shrink-0 items-center justify-between border-b px-4 py-3 md:px-6" style={{ borderColor: BORDER, backgroundColor: FILL }}>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full" style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />
                <p className="font-mono text-xs font-semibold text-foreground">Relationships — expanded dynamic layout</p>
                <span className="hidden rounded-full border px-2 py-0.5 font-mono text-[10px] text-subtle md:inline-flex" style={{ borderColor: BORDER }}>{diagramTables.length} tables · {rels.length} connections · 4-col spread + hover highlight</span>
              </div>
              <button onClick={() => setExpanded(false)} className="rounded-full border px-3 py-1.5 font-mono text-xs font-semibold hover:opacity-90" style={{ borderColor: BORDER, color: "var(--text-muted)" }}>✕ Close</button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-[var(--bg)] p-4 md:p-6" style={{ backgroundColor: "var(--bg)" }}>
              <div className="min-w-[980px]"><ErdDiagram tables={diagramTables} rels={rels} expanded /></div>
            </div>
            <div className="shrink-0 border-t px-4 py-2.5 text-center font-mono text-[10px] text-subtle" style={{ borderColor: BORDER }}>Hover any table or line to highlight its connections · Scroll to pan · Click outside to close · Lines: solid 1—1, dashed 1—* (one-to-many), sparse dashed *—* (via junction)</div>
          </div>
        </div>
      )}
      {rels.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {rels.map((r, i) => {
            const isMM = r.fromCard === "*" && r.toCard === "*";
            const is1M = (r.fromCard === "1" && r.toCard === "*") || (r.fromCard === "*" && r.toCard === "1");
            return (
              <div key={`${r.from}-${r.to}-${i}`} className="flex items-center gap-2 rounded-xl border px-3 py-3" style={{ borderColor: BORDER, backgroundColor: FILL_SOFT }}>
                <span className="shrink-0 rounded-md px-2 py-1 font-mono text-[11px] font-bold" style={{ background: ACCENT_SOFT, color: ACCENT, border: `1px solid ${ACCENT}` }}>{r.fromCard}:{r.toCard}</span>
                <span className="flex min-w-0 items-center gap-1.5 font-mono text-xs"><span className="truncate font-semibold text-foreground">{r.from}</span><span className="shrink-0" style={{ color: ACCENT }}>{isMM ? "╌╌" : is1M ? "───►" : "───"}</span><span className="truncate font-semibold text-foreground">{r.to}</span></span>
                <span className="ml-auto hidden shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider sm:inline-flex" style={{ background: isMM ? "rgba(251,146,60,0.12)" : is1M ? ACCENT_SOFT : "var(--schema-fill)", color: isMM ? "#fb923c" : ACCENT, border: `1px solid ${isMM ? "rgba(251,146,60,0.35)" : BORDER}` }}>{isMM ? "M:N" : is1M ? "1:N" : "1:1"}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border p-5" style={{ borderColor: BORDER, backgroundColor: FILL_SOFT }}><MonoList lines={section.lines} spaced /></div>
      )}
      <details className="group rounded-xl border" style={{ borderColor: BORDER, backgroundColor: FILL_SOFT }}>
        <summary className="cursor-pointer list-none px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-subtle transition-colors group-open:text-muted">Raw relationship lines</summary>
        <div className="border-t px-4 py-3" style={{ borderColor: BORDER }}><MonoList lines={section.lines} spaced /></div>
      </details>
    </div>
  );
}

function SectionBlock({ section, tables }: { section: Section; tables?: Table[] }) {
  const type = section.type;

  if (type === "Overview") {
    return (
      <div
        className="rounded-xl border p-5 md:p-6"
        style={{ borderColor: BORDER, backgroundColor: FILL }}
      >
        <p
          className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: ACCENT }}
        >
          Overview
        </p>
        <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
          {section.lines.join("\n")}
        </p>
      </div>
    );
  }

  if (type === "Tables") {
    const tables = parseTables(section.lines);
    return (
      <div className="space-y-3">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-subtle">
          Tables
        </p>
        {tables.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {tables.map((t) => (
              <TableCard key={t.name} table={t} />
            ))}
          </div>
        ) : (
          <MonoList lines={section.lines} />
        )}
      </div>
    );
  }

  if (type === "Relationships") {
    return <RelationshipsBlock section={section} tables={tables} />;
  }

  if (type === "Normalization") {
    const rawText = section.lines.join("\n");
    const levelMatch = rawText.match(/(1NF|2NF|3NF|BCNF|4NF|5NF)/i);
    const level = levelMatch ? levelMatch[1].toUpperCase() : "3NF";
    const bullets = section.lines
      .filter((l) => /^\s*-\s+/.test(l) || /^\s*•/.test(l))
      .map((l) => l.replace(/^\s*[-•]\s*/, "").trim());

    const stripMd = (s: string) => s.replace(/\*\*/g, "").replace(/`/g, "").replace(/__/g, "").trim();

    const cards = bullets.map((b) => {
      const m = /^\*\*(.+?)\*\*\s*[:–—-]?\s*(.*)$/.exec(b);
      if (m) return { title: stripMd(m[1]), desc: stripMd(m[2]) };
      const m2 = /^(.+?):\s*(.*)$/.exec(b);
      if (m2 && m2[1].length < 40) return { title: stripMd(m2[1]), desc: stripMd(m2[2]) };
      return { title: "", desc: stripMd(b) };
    });

    const plainHelp: Record<string, { icon: string; why: string; example: string }> = {
      "Partial dependencies": { icon: "◫", why: "Each column depends on the whole key, not just part of it.", example: "e.g. role name lives in `roles`, not repeated in every user row." },
      "Transitive dependencies": { icon: "⇄", why: "No column depends on another non-key column.", example: "e.g. status/type live in lookup tables, not duplicated inside `service_requests`." },
      "Repeating groups": { icon: "⧉", why: "Lists are moved out so one row = one fact.", example: "e.g. many-to-many via `user_roles`, `role_permissions`, `approvals`." },
      "Denormalization": { icon: "⚡", why: "Intentionally keep a little redundancy for speed.", example: "e.g. `service_requests.status_id` for instant status without a join." },
    };

    const introLine = section.lines.find((l) => !/^\s*-\s+/.test(l) && stripMd(l).length > 0) || "";

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest" style={{ color: ACCENT }}>Normalization</p>
          <span className="rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold" style={{ borderColor: ACCENT, background: ACCENT_SOFT, color: ACCENT }}>{level}</span>
          <span className="hidden font-mono text-[10px] text-subtle sm:inline">— clean, no-duplication design</span>
        </div>

        <div
          className="rounded-xl border p-5"
          style={{ borderColor: ACCENT, backgroundColor: FILL, boxShadow: `0 0 0 1px ${ACCENT_SOFT}, 0 0 24px ${ACCENT_SOFT}` }}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm font-semibold text-foreground">
                {stripMd(introLine) || `Reaches ${level} — fully normalized`}
              </p>
              <p className="mt-1.5 font-mono text-xs leading-relaxed text-muted">
                In plain English: every fact lives in one place. No repeated lists, no hidden dependencies. That prevents update bugs (change a role name once, not in 1,000 rows) and keeps the schema predictable. <span className="text-foreground font-medium">{level}</span> means we fixed the three classic problems below — then made one <span className="text-subtle">intentional</span> exception for speed.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full border px-2 py-1 font-mono text-[10px]" style={{ borderColor: BORDER, background: FILL_SOFT, color: "var(--text-muted)" }}>1NF: no repeating lists</span>
                <span className="rounded-full border px-2 py-1 font-mono text-[10px]" style={{ borderColor: BORDER, background: FILL_SOFT, color: "var(--text-muted)" }}>2NF: no partial keys</span>
                <span className="rounded-full px-2 py-1 font-mono text-[10px] font-bold" style={{ background: ACCENT, color: "white" }}>3NF: no transitive chains ✓</span>
              </div>
            </div>
            <div className="shrink-0 rounded-xl border px-3 py-2 text-center" style={{ borderColor: BORDER, backgroundColor: FILL_SOFT }}>
              <p className="font-mono text-[10px] uppercase tracking-widest text-subtle">Normal form</p>
              <p className="font-mono text-lg font-bold" style={{ color: ACCENT }}>{level}</p>
              <p className="font-mono text-[10px] text-subtle">3rd Normal Form</p>
            </div>
          </div>
        </div>

        {cards.length > 0 ? (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {cards.map((c, i) => {
              const help = plainHelp[c.title] || plainHelp[Object.keys(plainHelp).find((k) => c.title.toLowerCase().includes(k.toLowerCase().split(" ")[0])) || ""];
              const isDenorm = c.title.toLowerCase().includes("denormal");
              return (
                <div
                  key={i}
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: isDenorm ? "rgba(251,146,60,0.35)" : BORDER,
                    backgroundColor: isDenorm ? "rgba(251,146,60,0.06)" : FILL_SOFT,
                  }}
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs" style={{ background: isDenorm ? "rgba(251,146,60,0.15)" : ACCENT_SOFT, color: isDenorm ? "#fb923c" : ACCENT }}>{help?.icon || "•"}</span>
                    <p className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: isDenorm ? "#fb923c" : ACCENT }}>{c.title || (isDenorm ? "Trade-off" : `Point ${i + 1}`)}</p>
                    {isDenorm && <span className="ml-auto rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider" style={{ background: "rgba(251,146,60,0.15)", color: "#fb923c" }}>for speed</span>}
                  </div>
                  <p className="font-mono text-xs leading-relaxed text-foreground">{c.desc}</p>
                  {help && (
                    <div className="mt-2.5 rounded-lg border px-3 py-2" style={{ borderColor: isDenorm ? "rgba(251,146,60,0.2)" : BORDER, backgroundColor: FILL }}>
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-subtle">In plain English</p>
                      <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted">{help.why}</p>
                      <p className="mt-1 font-mono text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>{help.example}</p>
                    </div>
                  )}
                  {isDenorm && !help && (
                    <p className="mt-2 font-mono text-[10px] leading-relaxed text-muted">Trade-off: faster reads (no extra join for status) at the cost of tiny redundancy — worth it for the most common query.</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border p-4" style={{ borderColor: BORDER, backgroundColor: FILL_SOFT }}>
            <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-muted">{rawText}</p>
          </div>
        )}

        <p className="font-mono text-[10px] leading-relaxed text-subtle">
          TL;DR: <span className="text-muted">Data isn’t repeated. If you rename a department, you change one row in `departments`, not thousands in `service_requests`. The one stored `status_id` is the exception — it’s kept directly on the request so dashboards load in one read.</span>
        </p>
      </div>
    );
  }

  if (type === "Indexes & Optimizations") {
    return (
      <div className="space-y-2">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-subtle">
          Indexes &amp; Optimizations
        </p>
        {section.lines.map((line, i) => {
          const clean = line.replace(/^-?\s*/, "");
          return (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border p-3"
              style={{ borderColor: BORDER, backgroundColor: FILL_SOFT }}
            >
              <span
                aria-hidden
                className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
              />
              <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted">
                {clean}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border p-5"
      style={{ borderColor: BORDER, backgroundColor: FILL_SOFT }}
    >
      <p
        className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: "var(--schema-warn)" }}
      >
        {type}
      </p>
      <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-muted">
        {section.lines.join("\n")}
      </p>
    </div>
  );
}

const DATABASES = ["SQL Server", "PostgreSQL", "MySQL"];

export default function SchemaArchitectPage() {
  const [description, setDescription] = useState("");
  const [database, setDatabase] = useState("SQL Server");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState("");

  const sections = parseSections(raw);
  const allTables = sections.find((s) => s.type === "Tables")?.lines
    ? parseTables(sections.find((s) => s.type === "Tables")!.lines)
    : [];

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) {
      setError("Describe your app first.");
      return;
    }
    setGenerating(true);
    setRaw("");
    setError(null);
    try {
      const res = await fetch("/api/ai/db-schema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          database,
        }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Failed to generate the schema. Try again.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setRaw((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch {
      setError("Network error. Couldn't generate the schema.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="section-container">
      <SectionHeader
        label="Labs"
        title="Schema Architect"
        description="Describe your app and its features. The AI designs a normalized relational schema, maps relationships visually, and recommends indexes and optimizations."
      />

      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-start">
        {/* Left: inputs */}
        <div className="lg:sticky lg:top-24">
          <form
            onSubmit={handleGenerate}
            className="rounded-xl border p-6"
            style={{ borderColor: BORDER, backgroundColor: FILL }}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-subtle">
                App &amp; features
              </p>
              <span
                className="rounded-md px-2 py-1 font-mono text-[10px] font-semibold"
                style={{ background: ACCENT_SOFT, color: ACCENT }}
              >
                {database}
              </span>
            </div>

            <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-subtle">
              Database
            </label>
            <div className="mb-4 flex flex-wrap gap-2">
              {DATABASES.map((db) => (
                <button
                  key={db}
                  type="button"
                  onClick={() => setDatabase(db)}
                  className="rounded-md border px-3 py-1.5 font-mono text-xs transition-colors"
                  style={{
                    borderColor: database === db ? ACCENT : BORDER,
                    color: database === db ? ACCENT : "var(--text-muted)",
                    background: database === db ? ACCENT_SOFT : "transparent",
                  }}
                >
                  {db}
                </button>
              ))}
            </div>

            <label htmlFor="app-desc" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-subtle">
              Describe your app
            </label>
            <textarea
              id="app-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleGenerate(e);
                }
              }}
              rows={9}
              maxLength={4000}
              placeholder={
                "Example: a task management app where users create projects, assign tasks to team members, track time on tasks, and generate invoices per client. Tasks have statuses and priorities. Admins manage users and roles."
              }
              className="input-field resize-y"
              style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: "12px" }}
            />
            <p className="mt-1 text-right font-mono text-[9px] text-subtle">
              {description.length}/4000
            </p>

            {error && (
              <p className="mb-2 font-mono text-[10px]" style={{ color: "var(--schema-warn)" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={generating || !description.trim()}
              className="mt-2 w-full rounded-lg px-6 py-2.5 font-mono text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, var(--schema-accent), var(--schema-primary))",
                boxShadow: `0 0 20px ${ACCENT_SOFT}`,
              }}
            >
              {generating ? "Designing..." : "Generate schema"}
            </button>
          </form>
        </div>

        {/* Right: output */}
        <div className="lg:min-h-[calc(100vh-260px)] lg:overflow-y-auto lg:pr-2">
          {generating && sections.length === 0 && (
            <div
              className="flex items-center gap-3 rounded-xl border p-5"
              style={{ borderColor: BORDER, backgroundColor: FILL }}
            >
              <span
                aria-hidden
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: ACCENT, boxShadow: `0 0 12px ${ACCENT}` }}
              />
              <p className="font-mono text-xs text-muted animate-pulse">
                Normalizing, mapping relationships, tuning indexes...
              </p>
            </div>
          )}

          {sections.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-subtle">
                  Generated schema
                </p>
                <span
                  className="rounded-md px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest"
                  style={{ background: ACCENT_SOFT, color: ACCENT }}
                >
                  {database}
                </span>
              </div>
              {sections.map((s, i) => (
                <SectionBlock key={`${s.type}-${i}`} section={s} tables={allTables} />
              ))}
            </div>
          )}

          {!generating && !raw && (
            <div
              className="flex h-full min-h-[260px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center"
              style={{ borderColor: BORDER, backgroundColor: FILL_SOFT }}
            >
              <div
                aria-hidden
                className="flex h-14 w-14 items-center justify-center rounded-xl font-mono text-lg font-semibold"
                style={{ background: ACCENT_SOFT, color: ACCENT }}
              >
                {"{ }"}
              </div>
              <p className="font-mono text-sm text-muted">
                Your normalized schema and relationship diagram will render here.
              </p>
              <p className="font-mono text-[10px] text-subtle">
                Describe an app, pick a database, and hit generate.
              </p>
            </div>
          )}

          {!generating && raw && sections.length === 0 && (
            <div
              className="rounded-xl border p-6"
              style={{ borderColor: BORDER, backgroundColor: FILL }}
            >
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
                {raw}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

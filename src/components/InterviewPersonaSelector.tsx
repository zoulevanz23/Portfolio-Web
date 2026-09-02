"use client";

interface PersonaSelectorProps {
  selected: string | null;
  onSelect: (persona: string) => void;
  simulationMode: boolean;
  onToggleSimulation: () => void;
}

const ACCENT = "var(--interview-accent)";
const ACCENT_SOFT = "var(--interview-accent-soft)";
const BORDER = "var(--interview-border)";
const FILL = "var(--interview-fill)";
const FILL_SOFT = "var(--interview-fill-soft)";

const personas = [
  {
    id: "hr",
    name: "Sarah",
    title: "HR Business Partner",
    description: "Conversational, professional, and caring. Wants to know the real you — not the rehearsed version.",
    style: "()",
  },
  {
    id: "interrogator",
    name: "Elena",
    title: "Staff Engineer",
    description: "Surgical precision. Asks for numbers, edge cases, and exact steps. No fluff tolerated.",
    style: "//",
  },
  {
    id: "architect",
    name: "Dmitri",
    title: "Principal Architect",
    description: "Skeptical, rigorous, references real-world systems. Will challenge every choice you made.",
    style: "{}",
  },
  {
    id: "team-lead",
    name: "Marcus",
    title: "Engineering Manager",
    description: "Former dev, now people leader. Cares about how you think AND how you work with others.",
    style: "</>",
  },
];

export function PersonaSelector({
  selected,
  onSelect,
  simulationMode,
  onToggleSimulation,
}: PersonaSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onToggleSimulation}
          className="rounded-lg border px-3 py-1.5 font-mono text-xs transition-all"
          style={{
            borderColor: simulationMode ? ACCENT : BORDER,
            color: simulationMode ? ACCENT : "var(--text-muted)",
            background: simulationMode ? ACCENT_SOFT : "transparent",
            boxShadow: simulationMode ? `0 0 16px ${ACCENT_SOFT}` : "none",
          }}
        >
          {simulationMode ? "[ SIMULATION ON ]" : "[ Simulation Mode ]"}
        </button>
        {simulationMode && (
          <span className="font-mono text-[10px] text-subtle">
            HR &rarr; Architect &rarr; Team Lead &rarr; Panel
          </span>
        )}
      </div>

      {/* Persona cards — horizontal top row (as before) */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {personas.map((p) => {
          const active = selected === p.id;
          const locked = simulationMode && p.id !== "hr";
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              disabled={locked}
              className={`group relative flex flex-col rounded-xl border p-4 text-left transition-all ${
                locked ? "opacity-40" : "hover:brightness-105 hover:-translate-y-0.5"
              }`}
              style={{
                borderColor: active ? ACCENT : BORDER,
                backgroundColor: active ? FILL_SOFT : FILL,
                boxShadow: active ? `0 0 0 1px ${ACCENT_SOFT}, 0 0 22px ${ACCENT_SOFT}` : "none",
              }}
            >
              <span
                aria-hidden
                className="absolute right-3 top-3 h-2 w-2 rounded-full"
                style={{
                  background: active ? ACCENT : "var(--bg-subtle)",
                  boxShadow: active ? `0 0 10px ${ACCENT}` : "none",
                }}
              />
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-sm font-bold"
                  style={{ color: active ? ACCENT : "var(--text-subtle)" }}
                >
                  {p.style}
                </span>
                <span className="font-mono text-sm font-semibold text-foreground">{p.name}</span>
              </div>
              <span className="mt-1 font-mono text-[10px] text-subtle">{p.title}</span>
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted line-clamp-3">
                {p.description}
              </p>
              {active && (
                <span className="mt-3 inline-flex w-fit rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white" style={{ background: ACCENT }}>
                  Selected
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

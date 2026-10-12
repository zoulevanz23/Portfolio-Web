import type { InsideBuildFlowStep } from "@/content/site-content";

interface InsideBuildFlowProps {
  flow: InsideBuildFlowStep[];
}

export function InsideBuildFlow({ flow }: InsideBuildFlowProps) {
  return (
    <ol className="flex flex-col items-stretch">
      {flow.map((step, i) => (
        <li key={step.label} className="flex flex-col items-stretch">
          <div className="surface-card">
            <p className="mono-label mb-2">
              <span className="text-subtle">{String(i + 1).padStart(2, "0")}</span>
              {" — "}
              {step.label}
            </p>
            <p className="text-sm leading-relaxed text-muted">{step.detail}</p>
          </div>
          {i < flow.length - 1 && (
            <div
              aria-hidden="true"
              className="flex items-center justify-center py-1 font-mono text-sm text-subtle"
            >
              ↓
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

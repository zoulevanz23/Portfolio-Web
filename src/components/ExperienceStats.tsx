"use client";

import { useMemo } from "react";
import { identity, yearsSince } from "@/content/site-content";

interface ExperienceStatsProps {
  rolesHeld: number;
  systemsBuilt: number;
}

function StatTile({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="border border-border bg-surface p-4 text-center">
      <p className="font-mono text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-subtle">{label}</p>
    </div>
  );
}

export function ExperienceStats({ rolesHeld, systemsBuilt }: ExperienceStatsProps) {
  // Computed at runtime so the stats tick over without a rebuild.
  const stats = useMemo(
    () => [
      { value: yearsSince(identity.experienceStart), label: "Years Experience" },
      { value: yearsSince(identity.developmentStart), label: "Years Development" },
      { value: rolesHeld, label: "Roles Held" },
      { value: systemsBuilt, label: "Systems Built" },
    ],
    [rolesHeld, systemsBuilt]
  );

  return (
    <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <StatTile key={stat.label} value={stat.value} label={stat.label} />
      ))}
    </div>
  );
}

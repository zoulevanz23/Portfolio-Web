"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import type { ValidationStatus } from "@/content/site-content";

const statusStyles: Record<ValidationStatus, string> = {
  PASSED: "status-passed",
  WARNING: "status-warning",
  CRITICAL: "status-critical",
};

interface DisabledParam {
  name: string;
  disabled: boolean;
  remark?: string;
}

const dischargeParams: DisabledParam[] = [
  { name: "color", disabled: true },
  { name: "ammonia", disabled: true },
  { name: "phosphate", disabled: true },
  { name: "free chlorine", disabled: true },
  { name: "TSS", disabled: true },
  { name: "fecal coliform", disabled: true },
  { name: "surfactant", disabled: true },
  { name: "mercury", disabled: true },
  { name: "lead", disabled: true },
];

const clarifier2Params: DisabledParam[] = [
  { name: "TSS", disabled: true },
];

const canal1Params: DisabledParam[] = [
  { name: "pH", disabled: true },
];

const canal2Params: DisabledParam[] = [
  { name: "pH", disabled: true },
];

const domesticParams: DisabledParam[] = [
  { name: "TSS", disabled: true },
];

const distillateParams: DisabledParam[] = [
  { name: "pH", disabled: true },
];

const aerationParams: DisabledParam[] = [
  { name: "TSS", disabled: true },
];

function ParameterRow({ name }: { name: string }) {
  return (
    <div className="mb-3">
      <label className="block font-mono text-xs text-muted mb-1">
        {name}
      </label>
      <input
        type="text"
        readOnly
        className="input-field w-full bg-muted/5 border border-border rounded px-3 py-2 text-sm"
        defaultValue="—"
      />
    </div>
  );
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-8">
      <p className="mono-label mb-2 text-sm text-foreground">
        {title}
      </p>
      <p className="text-muted text-sm">{description}</p>
    </div>
  );
}

export default function WaterTreatmentPage() {
  return (
    <div className="section-container">
      <SectionHeader
        label="Water Treatment Monitoring"
        title="Internal Monitoring Sections"
        description="Parameters are disabled for current phase. See dashboard table for reference values."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* DISCHARGE Section */}
        <div className="surface-card">
          <SectionTitle
            title="DISCHARGE Section"
            description="Internal monitoring parameters"
          />
          <div className="space-y-3">
            {dischargeParams.map((param) => (
              <ParameterRow key={param.name} name={param.name} />
            ))}
          </div>
        </div>

        {/* CLARIFIER 2 Section */}
        <div className="surface-card">
          <SectionTitle
            title="CLARIFIER 2 Section"
            description="Internal monitoring"
          />
          <div className="space-y-3">
            {clarifier2Params.map((param) => (
              <ParameterRow key={param.name} name={param.name} />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted italic">
            • TSS disabled for current phase
          </p>
        </div>

        {/* CANAL 1 Section */}
        <div className="surface-card">
          <SectionTitle
            title="CANAL 1"
            description="Internal monitoring"
          />
          <div className="space-y-3">
            {canal1Params.map((param) => (
              <ParameterRow key={param.name} name={param.name} />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted italic">
            • pH disabled for current phase
          </p>
        </div>

        {/* CANAL 2 Section */}
        <div className="surface-card">
          <SectionTitle
            title="CANAL 2"
            description="Internal monitoring"
          />
          <div className="space-y-3">
            {canal2Params.map((param) => (
              <ParameterRow key={param.name} name={param.name} />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted italic">
            • pH disabled for current phase
          </p>
        </div>

        {/* DOMESTIC Section */}
        <div className="surface-card">
          <SectionTitle
            title="DOMESTIC"
            description="Internal monitoring"
          />
          <div className="space-y-3">
            {domesticParams.map((param) => (
              <ParameterRow key={param.name} name={param.name} />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted italic">
            • TSS disabled for current phase
          </p>
        </div>

        {/* DISTILLATE Section */}
        <div className="surface-card">
          <SectionTitle
            title="DISTILLATE"
            description="Internal monitoring"
          />
          <div className="space-y-3">
            {distillateParams.map((param) => (
              <ParameterRow key={param.name} name={param.name} />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted italic">
            • pH disabled for current phase
          </p>
        </div>

        {/* AERATION Section */}
        <div className="surface-card">
          <SectionTitle
            title="AERATION"
            description="Internal monitoring"
          />
          <div className="space-y-3">
            {aerationParams.map((param) => (
              <ParameterRow key={param.name} name={param.name} />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted italic">
            • TSS disabled for current phase
          </p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <p className="mono-label mb-2">Development Notice</p>
        <div className="prose max-w-2xl">
          <p>
            Note: The following parameters are currently disabled and will be
            implemented in a future phase:{' '}
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted text-sm">
            <li>
              • DISCHARGE: color, ammonia, phosphate, free chlorine, TSS, fecal coliform, surfactant, mercury, lead — on development for next phase / follow up
            </li>
            <li>
              • CLARIFIER 2: TSS - on development for next phase / follow up
            </li>
            <li>
              • CANAL 1 & CANAL 2: pH - on development for next phase / follow up
            </li>
            <li>
              • DOMESTIC: TSS - on development for next phase / follow up
            </li>
            <li>
              • DISTILLATE: pH - on development for next phase / follow up
            </li>
            <li>
              • AERATION: TSS - on development for next phase / follow up
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
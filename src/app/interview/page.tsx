"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { PersonaSelector } from "@/components/InterviewPersonaSelector";
import { InterviewChat } from "@/components/InterviewChat";
import { InterviewTimer } from "@/components/InterviewTimer";
import { ResumeUpload } from "@/components/ResumeUpload";

const IN_BORDER = "var(--interview-border)";
const IN_FILL = "var(--interview-fill)";
const IN_FILL_SOFT = "var(--interview-fill-soft)";
const IN_ACCENT = "var(--interview-accent)";
const IN_ACCENT_SOFT = "var(--interview-accent-soft)";

export default function InterviewPage() {
  const [persona, setPersona] = useState<string | null>(null);
  const [simulationMode, setSimulationMode] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [candidateName, setCandidateName] = useState<string | null>(null);

  function handlePersonaSelect(p: string) {
    setPersona(p);
    setSessionKey((k) => k + 1);
  }

  function toggleSimulation() {
    setSimulationMode((prev) => !prev);
    setPersona(null);
    setSessionKey((k) => k + 1);
  }

  function resetSession() {
    setPersona(null);
    setResumeText(null);
    setResumeName(null);
    setCandidateName(null);
    setSessionKey((k) => k + 1);
  }

  return (
    <div className="section-container">
      <SectionHeader
        label="AI Interview Simulator"
        title="AI interview simulator"
        description="Practice technical interviews with AI-powered personas that reference your actual projects and experience."
      />

      <p className="mb-6 text-center font-mono text-[10px] text-subtle">
        No data is stored or recorded. This is a local practice tool only.
      </p>

      {/* Agents — horizontal top row */}
      <div
        className="mx-auto mb-6 max-w-6xl rounded-xl border p-6"
        style={{ borderColor: IN_BORDER, backgroundColor: IN_FILL }}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-subtle">
            Choose your interviewer
          </span>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: IN_ACCENT, boxShadow: `0 0 8px ${IN_ACCENT}` }} />
        </div>
        <PersonaSelector
          selected={persona}
          onSelect={handlePersonaSelect}
          simulationMode={simulationMode}
          onToggleSimulation={toggleSimulation}
        />
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-start">
        {/* Left: resume + session (sticky) */}
        <div className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-xl border p-6" style={{ borderColor: IN_BORDER, backgroundColor: IN_FILL }}>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-subtle">Resume (optional)</span>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: IN_ACCENT, boxShadow: `0 0 8px ${IN_ACCENT}` }} />
            </div>
            <ResumeUpload
              resumeText={resumeText}
              resumeName={resumeName}
              candidateName={candidateName}
              onResumeLoaded={(text, name, candidateName) => {
                setResumeText(text);
                setResumeName(name);
                setCandidateName(candidateName);
              }}
              onResumeCleared={() => {
                setResumeText(null);
                setResumeName(null);
                setCandidateName(null);
              }}
            />
            {persona && (
              <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: IN_BORDER }}>
                <InterviewTimer isRunning={!!persona} />
                <button onClick={resetSession} className="rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors hover:text-foreground" style={{ borderColor: IN_BORDER, color: "var(--text-muted)" }}>
                  New Session
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: chat (scroll area) */}
        <div className="flex min-h-[360px] flex-col gap-4 lg:min-h-[calc(100vh-260px)] lg:overflow-y-auto lg:pr-2">
          {!persona && !simulationMode && (
            <div
              className="flex min-h-[260px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center"
              style={{ borderColor: IN_BORDER, backgroundColor: IN_FILL_SOFT }}
            >
              <div
                aria-hidden
                className="flex h-14 w-14 items-center justify-center rounded-xl font-mono text-lg font-semibold"
                style={{ background: IN_ACCENT_SOFT, color: IN_ACCENT }}
              >
                &lt;/
              </div>
              <p className="font-mono text-sm text-muted">
                Pick an interviewer and the live session will render here.
              </p>
              <p className="font-mono text-[10px] text-subtle">
                Optional: upload your resume so questions reference it.
              </p>
            </div>
          )}

          <div key={sessionKey}>
            <InterviewChat
              persona={persona}
              simulationMode={simulationMode}
              resumeText={resumeText}
              candidateName={candidateName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

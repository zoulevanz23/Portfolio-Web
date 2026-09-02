"use client";

import { useRef, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";

/* Parsed sections of the roasted resume */
type RoastSection = { type: string; body: string };

const KNOWN_HEADINGS = ["Hook", "Beat", "Score", "Outro"];

function parseRoast(raw: string): RoastSection[] {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const sections: RoastSection[] = [];
  let currentType: string | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (currentType) {
      const body = buffer.join("\n").trim();
      if (body) sections.push({ type: currentType, body });
    }
  };

  for (const line of lines) {
    const match = /^##\s*(.+)$/.exec(line.trim());
    if (match) {
      flush();
      const heading = match[1].trim();
      currentType = KNOWN_HEADINGS.includes(heading) ? heading : null;
      buffer = [];
    } else if (currentType) {
      if (line.trim()) buffer.push(line.trim());
    }
  }
  flush();
  return sections;
}

const FLAME_GRADIENT =
  "linear-gradient(135deg, var(--roast-hot), var(--roast-ember))";

function BeatCard({ body, index }: { body: string; index: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border p-5 transition-colors duration-200"
      style={{
        borderColor: "var(--roast-border)",
        backgroundColor: "var(--roast-fill-soft)",
      }}
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ background: FLAME_GRADIENT }}
      />
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-semibold"
          style={{
            background: "var(--roast-flame-soft)",
            color: "var(--roast-flame)",
            boxShadow: `0 0 14px var(--roast-flame-soft)`,
          }}
        >
          {index}
        </span>
        <span
          className="font-mono text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--roast-flame)" }}
        >
          Roast {index}
        </span>
      </div>
      <p className="mt-3 whitespace-pre-wrap font-mono text-sm leading-relaxed text-muted">
        {body}
      </p>
    </div>
  );
}

function SectionCard({ type, body, index }: { type: string; body: string; index: number }) {
  if (type === "Hook") {
    return (
      <div className="relative overflow-hidden rounded-xl border p-6 md:p-7"
        style={{ borderColor: "var(--roast-border)", backgroundColor: "var(--roast-fill)" }}>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
          style={{ background: "var(--roast-flame-soft)" }}
        />
        <div className="relative">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--roast-flame)" }}>
            <svg className="mr-1.5 inline-block" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden><path d="M12 23c-3.9 0-7-3.1-7-7 0-3.1 2.4-5.8 4-7.4.3-.3.8-.1.8.3v1.1c0 .5.6.7.9.4C14.4 7.5 17 4 17 2c0-.4.5-.6.8-.3C20.3 3.8 23 7.9 23 12c0 6.1-4.9 11-11 11z"/></svg> Hook
          </span>
          <p className="mt-3 font-mono text-lg leading-relaxed text-foreground md:text-xl">
            {body}
          </p>
        </div>
      </div>
    );
  }

  if (type === "Beat") {
    return <BeatCard body={body} index={index} />;
  }

  if (type === "Score") {
    return (
      <div
        className="overflow-hidden rounded-xl border p-6"
        style={{
          borderColor: "var(--roast-flame)",
          backgroundColor: "var(--roast-fill)",
          boxShadow: `0 0 0 1px var(--roast-flame-soft), 0 0 24px var(--roast-flame-soft)`,
        }}
      >
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--roast-flame)" }}>
          <svg className="mr-1.5 inline-block" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg> Score
        </span>
        <p className="mt-3 whitespace-pre-wrap font-mono text-base font-semibold leading-relaxed text-foreground">
          {body}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-5"
      style={{ borderColor: "var(--roast-border)", backgroundColor: "var(--roast-fill-soft)" }}>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: "var(--roast-flame)" }}>
        <svg className="mr-1.5 inline-block" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 4v16h16"/><path d="M9 16l-5-5"/><path d="M14 11l5 5"/><path d="M9 12v4h4"/></svg> {type}
      </span>
      <p className="mt-3 whitespace-pre-wrap font-mono text-sm italic leading-relaxed text-muted">
        {body}
      </p>
    </div>
  );
}

export default function RoastResumePage() {
  const [uploading, setUploading] = useState(false);
  const [roasting, setRoasting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [resume, setResume] = useState<{
    text: string;
    name: string;
    candidateName: string | null;
  } | null>(null);
  const [raw, setRaw] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sections = parseRoast(raw);

  async function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      setError("Please choose a PDF file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large (max 10MB).");
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/ai/resume-parser", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to parse the PDF.");
        return;
      }

      setResume({
        text: data.text,
        name: data.name,
        candidateName: data.candidateName || null,
      });
      setRaw("");
    } catch {
      setError("Failed to upload the PDF. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  async function handleRoast() {
    if (!resume || roasting) return;
    setRoasting(true);
    setRaw("");
    setError(null);
    try {
      const res = await fetch("/api/ai/roast-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: resume.text,
          candidateName: resume.candidateName,
        }),
      });

      if (!res.ok || !res.body) {
        setError("Failed to start the roast. Try again.");
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
      setError("Network error. Couldn't finish the roast.");
    } finally {
      setRoasting(false);
    }
  }

  return (
    <div className="section-container">
      <SectionHeader
        label="Roast ur Resume"
        title="Roast ur Resume"
        description="Upload your resume and let the AI absolutely destroy it — brutal jokes, memes, and full stand-up energy. Don't cry. It's comedy."
      />

      <p className="mb-6 text-center font-mono text-[10px] text-subtle">
        No data is stored. The roast is generated on the fly and never saved.
      </p>

      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,360px)_1fr] lg:items-start">
        {/* Left: upload / controls (sticky) */}
        <div className="lg:sticky lg:top-24">
        {/* Upload */}
        <div
          className="rounded-xl border p-6"
          style={{
            borderColor: "var(--roast-border)",
            backgroundColor: "var(--roast-fill)",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-subtle">
              Your resume (PDF)
            </span>
            {resume && (
              <span
                className="rounded-md px-2 py-1 font-mono text-[10px] font-semibold"
                style={{
                  background: "var(--roast-flame-soft)",
                  color: "var(--roast-flame)",
                }}
              >
                loaded
              </span>
            )}
          </div>

          {resume ? (
            <div className="space-y-4">
              <div
                className="flex items-start gap-3 rounded-lg border p-4"
                style={{ borderColor: "var(--roast-border)", backgroundColor: "var(--roast-fill-soft)" }}
              >
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md font-mono text-sm font-bold"
                  style={{ background: "var(--roast-flame-soft)", color: "var(--roast-flame)" }}
                >
                  PDF
                </span>
                <div className="min-w-0">
                  <p className="truncate font-mono text-sm font-medium text-foreground">
                    {resume.name}
                  </p>
                  {resume.candidateName ? (
                    <p className="mt-0.5 font-mono text-[10px]" style={{ color: "var(--roast-flame)" }}>
                      Detected: {resume.candidateName} — oh no. We found you.
                    </p>
                  ) : (
                    <p className="mt-0.5 font-mono text-[10px] text-subtle">
                      Ready to get roasted. Last chance to chicken out.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleRoast}
                  disabled={roasting}
                  className="inline-block rounded-lg px-6 py-2.5 font-mono text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{
                    background: FLAME_GRADIENT,
                    boxShadow: "0 0 20px var(--roast-flame-soft)",
                  }}
                >
                  {roasting ? "Roasting..." : "Roast my resume"}
                  {!roasting && (
                    <svg className="ml-2 inline-block" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden><path d="M12 23c-3.9 0-7-3.1-7-7 0-3.1 2.4-5.8 4-7.4.3-.3.8-.1.8.3v1.1c0 .5.6.7.9.4C14.4 7.5 17 4 17 2c0-.4.5-.6.8-.3C20.3 3.8 23 7.9 23 12c0 6.1-4.9 11-11 11z"/></svg>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResume(null);
                    setRaw("");
                  }}
                  disabled={roasting}
                  className="rounded-lg border px-4 py-2.5 font-mono text-xs text-muted transition-colors hover:text-foreground disabled:opacity-50"
                  style={{ borderColor: "var(--border-muted)" }}
                >
                  Choose a different one
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-12 text-center transition-colors duration-200 focus:outline-none"
              style={{
                borderColor: dragging ? "var(--roast-flame)" : "var(--border-muted)",
                backgroundColor: dragging ? "var(--roast-flame-soft)" : "var(--roast-fill-soft)",
                boxShadow: dragging ? `0 0 24px var(--roast-flame-soft)` : "none",
              }}
            >
              <span
                aria-hidden
                className="flex h-14 w-14 items-center justify-center rounded-xl"
                style={{ background: "var(--roast-flame-soft)", color: "var(--roast-flame)" }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <path d="M12 23c-3.9 0-7-3.1-7-7 0-3.1 2.4-5.8 4-7.4.3-.3.8-.1.8.3v1.1c0 .5.6.7.9.4C14.4 7.5 17 4 17 2c0-.4.5-.6.8-.3C20.3 3.8 23 7.9 23 12c0 6.1-4.9 11-11 11z"/>
                </svg>
              </span>
              <span className="font-mono text-sm font-medium text-foreground">
                {uploading ? "Parsing PDF..." : dragging ? "Drop it. Let the smoke begin." : "Drop your resume here"}
              </span>
              <span className="font-mono text-[10px] text-subtle">or click to choose — PDF, max 10MB</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleChange}
                className="hidden"
              />
            </button>
          )}
          {error && (
            <p className="mt-3 font-mono text-[10px]" style={{ color: "var(--roast-ember)" }}>
              {error}
            </p>
          )}
        </div>
        </div>

        {/* Right: roast output */}
        <div className="lg:min-h-[calc(100vh-260px)] lg:overflow-y-auto lg:pr-2">
          {/* Roast result */}
          {roasting && sections.length === 0 && (
            <div
              className="flex items-center gap-3 rounded-xl border p-5"
              style={{ borderColor: "var(--roast-border)", backgroundColor: "var(--roast-fill)" }}
            >
              <span
                aria-hidden
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: "var(--roast-flame)", boxShadow: "0 0 12px var(--roast-flame)" }}
              />
              <p className="font-mono text-xs text-muted animate-pulse">
                Cracking knuckles, finding the smoke...
              </p>
            </div>
          )}

          {sections.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-subtle">
                  The Roast
                </span>
                <span
                  className="rounded-md px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest"
                  style={{ background: "var(--roast-flame-soft)", color: "var(--roast-flame)" }}
                >
                  Savage mode
                </span>
              </div>
              {sections.map((s, i) => (
                <SectionCard
                  key={`${s.type}-${i}`}
                  type={s.type}
                  body={s.body}
                  index={sections.filter((x, j) => x.type === "Beat" && j <= i).length}
                />
              ))}
            </div>
          )}

          {!roasting && raw && sections.length === 0 && (
            <div
              className="rounded-xl border p-6"
              style={{ borderColor: "var(--roast-border)", backgroundColor: "var(--roast-fill)" }}
            >
              <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-subtle">
                The Roast
              </p>
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
                {raw}
              </pre>
            </div>
          )}

          {!roasting && !raw && (
            <div
              className="flex h-full min-h-[260px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center"
              style={{ borderColor: "var(--border-muted)", backgroundColor: "var(--roast-fill-soft)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 4v16h16"/><path d="M9 16l-5-5"/><path d="M14 11l5 5"/><path d="M9 12v4h4"/></svg>
              <p className="font-mono text-sm text-muted">
                Your roast will land here.
              </p>
              <p className="font-mono text-[10px] text-subtle">
                Drop a resume, hit roast, brace yourself.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

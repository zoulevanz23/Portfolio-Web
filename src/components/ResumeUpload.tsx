"use client";

import { useRef, useState } from "react";

const ACCENT = "var(--interview-accent)";
const ACCENT_SOFT = "var(--interview-accent-soft)";
const BORDER = "var(--interview-border)";
const FILL_SOFT = "var(--interview-fill-soft)";
const GOOD = "var(--interview-good)";

interface ResumeUploadProps {
  resumeText: string | null;
  resumeName: string | null;
  candidateName: string | null;
  onResumeLoaded: (text: string, name: string, candidateName: string | null) => void;
  onResumeCleared: () => void;
}

export function ResumeUpload({
  resumeText,
  resumeName,
  onResumeLoaded,
  onResumeCleared,
}: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setIsUploading(true);
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

      onResumeLoaded(data.text, data.name, data.candidateName || null);
    } catch {
      setError("Failed to upload the PDF. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-subtle">
          Resume (optional)
        </span>
        {resumeText && (
          <span
            className="rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold"
            style={{ background: ACCENT_SOFT, color: ACCENT }}
          >
            loaded
          </span>
        )}
      </div>

      {resumeText ? (
        <div className="space-y-3">
          <div className="rounded-lg border p-3" style={{ borderColor: BORDER, backgroundColor: FILL_SOFT }}>
            <p className="truncate font-mono text-xs text-foreground">{resumeName}</p>
            <p className="mt-0.5 font-mono text-[11px] text-muted">
              Interviewers will base questions on your resume and what you say.
            </p>
          </div>
          <button
            onClick={onResumeCleared}
            className="rounded-lg border px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground"
            style={{ borderColor: BORDER }}
          >
            Remove resume
          </button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-4 text-center"
          style={{ borderColor: BORDER, backgroundColor: FILL_SOFT }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <p className="font-mono text-[11px] text-muted">
            Drop a PDF here or click to choose — interviewers will ask about it.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="rounded-lg px-4 py-1.5 font-mono text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${ACCENT}, var(--interview-primary))`,
              boxShadow: `0 0 14px ${ACCENT_SOFT}`,
            }}
          >
            {isUploading ? "Parsing..." : "Choose PDF"}
          </button>
          {error && <p className="font-mono text-[10px] text-status-critical">{error}</p>}
        </div>
      )}
    </div>
  );
}
